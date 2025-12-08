import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './grid';

const meta: Meta<typeof Grid> = {
  title: 'Atoms/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cols: 3,
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 4</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 5</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 6</div>
      </>
    ),
  },
};

export const Responsive: Story = {
  args: {
    cols: 1,
    mdCols: 2,
    lgCols: 4,
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 4</div>
      </>
    ),
  },
};

export const WithGap: Story = {
  args: {
    cols: 7,
    gap: 10,

    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),

    flow: "row"
  },
};

export const WithRowAndColGap: Story = {
  args: {
    cols: 3,
    rowGap: 8,
    colGap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 4</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 5</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 6</div>
      </>
    ),
  },
};

export const WithJustifyAndItems: Story = {
  args: {
    cols: 3,
    gap: 4,
    justify: 'center',
    items: 'center',
    className: 'h-64',
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
      </>
    ),
  },
};

export const WithFlow: Story = {
  args: {
    cols: 3,
    gap: 4,
    flow: 'dense',
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md col-span-2">Item 1 (span 2)</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 3</div>
        <div className="bg-primary/10 p-4 rounded-md col-span-2">Item 4 (span 2)</div>
      </>
    ),
  },
};

export const CustomElement: Story = {
  args: {
    as: 'section',
    cols: 2,
    gap: 4,
    children: (
      <>
        <div className="bg-primary/10 p-4 rounded-md">Item 1</div>
        <div className="bg-primary/10 p-4 rounded-md">Item 2</div>
      </>
    ),
  },
};

