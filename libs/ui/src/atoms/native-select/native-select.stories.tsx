import type { Meta, StoryObj } from '@storybook/react';
import { NativeSelect, NativeSelectOption } from './native-select';

const meta: Meta<typeof NativeSelect> = {
  title: 'Atoms/NativeSelect',
  component: NativeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value=''>Select an option</NativeSelectOption>
      <NativeSelectOption value='option1'>Option 1</NativeSelectOption>
      <NativeSelectOption value='option2'>Option 2</NativeSelectOption>
      <NativeSelectOption value='option3'>Option 3</NativeSelectOption>
    </NativeSelect>
  ),
};
