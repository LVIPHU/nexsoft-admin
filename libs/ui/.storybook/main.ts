import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.mts',
      },
    },
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@nexsoft-admin/ui': join(__dirname, '../src'),
          '@nexsoft-admin/utils': join(__dirname, '../../../libs/utils/src'),
          '@nexsoft-admin/hooks': join(__dirname, '../../../libs/hooks/src'),
        },
      },
    });
  },
};

export default config;
