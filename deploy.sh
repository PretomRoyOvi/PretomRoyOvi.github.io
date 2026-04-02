#!/usr/bin/env bash
# Build and push dist/ to branch "main" for GitHub Pages (no Actions).
# Run from repo root on branch "source".
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

SOURCE_BRANCH="source"
TARGET_BRANCH="main"

current="$(git branch --show-current)"
if [[ "$current" != "$SOURCE_BRANCH" ]]; then
  echo "Checkout '$SOURCE_BRANCH' first (current: '$current')." >&2
  exit 1
fi

echo ">>> npm install"
if [[ "${USE_NPM_CI:-}" == "1" ]]; then
  npm ci
else
  npm install
fi

echo ">>> npm run build"
npm run build

if [[ ! -f dist/index.html ]]; then
  echo "Build failed: dist/index.html missing." >&2
  exit 1
fi

WT="$(mktemp -d)"
cleanup() { git worktree remove "$WT" --force 2>/dev/null || true; }
trap cleanup EXIT

echo ">>> git fetch"
git fetch origin

if ! git rev-parse --verify main >/dev/null 2>&1; then
  if git rev-parse --verify origin/main >/dev/null 2>&1; then
    git branch main origin/main
  else
    echo "No main on origin. Create the repo with a default main, then fetch and retry." >&2
    exit 1
  fi
fi

echo ">>> worktree: $WT"
git worktree add "$WT" main

find "$WT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -a dist/. "$WT/"

cd "$WT"
git add -A
if git diff --cached --quiet; then
  echo ">>> No changes to deploy."
else
  git commit -m "Deploy site $(date -Iseconds)"
  git push origin "$TARGET_BRANCH"
  echo ">>> Pushed to origin/$TARGET_BRANCH"
fi

echo ">>> Done. Open: https://pretomroyovi.github.io/"
