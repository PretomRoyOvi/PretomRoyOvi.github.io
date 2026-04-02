import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages asset base:
 * - CI sets GITHUB_REPOSITORY=owner/repo → /RepoName/ for project pages, or / for user site (repo *.github.io).
 * - Local `npm run build`: same fallback as this repo (PretomRoyOvi/PretomRoyOvi → /PretomRoyOvi/).
 */
function githubPagesBase() {
  const full = process.env.GITHUB_REPOSITORY;
  if (full) {
    const repo = full.split('/')[1];
    if (repo.toLowerCase().endsWith('.github.io')) return '/';
    return `/${repo}/`;
  }
  return '/PretomRoyOvi/';
}

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? githubPagesBase() : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
