import type { Meta, StoryObj } from '@storybook/react';
import { Item, ItemContent, ItemTitle, ItemDescription, ItemMedia } from './item';

const meta: Meta<typeof Item> = {
  title: 'Molecules/Item',
  component: Item,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Item>
      <ItemMedia>📦</ItemMedia>
      <ItemContent>
        <ItemTitle>Item Title</ItemTitle>
        <ItemDescription>Item description goes here.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};
