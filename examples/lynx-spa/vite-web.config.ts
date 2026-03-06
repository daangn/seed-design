import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  root: './web-host',
  plugins: [wasm()],
  build: {
    outDir: '../dist-web',
    target: 'esnext',
  },
  server: {
    port: 4173,
  },
  publicDir: '../dist',
});
