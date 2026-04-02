# PRISM Lab Static Website - Full GitHub + GitHub Pages Deployment Guide

This project is a Vite + React static website configured for GitHub Pages.

## Simple deploy (recommended): `source` + `main` + PowerShell

Use branch **`source`** for all app code. Branch **`main`** holds **only** the built site (`dist/`) for GitHub Pages — no GitHub Actions required.

**One-time GitHub setting:** Repository → **Settings** → **Pages** → **Build and deployment** → **Deploy from a branch** → Branch **`main`**, folder **`/` (root)**. (Turn off **GitHub Actions** as the Pages source if it is enabled.)

**One-time git setup** (if you only have `main` today):

```powershell
Set-Location "<path-to-this-repo>"
git checkout main
git branch source
git push -u origin source
```

On GitHub, set **default branch** to **`source`** so daily work stays on source; **`main`** is only for published HTML.

**Everyday workflow**

```powershell
Set-Location "<path-to-this-repo>"
git checkout source
git pull origin source
npm install
npm run dev
# edit files, test locally
git add .
git commit -m "Update site content"
git push origin source
.\deploy.ps1
```

Wait 1–2 minutes, then open **https://pretomroyovi.github.io/** (hash routes: `https://pretomroyovi.github.io/#/`).

**macOS / Linux:** `chmod +x deploy.sh` then `./deploy.sh`

**Optional:** `USE_NPM_CI=1 ./deploy.sh` or `$env:USE_NPM_CI='1'; .\deploy.ps1` to run `npm ci` instead of `npm install`.

**If `npm install` fails on peers:** `npm install --legacy-peer-deps`, then `npm run build`, then run the deploy script again.

---

Use the rest of this guide if you want a longer, step-by-step write-up for class submission.

## 1) Prerequisites

Install these tools first:

1. Git: https://git-scm.com/download/win
2. Node.js LTS (includes npm): https://nodejs.org/
3. GitHub account: https://github.com/

Check installation in PowerShell:

```powershell
git --version
node --version
npm --version
```

## 2) Create a New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `prism-lab`
3. Choose Public (or Private if required)
4. Do not add README/.gitignore/license from GitHub (we already have files)
5. Click Create repository

After creating, GitHub will show a URL like:

```text
https://github.com/rishat007/prism-lab.git
```

## 3) Upload Existing Local Project to GitHub (First Time)

Run these commands inside this project folder:

```powershell
cd "e:\ONE DRIVE UNT\OneDrive - UNT System\HOME PC\UNT Ph.D. 2024 (Rishat)\G. Teaching Assistant Spring 2026\PRISM LAB\Lab Website\Static Website"

git init
git add .
git commit -m "Initial commit: PRISM Lab static website"
git branch -M main
git remote add origin https://github.com/rishat007/prism-lab.git
git push -u origin main
```

If Git asks for name/email (first time only):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

## 4) Branch Workflow (Recommended for Class/Professor Submission)

Create a feature branch:

```powershell
git checkout -b feature/update-content
```

Make changes, then commit:

```powershell
git add .
git commit -m "Update homepage content"
git push -u origin feature/update-content
```

Open Pull Request:

1. Go to your GitHub repository
2. Click Compare & pull request
3. Base branch: `main`
4. Compare branch: `feature/update-content`
5. Create Pull Request and merge

After merge, sync local main:

```powershell
git checkout main
git pull origin main
```

## 5) Clone Repository on Another Computer

```powershell
git clone https://github.com/rishat007/prism-lab.git
cd prism-lab
npm install
npm run dev
```

## 6) Regular Daily Push Workflow

```powershell
git status
git add .
git commit -m "Describe your changes"
git push
```

If you are on `main`, it pushes to `origin/main`. If you are on a feature branch, it pushes to that branch.

## 7) Build and Test Locally Before Deploy

```powershell
npm install
npm run build
npm run preview
```

Preview URL is usually shown in terminal (commonly `http://localhost:4173`).

## 8) Deploy to GitHub Pages (Using `gh-pages` Branch)

This method publishes the built `dist` output to a dedicated branch called `gh-pages`.

### 8.1 Build production files

```powershell
npm run build
```

### 8.2 Push `dist` to `gh-pages`

```powershell
git subtree push --prefix dist origin gh-pages
```

If `gh-pages` does not exist, GitHub creates it automatically on first push.

### 8.3 Configure Pages in GitHub

1. Open your repository on GitHub
2. Go to Settings -> Pages
3. Under Build and deployment:
4. Source: Deploy from a branch
5. Branch: `gh-pages`
6. Folder: `/ (root)`
7. Click Save

## 9) Check Website Online

After 1-5 minutes, your site will be available at:

```text
https://rishat007.github.io/prism-lab/
```

How to verify deployment status:

1. Repository -> Settings -> Pages
2. Look for green message: "Your site is live"
3. Open the published URL

## 10) Re-Deploy After New Changes

Every time you update the website:

1. Commit and push code changes to `main`
2. Build again
3. Push fresh `dist` to `gh-pages`

Commands:

```powershell
git checkout main
git pull origin main
npm install
npm run build
git subtree push --prefix dist origin gh-pages
```

## 11) Common Problems and Fixes

### Problem: Old content still showing

Fix:

1. Hard refresh browser (`Ctrl + F5`)
2. Wait 1-5 minutes for Pages propagation
3. Confirm latest `gh-pages` commit exists on GitHub

### Problem: Git authentication failed on push

Fix:

1. Login through Git Credential Manager popup
2. Or use GitHub Personal Access Token instead of password

### Problem: `npm` not recognized

Fix:

1. Reinstall Node.js LTS
2. Restart terminal

### Problem: Route not found on refresh

This project is already configured for static hosting (relative paths and GitHub Pages-safe routing), so rebuild and redeploy.

## 12) Project Notes

- Public static data lives in `public/static-data/*.json`
- Uploads are in `uploads/`
- Build output is generated into `dist/`
- Admin CRUD features require backend APIs and are not persistent on GitHub Pages

## 13) Quick Command Cheat Sheet

```powershell
# first setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/rishat007/prism-lab.git
git push -u origin main

# create branch
git checkout -b feature/my-change

# commit and push
git add .
git commit -m "My update"
git push -u origin feature/my-change

# merge workflow (after PR merge)
git checkout main
git pull origin main

# build + deploy pages
npm install
npm run build
git subtree push --prefix dist origin gh-pages
```
