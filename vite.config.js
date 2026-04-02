import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages asset base:
 * - CI sets GITHUB_REPOSITORY=owner/repo → `/` for user site repos (`*.github.io`), else `/<repo>/`.
 * - Local `npm run build`: fallback `/` (matches PretomRoyOvi.github.io user site).
 */
function githubPagesBase() {
  const full = process.env.GITHUB_REPOSITORY;
  if (full) {
    const repo = full.split('/')[1];
    if (repo.toLowerCase().endsWith('.github.io')) return '/';
    return `/${repo}/`;
  }
  return '/';
}

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? githubPagesBase() : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
