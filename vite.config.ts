import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from a subpath on GitHub Pages; PAGES_BASE overrides it for a
  // build that places this app somewhere else.
  base: process.env.PAGES_BASE ?? (process.env.GITHUB_PAGES ? '/lms-site-profile/' : '/'),
  plugins: [react()],
  // This project styles entirely with inline styles. Pin an empty PostCSS
  // config so Vite does not walk up and pick up a parent directory's Tailwind
  // setup, which does not apply here.
  css: { postcss: {} },
  server: { port: process.env.PORT ? Number(process.env.PORT) : 5177 },
});
