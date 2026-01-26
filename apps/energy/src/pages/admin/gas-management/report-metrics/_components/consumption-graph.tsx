import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@nexsoft-admin/ui/chart';
import { formatNumber } from '@nexsoft-admin/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { cn } from '@nexsoft-admin/utils';

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

// Mock data cho summary metrics
const energyMetric = {
  value: 178000000000,
  change: 5,
};

const bandwidthMetric = {
  value: 178000000000,
  change: -25,
};

// Mock data cho Energy chart
const energyChartData: ChartDataPoint[] = [
  { date: '01', last7Days: 2000, previousWeek: 1500, esEarned: 3000, esUsed: 2600 },
  { date: '02', last7Days: 2500, previousWeek: 1800, esEarned: 3200, esUsed: 2800 },
  { date: '03', last7Days: 3000, previousWeek: 2000, esEarned: 3500, esUsed: 3000 },
  { date: '04', last7Days: 2800, previousWeek: 1900, esEarned: 3300, esUsed: 2900 },
  { date: '05', last7Days: 2200, previousWeek: 1600, esEarned: 3100, esUsed: 2700 },
  { date: '06', last7Days: 2400, previousWeek: 1700, esEarned: 3400, esUsed: 3000 },
];

// Mock data cho Bandwidth chart
const bandwidthChartData: ChartDataPoint[] = [
  { date: '01', last7Days: 1800, previousWeek: 2000, bandwidthEarned: 2800, bandwidthUsed: 2500 },
  { date: '02', last7Days: 2000, previousWeek: 2200, bandwidthEarned: 3000, bandwidthUsed: 2700 },
  { date: '03', last7Days: 2200, previousWeek: 2400, bandwidthEarned: 3200, bandwidthUsed: 2900 },
  { date: '04', last7Days: 1900, previousWeek: 2100, bandwidthEarned: 3100, bandwidthUsed: 2800 },
  { date: '05', last7Days: 1700, previousWeek: 1900, bandwidthEarned: 2900, bandwidthUsed: 2600 },
  { date: '06', last7Days: 2100, previousWeek: 2300, bandwidthEarned: 3300, bandwidthUsed: 3000 },
];

// Chart config sẽ được tạo trong component để i18n đã được activate

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

  const currentChartData = activeTab === 'energy' ? energyChartData : bandwidthChartData;

  // Chart config được tạo trong component để i18n đã được activate
  const chartConfig: ChartConfig = {
    last7Days: {
      label: i18n._(msg`Last 7 days`),
      color: 'var(--chart-3)',
    },
    previousWeek: {
      label: i18n._(msg`Previous Week`),
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
            <SummaryMetricCard
              title={i18n._(msg`TOTAL ENERGY BURN`)}
              value={energyMetric.value}
              change={energyMetric.change}
              isActive={activeTab === 'energy'}
              onClick={() => setActiveTab('energy')}
            />
            <SummaryMetricCard
              title={i18n._(msg`TOTAL BANDWIDTH BURN`)}
              value={bandwidthMetric.value}
              change={bandwidthMetric.change}
              isActive={activeTab === 'bandwidth'}
              onClick={() => setActiveTab('bandwidth')}
            />
          </div>

          {/* Line Chart */}
          <ChartContainer config={chartConfig} className='h-[400px] w-full'>
            <LineChart data={currentChartData}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} className='stroke-muted' />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => {
                  // Format date để hiển thị "DD" hoặc "MM/DD"
                  return value;
                }}
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
        </CardContent>
      </Card>
    </div>
  );
}

export { ConsumptionGraph };
