import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: http://localhost:5173/  |  Production (GitHub Pages): /prism-lab/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/prism-lab/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}));
