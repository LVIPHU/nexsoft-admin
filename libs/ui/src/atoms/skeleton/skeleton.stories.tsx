import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-4 w-64',
  },
};

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
};

export const Text: Story = {
  render: () => (
    <div className='space-y-2'>
      <Skeleton className='h-4 w-64' />
      <Skeleton className='h-4 w-48' />
      <Skeleton className='h-4 w-56' />
    </div>
  ),
};
