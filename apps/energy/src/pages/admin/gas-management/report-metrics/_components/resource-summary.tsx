import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { useSummary } from '@/services/report-metrics';

interface ResourceSummaryProps {
  className?: string;
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

function ResourceSummary({ className }: ResourceSummaryProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(8, 'day').toDate(),
    to: dayjs().subtract(1, 'day').toDate(),
  }));

  const from_date =
    selectedDateRanger?.from != null ? dayjs(selectedDateRanger.from).utc().toISOString() : '';
  const to_date =
    selectedDateRanger?.to != null ? dayjs(selectedDateRanger.to).utc().toISOString() : '';

  const { data, isPending: loading, error } = useSummary(
    { from_date, to_date },
    { enabled: Boolean(from_date && to_date) }
  );

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Resource Summary`)}
            icon={'BarChartRadiant'}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1 *:data-[slot=card]:border-t @5xl/main:grid-cols-2 @5xl/main:*:data-[slot=card]:even:border-l'>
            {loading && (
              <>
                {Array.from({ length: 4 }, (_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            )}
            {error && (
              <div data-slot='card' className='p-6'>
                <p className='text-destructive text-sm'>{error.message}</p>
              </div>
            )}
            {!loading && !error && data && (
              <>
                {/* Earned = delegated totals; Used = total_energy / total_bandwidth (total used in system) */}
                <SectionCard
                  title={i18n._(msg`Total Energy System Earned`)}
                  value={data.total_delegated_energy}
                  icon='ZapSolid'
                />
                <SectionCard
                  title={i18n._(msg`Total Bandwidth Earned`)}
                  value={data.total_delegated_bandwidth}
                  icon='GaugeSolid'
                />
                <SectionCard
                  title={i18n._(msg`Total Energy System Used`)}
                  value={data.energy_info.total_energy}
                  icon='ZapSolid'
                />
                <SectionCard
                  title={i18n._(msg`Total Bandwidth Used`)}
                  value={data.bandwidth_info.total_bandwidth}
                  icon='GaugeSolid'
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ResourceSummary };
