import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { useActivityOverview } from '@/services/activity';
import type { ActivityOverviewDto } from '@nexsoft-admin/models';

interface OverviewProps {
  className?: string;
}

function getStatusTotal(data: ActivityOverviewDto, status: string): number {
  return data.status_count.find((s) => s.status === status)?.total ?? 0;
}

function SkeletonCard() {
  return (
    <div data-slot='card' className='flex items-center gap-4 p-6'>
      <Skeleton className='h-14 w-14 rounded-md' />
      <div className='flex flex-1 flex-col gap-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-24' />
      </div>
    </div>
  );
}

function Overview({ className }: OverviewProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  const from_date =
    selectedDateRanger?.from != null
      ? dayjs(selectedDateRanger.from).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';
  const to_date =
    selectedDateRanger?.to != null
      ? dayjs(selectedDateRanger.to).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
      : '';

  const { data, isPending: loading, error } = useActivityOverview(
    { from_date, to_date },
    { enabled: Boolean(from_date && to_date) }
  );

  const totalSuccess = data ? getStatusTotal(data, 'COMPLETED') : 0;
  const totalProcessing =
    data
      ? getStatusTotal(data, 'PROCESSING') + getStatusTotal(data, 'PENDING')
      : 0;
  const totalError = data ? getStatusTotal(data, 'FAILED') : 0;

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Overview`)}
            icon={'ZapRadiant'}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1 *:data-[slot=card]:border-t @5xl/main:grid-cols-2 @5xl/main:*:data-[slot=card]:even:border-l @7xl/main:grid-cols-4 @7xl/main:*:data-[slot=card]:border-l @7xl/main:*:data-[slot=card]:first:border-l-0'>
            {loading &&
              Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
            {error && (
              <div data-slot='card' className='p-6'>
                <p className='text-destructive text-sm'>{error.message}</p>
              </div>
            )}
            {!loading && !error && data && (
              <>
                <SectionCard
                  title={i18n._(msg`TOTAL REQUEST`)}
                  value={data.total_request}
                />
                <SectionCard
                  title={i18n._(msg`TOTAL REQUEST SUCCESS`)}
                  value={totalSuccess}
                />
                <SectionCard
                  title={i18n._(msg`TOTAL REQUEST PROCESSING`)}
                  value={totalProcessing}
                />
                <SectionCard
                  title={i18n._(msg`TOTAL REQUEST ERROR`)}
                  value={totalError}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { Overview };
