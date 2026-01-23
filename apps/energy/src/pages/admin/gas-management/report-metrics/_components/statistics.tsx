import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@nexsoft-admin/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';

const chartData = [
  { day: '06/13/2023', usdt: 186, trx: 180 },
  { day: '04/27/2023', usdt: 100, trx: 300 },
  { day: '03/18/2024', usdt: 237, trx: 220 },
  { day: '11/23/2023', usdt: 73, trx: 190 },
  { day: '03/29/2022', usdt: 209, trx: 130 },
];

const chartConfig = {
  usdt: {
    label: 'USDT',
    color: 'var(--chart-1)',
  },
  trx: {
    label: 'TRX',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

interface StatisticsProps {
  className?: string;
}

function Statistics({ className }: StatisticsProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Resource Summary`)}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='day' tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='trx' stackId='a' barSize={66} fill='var(--color-trx)' />
              <Bar dataKey='usdt' stackId='a' barSize={66} fill='var(--color-usdt)' radius={[16, 16, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export { Statistics };
