import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState, useMemo } from 'react';
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
import { useStatistics } from '@/services/report-metrics';

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
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(8, 'day').toDate(),
    to: dayjs().subtract(1, 'day').toDate(),
  }));

  const from_date =
    selectedDateRanger?.from != null ? dayjs(selectedDateRanger.from).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';
  const to_date =
    selectedDateRanger?.to != null ? dayjs(selectedDateRanger.to).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';

  const {
    data,
    isPending: loading,
    error,
  } = useStatistics({ from_date, to_date }, { enabled: Boolean(from_date && to_date) });

  const chartData = useMemo(() => {
    const viewData = data?.view_data ?? [];
    return [...viewData]
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .map((item) => ({
        day: dayjs(item.date).format('MM/DD/YYYY'),
        usdt: item.total_usdt_revenue,
        trx: item.total_trx_revenue,
      }));
  }, [data?.view_data]);

  const isEmpty = !loading && !error && chartData.length === 0;

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Statistics`)}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='spy-0 px-5'>
          {loading && <Skeleton className='h-[300px] w-full rounded-lg' />}
          {error && <p className='text-destructive py-6 text-center text-sm'>{error.message}</p>}
          {isEmpty && (
            <p className='text-muted-foreground py-12 text-center text-sm'>{i18n._(msg`No data in this period`)}</p>
          )}
          {!loading && !error && chartData.length > 0 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { Statistics };
