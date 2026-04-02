import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User site: https://pretomroyovi.github.io/ — assets load from site root.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 5173 },
});
