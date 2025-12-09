// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Preview } from '@storybook/react';
import * as React from 'react';
import { Toaster } from '../src/organisms/sonner/sonner';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default preview;
