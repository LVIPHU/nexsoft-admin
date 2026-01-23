import type { Meta, StoryObj } from '@storybook/react';
import { CountUp } from './count-up';

const meta: Meta<typeof CountUp> = {
  title: 'Atoms/CountUp',
  component: CountUp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    to: {
      control: 'number',
      description: 'Target number to count to',
    },
    from: {
      control: 'number',
      description: 'Starting number (default: 0)',
    },
    direction: {
      control: 'select',
      options: ['up', 'down'],
      description: 'Direction of animation',
    },
    delay: {
      control: 'number',
      description: 'Delay before animation starts (in seconds)',
    },
    duration: {
      control: 'number',
      description: 'Duration of animation (in seconds)',
    },
    startWhen: {
      control: 'boolean',
      description: 'Whether to start animation when in view',
    },
    separator: {
      control: 'text',
      description: 'Custom separator for number formatting (e.g., "," or " ")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: 1000,
    from: 0,
  },
};

export const WithSeparator: Story = {
  args: {
    to: 1000000,
    from: 0,
    separator: ',',
  },
};

export const WithDelay: Story = {
  args: {
    to: 5000,
    from: 0,
    delay: 0.5,
  },
};

export const CountDown: Story = {
  args: {
    to: 0,
    from: 1000,
    direction: 'down',
  },
};

export const Decimal: Story = {
  args: {
    to: 99.99,
    from: 0,
  },
};

export const LongDuration: Story = {
  args: {
    to: 10000,
    from: 0,
    duration: 5,
  },
};

export const CustomClassName: Story = {
  args: {
    to: 2500,
    from: 2000,
    className: 'text-4xl font-bold text-primary',
  },
};
