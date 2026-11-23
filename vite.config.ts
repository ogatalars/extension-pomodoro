import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'build',
    rolldownOptions: {
      input: { popup: 'index.html', background: 'src/background.ts' },
      // manifest.json points at a fixed service worker filename
      output: { entryFileNames: (c) => (c.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js') },
    },
  },
});
