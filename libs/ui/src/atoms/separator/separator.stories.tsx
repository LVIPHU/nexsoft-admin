import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className='w-64'>
      <div className='mb-4'>Content above</div>
      <Separator {...args} />
      <div className='mt-4'>Content below</div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className='flex h-32 items-center'>
      <div className='mr-4'>Left</div>
      <Separator {...args} />
      <div className='ml-4'>Right</div>
    </div>
  ),
};
