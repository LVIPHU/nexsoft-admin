import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useViolationStatistic } from '@/services/content-moderation';

function SkeletonCard() {
  return (
    <div data-slot='card' className='flex items-center gap-4 p-6'>
      <div className='flex flex-1 flex-col gap-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-8 w-16' />
      </div>
    </div>
  );
}

function StatsOverview() {
  const { data, loading, error } = useViolationStatistic();

  return (
    <Card className='gap-4 pb-0'>
      <CardHeader>
        <HeaderCard
          title={i18n._(msg`Content Moderation`)}
          description={i18n._(msg`Manage and moderate all content in the system`)}
        />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='grid grid-cols-1 *:data-[slot=card]:border-t @5xl/main:grid-cols-2 @5xl/main:*:data-[slot=card]:even:border-l @7xl/main:grid-cols-4 @7xl/main:*:data-[slot=card]:border-l @7xl/main:*:data-[slot=card]:first:border-l-0'>
          {loading && Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
          {error && (
            <div data-slot='card' className='p-6'>
              <p className='text-destructive text-sm'>{error.message}</p>
            </div>
          )}
          {!loading && !error && data && (
            <>
              <SectionCard title={i18n._(msg`HIGH PRIORITY`)} value={data.total_high} />
              <SectionCard title={i18n._(msg`PENDING`)} value={data.total_pending} />
              <SectionCard title={i18n._(msg`APPROVED`)} value={data.total_bypass} />
              <SectionCard title={i18n._(msg`BANNED`)} value={data.total_ban} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatsOverview };
