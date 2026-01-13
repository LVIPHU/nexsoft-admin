import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect, type MultiSelectOption, type MultiSelectGroup } from './multi-select';
import { User, Settings, Mail, Phone, Globe, Heart, Star } from 'lucide-react';

const meta: Meta<typeof MultiSelect> = {
  title: 'Organisms/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options or groups to display',
    },
    onValueChange: {
      action: 'value-changed',
      description: 'Callback when selected values change',
    },
    defaultValue: {
      control: 'object',
      description: 'Default selected values',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no values selected',
    },
    maxCount: {
      control: 'number',
      description: 'Maximum number of items to display before showing "+X more"',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    hideSelectAll: {
      control: 'boolean',
      description: 'Hide select all option',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the component',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'inverted'],
      description: 'Variant style',
    },
    singleLine: {
      control: 'boolean',
      description: 'Show badges in single line with horizontal scroll',
    },
    autoSize: {
      control: 'boolean',
      description: 'Allow component to grow/shrink with content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions: MultiSelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
];

const optionsWithIcons: MultiSelectOption[] = [
  { label: 'User', value: 'user', icon: User },
  { label: 'Settings', value: 'settings', icon: Settings },
  { label: 'Mail', value: 'mail', icon: Mail },
  { label: 'Phone', value: 'phone', icon: Phone },
  { label: 'Globe', value: 'globe', icon: Globe },
];

const groupedOptions: MultiSelectGroup[] = [
  {
    heading: 'Fruits',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Orange', value: 'orange' },
    ],
  },
  {
    heading: 'Vegetables',
    options: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
      { label: 'Spinach', value: 'spinach' },
    ],
  },
  {
    heading: 'Dairy',
    options: [
      { label: 'Milk', value: 'milk' },
      { label: 'Cheese', value: 'cheese' },
      { label: 'Yogurt', value: 'yogurt' },
    ],
  },
];

const manyOptions: MultiSelectOption[] = Array.from({ length: 50 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `option-${i + 1}`,
}));

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
  },
};

export const WithDefaultValues: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option3']);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
  },
};

export const WithIcons: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={optionsWithIcons} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: optionsWithIcons,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
  },
};

export const WithGroups: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={groupedOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: groupedOptions,
    placeholder: 'Select items',
    maxCount: 3,
    searchable: true,
  },
};

export const NotSearchable: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: false,
  },
};

export const HideSelectAll: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    hideSelectAll: true,
  },
};

export const SingleLine: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option2', 'option3', 'option4', 'option5']);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    singleLine: true,
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option2']);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    disabled: true,
  },
};

export const WithManyOptions: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={manyOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: manyOptions,
    placeholder: 'Select from 50 options',
    maxCount: 5,
    searchable: true,
  },
};

export const CustomMaxCount: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option2', 'option3', 'option4', 'option5']);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 2,
    searchable: true,
  },
};

export const VariantSecondary: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option2']);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    variant: 'secondary',
  },
};

export const WithDisabledOptions: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    const optionsWithDisabled: MultiSelectOption[] = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2', disabled: true },
      { label: 'Option 3', value: 'option3' },
      { label: 'Option 4', value: 'option4', disabled: true },
      { label: 'Option 5', value: 'option5' },
    ];
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={optionsWithDisabled} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
  },
};

export const AutoSize: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option1', 'option2']);
    return (
      <div className='w-auto'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    autoSize: true,
  },
};

export const CloseOnSelect: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className='w-[400px]'>
        <MultiSelect {...args} options={basicOptions} onValueChange={setValue} defaultValue={value} />
      </div>
    );
  },
  args: {
    options: basicOptions,
    placeholder: 'Select options',
    maxCount: 3,
    searchable: true,
    closeOnSelect: true,
  },
};
