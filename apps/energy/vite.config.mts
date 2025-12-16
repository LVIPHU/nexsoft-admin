/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'path';
import { copyFileSync, existsSync } from 'fs';

// Plugin to copy vercel.json to dist
const copyVercelConfig = () => ({
  name: 'copy-vercel-config',
  closeBundle() {
    try {
      const vercelJsonPath = path.resolve(import.meta.dirname, 'vercel.json');
      const distPath = path.resolve(import.meta.dirname, 'dist/vercel.json');
      
      if (existsSync(vercelJsonPath)) {
        copyFileSync(vercelJsonPath, distPath);
        console.log('✓ Copied vercel.json to dist/');
      } else {
        console.warn('⚠ vercel.json not found, skipping copy');
      }
    } catch (error) {
      console.warn('Failed to copy vercel.json:', error);
    }
  },
});

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/energy',
  server: {
    port: 3002,
    host: 'localhost',
  },
  preview: {
    port: 3002,
    host: 'localhost',
  },
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    tailwindcss(),
    copyVercelConfig(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: '@nexsoft-admin/energy',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
