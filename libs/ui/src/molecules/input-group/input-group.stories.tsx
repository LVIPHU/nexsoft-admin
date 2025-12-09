import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup, InputGroupInput, InputGroupAddon } from './input-group';

const meta: Meta<typeof InputGroup> = {
  title: 'Molecules/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>@</InputGroupAddon>
      <InputGroupInput placeholder='username' />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder='Search...' />
      <InputGroupAddon align='inline-end'>
        <button type='button'>🔍</button>
      </InputGroupAddon>
    </InputGroup>
  ),
};
