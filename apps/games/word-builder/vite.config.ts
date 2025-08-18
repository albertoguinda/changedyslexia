import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3002,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
