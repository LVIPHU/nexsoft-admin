import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';
import { toast } from 'sonner';
import { Button } from '../../atoms/button';

const meta: Meta<typeof Toaster> = {
  title: 'Organisms/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className='space-x-2'>
        <Button onClick={() => toast('Hello World')}>Show Toast</Button>
        <Button onClick={() => toast.success('Success!')}>Success</Button>
        <Button onClick={() => toast.error('Error!')}>Error</Button>
      </div>
    </>
  ),
};
