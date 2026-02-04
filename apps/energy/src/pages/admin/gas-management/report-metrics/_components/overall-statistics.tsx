import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import { formatCurrency } from '@nexsoft-admin/utils';
import { useStatisticOverview } from '@/services/report-metrics';

interface OverallStatisticsProps {
  className?: string;
}

function OverallStatistics({ className }: OverallStatisticsProps) {
  const [selectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  const from_date =
    selectedDateRanger?.from != null ? dayjs(selectedDateRanger.from).utc().toISOString() : '';
  const to_date =
    selectedDateRanger?.to != null ? dayjs(selectedDateRanger.to).utc().toISOString() : '';

  const { data, isPending: loading, error } = useStatisticOverview(
    { from_date, to_date },
    { enabled: Boolean(from_date && to_date) }
  );

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard title={i18n._(msg`Overall Statistics`)} icon={'PieChartRadiant'} />
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1'>
            {loading && (
              <>
                <div data-slot='card' className='flex items-center gap-4 p-6'>
                  <Skeleton className='h-14 w-14 rounded-md' />
                  <div className='flex flex-1 flex-col gap-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-8 w-24' />
                  </div>
                </div>
                <div data-slot='card' className='flex items-center gap-4 p-6'>
                  <Skeleton className='h-14 w-14 rounded-md' />
                  <div className='flex flex-1 flex-col gap-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-8 w-24' />
                  </div>
                </div>
              </>
            )}
            {error && (
              <div data-slot='card' className='p-6'>
                <p className='text-destructive text-sm'>{error.message}</p>
              </div>
            )}
            {!loading && !error && data && (
              <>
                <SectionCard
                  title={i18n._(msg`Total Transactions`)}
                  value={data.total_transactions}
                  addonEnd={
                    <Link
                      to='/gas-management/activity-history'
                      className='text-primary ml-2 text-sm font-medium hover:underline'
                    >
                      View history &gt;
                    </Link>
                  }
                />
                <div data-slot='card' className='flex flex-col gap-4 p-6'>
                  <p className='truncate text-sm font-medium uppercase'>
                    {i18n._(msg`Total Income`)}
                  </p>
                  <p className='truncate text-2xl font-semibold'>
                    {formatCurrency(data.total_income)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { OverallStatistics };
