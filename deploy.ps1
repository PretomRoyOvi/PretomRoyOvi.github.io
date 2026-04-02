#Requires -Version 5.1
<#
.SYNOPSIS
  Build the Vite app and push static output to branch "main" (for GitHub Pages from / root).

.DESCRIPTION
  Run from repo root while on branch "source". Uses a temporary git worktree for "main",
  replaces its contents with dist/, commits, and pushes. No GitHub Actions required.

.NOTES
  GitHub: Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root)
#>
$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
Set-Location $Root

$SourceBranch = 'source'
$TargetBranch = 'main'

$current = (git branch --show-current).Trim()
if ($current -ne $SourceBranch) {
    Write-Error "Checkout '$SourceBranch' first (current branch: '$current'). Example: git checkout $SourceBranch"
}

Write-Host ">>> npm install" -ForegroundColor Cyan
if ($env:USE_NPM_CI -eq '1') {
    npm ci
} else {
    npm install
}

Write-Host ">>> npm run build" -ForegroundColor Cyan
npm run build

$indexHtml = Join-Path $Root 'dist/index.html'
if (-not (Test-Path -LiteralPath $indexHtml)) {
    Write-Error "Build failed: dist/index.html not found."
}

$wt = Join-Path ([System.IO.Path]::GetTempPath()) ('gh-deploy-' + [guid]::NewGuid().ToString('N'))
try {
    Write-Host ">>> git fetch" -ForegroundColor Cyan
    git fetch origin

    $hasLocalMain = $false
    git rev-parse --verify main 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $hasLocalMain = $true }

    if (-not $hasLocalMain) {
        git rev-parse --verify origin/main 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            git branch main origin/main
        } else {
            Write-Error "No 'main' branch locally or on origin. On GitHub create the repo with a default main branch, then: git fetch origin && git branch main origin/main"
        }
    }

    Write-Host ">>> worktree: $wt" -ForegroundColor Cyan
    git worktree add $wt main

    Get-ChildItem -LiteralPath $wt -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force

    $dist = Join-Path $Root 'dist'
    Copy-Item -Path (Join-Path $dist '*') -Destination $wt -Recurse -Force

    Push-Location $wt
    try {
        git add -A
        git diff --cached --quiet
        if ($LASTEXITCODE -eq 0) {
            Write-Host ">>> No changes to deploy (site already matches dist)." -ForegroundColor Yellow
        } else {
            $msg = "Deploy site $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git commit -m $msg
            git push origin $TargetBranch
            Write-Host ">>> Pushed to origin/$TargetBranch" -ForegroundColor Green
        }
    } finally {
        Pop-Location
    }
} finally {
    if (Test-Path -LiteralPath $wt) {
        git worktree remove $wt --force 2>$null
    }
}

Write-Host ">>> Done. After 1–2 minutes open: https://pretomroyovi.github.io/" -ForegroundColor Green
