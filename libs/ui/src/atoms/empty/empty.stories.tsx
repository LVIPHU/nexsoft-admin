import type { Meta, StoryObj } from '@storybook/react';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from './empty';

const meta: Meta<typeof Empty> = {
  title: 'Atoms/Empty',
  component: Empty,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">📦</EmptyMedia>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

