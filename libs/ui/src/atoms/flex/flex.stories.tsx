import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './flex';

const meta: Meta<typeof Flex> = {
  title: 'Atoms/Flex',
  component: Flex,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: 'col',
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const WithJustify: Story = {
  args: {
    justify: 'between',
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const WithItems: Story = {
  args: {
    items: 'center',
    gap: 4,
    className: 'h-32',
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const WithWrap: Story = {
  args: {
    wrap: 'wrap',
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md w-64">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md w-64">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md w-64">Item 3</div>
        <div className="bg-primary/10 p-4 rounded-md w-64">Item 4</div>
      </>
    ),
  },
};

export const WithGrow: Story = {
  args: {
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md grow">Item 2 (grow)</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const WithBasis: Story = {
  args: {
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md basis-1/3">Item 1 (basis 1/3)</div>
        <div className="bg-primary/10 p-4 rounded-md basis-1/3">Item 2 (basis 1/3)</div>
        <div className="bg-primary/10 p-4 rounded-md basis-1/3">Item 3 (basis 1/3)</div>
      </>
    ),
  },
};

export const Reverse: Story = {
  args: {
    direction: 'row-reverse',
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const CustomElement: Story = {
  args: {
    as: 'nav',
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
      </>
    ),
  },
};


