import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Molecules/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {},
};

export const WithDateSelected: Story = {
  args: {
    defaultMonth: new Date(2024, 0),
    mode: 'single',
    selected: new Date(2024, 0, 15),
  },
};

export const WithDateRange: Story = {
  args: {
    defaultMonth: new Date(2024, 0),
    mode: 'range',
    selected: {
      from: new Date(2024, 0, 10),
      to: new Date(2024, 0, 20),
    },
  },
};
