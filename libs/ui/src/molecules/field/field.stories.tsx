import type { Meta, StoryObj } from '@storybook/react';
import { Field, FieldLabel, FieldContent, FieldDescription } from './field';
import { Input } from '../../atoms/input';

const meta: Meta<typeof Field> = {
  title: 'Molecules/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldContent>
        <Input type="email" placeholder="Enter your email" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </FieldContent>
    </Field>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldLabel>Email</FieldLabel>
      <FieldContent>
        <Input type="email" placeholder="Enter your email" />
      </FieldContent>
    </Field>
  ),
};

