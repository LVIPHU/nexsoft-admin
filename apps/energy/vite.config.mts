/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import * as path from 'path';
import * as fs from 'fs';

// Plugin to copy vercel.json to dist
function copyVercelConfig() {
  const rootDir = import.meta.dirname;
  return {
    name: 'copy-vercel-config',
    writeBundle() {
      try {
        const vercelJsonPath = path.join(rootDir, 'vercel.json');
        const distPath = path.join(rootDir, 'dist');
        
        if (fs.existsSync(vercelJsonPath) && fs.existsSync(distPath)) {
          fs.copyFileSync(vercelJsonPath, path.join(distPath, 'vercel.json'));
          console.log('✓ Copied vercel.json to dist');
        }
      } catch (error) {
        console.warn('Failed to copy vercel.json:', error);
      }
    },
  };
}

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
