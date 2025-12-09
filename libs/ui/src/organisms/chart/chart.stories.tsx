import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import * as Recharts from 'recharts';

const meta: Meta<typeof ChartContainer> = {
  title: 'Organisms/Chart',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
};

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
      <Recharts.BarChart data={chartData}>
        <Recharts.CartesianGrid strokeDasharray='3 3' />
        <Recharts.XAxis dataKey='month' />
        <Recharts.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Recharts.Bar dataKey='desktop' fill='var(--color-desktop)' />
      </Recharts.BarChart>
    </ChartContainer>
  ),
};
