import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Atoms/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className='w-96'>
      <AspectRatio {...args}>
        <div className='bg-muted flex h-full w-full items-center justify-center'>16:9</div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className='w-64'>
      <AspectRatio {...args}>
        <div className='bg-muted flex h-full w-full items-center justify-center'>1:1</div>
      </AspectRatio>
    </div>
  ),
};
