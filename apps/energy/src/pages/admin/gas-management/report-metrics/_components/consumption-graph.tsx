import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@nexsoft-admin/ui/chart';
import { formatNumber, cn } from '@nexsoft-admin/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { useConsumption } from '@/services/report-metrics';

interface ConsumptionGraphProps {
  className?: string;
}

type ChartType = 'energy' | 'bandwidth';

interface ChartDataPoint {
  date: string;
  last7Days: number;
  previousWeek: number;
  esEarned?: number;
  esUsed?: number;
  bandwidthEarned?: number;
  bandwidthUsed?: number;
}

interface SummaryMetricCardProps {
  title: string;
  value: number;
  change: number;
  isActive: boolean;
  onClick: () => void;
}

function SummaryMetricCard({ title, value, change, isActive, onClick }: SummaryMetricCardProps) {
  const isPositive = change > 0;
  const changeColor = isPositive
    ? 'text-primary bg-primary/10 dark:text-green-400'
    : 'text-red-600 bg-red-600/10 dark:text-red-400';

  return (
    <div onClick={onClick} className='relative cursor-pointer rounded-lg p-4 transition-all hover:shadow-md'>
      <div className='mb-2 flex items-baseline gap-2'>
        <p className='text-muted-foreground text-sm font-medium uppercase'>{title}</p>
        <div className={cn('flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium', changeColor)}>
          {isPositive ? <ArrowUpIcon className='size-3' /> : <ArrowDownIcon className='size-3' />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className='mb-2'>
        <p className='text-2xl font-semibold'>{formatNumber(value, { noDecimals: true })}</p>
      </div>
      <div className={cn('h-1 w-full rounded-full', isActive && 'bg-primary')} />
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: ChartDataPoint; value?: number }>;
  label?: string;
  activeTab: ChartType;
}

function CustomTooltip({ active, payload, label, activeTab }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const firstPayload = payload[0];
  if (!firstPayload?.payload) {
    return null;
  }

  const data = firstPayload.payload;
  const earnedKey = activeTab === 'energy' ? 'esEarned' : 'bandwidthEarned';
  const usedKey = activeTab === 'energy' ? 'esUsed' : 'bandwidthUsed';
  const earnedLabel = activeTab === 'energy' ? i18n._(msg`ES earned`) : i18n._(msg`Bandwidth earned`);
  const usedLabel = activeTab === 'energy' ? i18n._(msg`ES used`) : i18n._(msg`Bandwidth used`);

  const earnedValue = data[earnedKey];
  const usedValue = data[usedKey];

  return (
    <div className='bg-background rounded-lg border p-3 shadow-lg'>
      <p className='mb-2 font-medium'>{label}</p>
      {earnedValue !== undefined && (
        <p className='text-muted-foreground text-sm'>
          {earnedLabel}: {formatNumber(earnedValue, { noDecimals: true })}
        </p>
      )}
      {usedValue !== undefined && (
        <p className='text-muted-foreground text-sm'>
          {usedLabel}: {formatNumber(usedValue, { noDecimals: true })}
        </p>
      )}
    </div>
  );
}

function ConsumptionGraph({ className }: ConsumptionGraphProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  const [activeTab, setActiveTab] = useState<ChartType>('energy');

  const from_date =
    selectedDateRanger?.from != null
      ? dayjs(selectedDateRanger.from).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';
  const to_date =
    selectedDateRanger?.to != null
      ? dayjs(selectedDateRanger.to).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';

  const { data, isPending: loading, error } = useConsumption(
    { from_date, to_date },
    { enabled: Boolean(from_date && to_date) }
  );

  const chartData = useMemo((): ChartDataPoint[] => {
    const viewData = data?.view_data ?? [];
    return [...viewData]
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
      .map((item) => ({
        date: dayjs(item.date).format('MM/DD'),
        last7Days: item.total_delegated_energy,
        previousWeek: item.total_delegated_bandwidth,
        esEarned: item.total_delegated_energy,
        esUsed: 0,
        bandwidthEarned: item.total_delegated_bandwidth,
        bandwidthUsed: 0,
      }));
  }, [data?.view_data]);

  const { totalEnergy, totalBandwidth } = useMemo(() => {
    const viewData = data?.view_data ?? [];
    return {
      totalEnergy: viewData.reduce((sum, item) => sum + item.total_delegated_energy, 0),
      totalBandwidth: viewData.reduce((sum, item) => sum + item.total_delegated_bandwidth, 0),
    };
  }, [data?.view_data]);

  const isEmpty = !loading && !error && chartData.length === 0;

  const chartConfig: ChartConfig = {
    last7Days: {
      label: i18n._(msg`Delegated Energy`),
      color: 'var(--chart-3)',
    },
    previousWeek: {
      label: i18n._(msg`Delegated Bandwidth`),
      color: 'var(--chart-4)',
    },
  };

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Energy System consumption graph`)}
            icon={'ZapRadiant'}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='space-y-6 p-6'>
          {/* Summary Metrics Grid */}
          <div className='grid grid-cols-1 gap-4 @4xl/main:grid-cols-4'>
            {loading ? (
              <>
                <Skeleton className='h-24 rounded-lg' />
                <Skeleton className='h-24 rounded-lg' />
              </>
            ) : (
              <>
                <SummaryMetricCard
                  title={i18n._(msg`TOTAL ENERGY BURN`)}
                  value={totalEnergy}
                  change={0}
                  isActive={activeTab === 'energy'}
                  onClick={() => setActiveTab('energy')}
                />
                <SummaryMetricCard
                  title={i18n._(msg`TOTAL BANDWIDTH BURN`)}
                  value={totalBandwidth}
                  change={0}
                  isActive={activeTab === 'bandwidth'}
                  onClick={() => setActiveTab('bandwidth')}
                />
              </>
            )}
          </div>

          {/* Line Chart */}
          {loading && <Skeleton className='h-[400px] w-full rounded-lg' />}
          {error && (
            <p className='text-destructive py-6 text-center text-sm'>{error.message}</p>
          )}
          {isEmpty && (
            <p className='text-muted-foreground py-12 text-center text-sm'>
              {i18n._(msg`No data in this period`)}
            </p>
          )}
          {!loading && !error && chartData.length > 0 && (
            <ChartContainer config={chartConfig} className='h-[400px] w-full'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} className='stroke-muted' />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatNumber(value, { noDecimals: true })}
                />
                <ChartTooltip
                  content={<CustomTooltip activeTab={activeTab} />}
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                />
                <Line
                  type='monotone'
                  dataKey='last7Days'
                  stroke='var(--color-last7Days)'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type='monotone'
                  dataKey='previousWeek'
                  stroke='var(--color-previousWeek)'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { ConsumptionGraph };
