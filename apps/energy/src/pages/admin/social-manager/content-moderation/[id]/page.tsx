import { useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useViolationContent, useBanContent, useBypassContent } from '@/services/content-moderation';
import { VIOLATION_STATUS } from '@/constants/violation.constant';
import { DetailPageHeader } from '@/components/detail-page-header';
import { ContentCard } from './_components/content-card';
import { QuickStatsCard } from './_components/quick-stats-card';
import { ViolationInfoCard } from './_components/violation-info-card';
import { RelatedReportsSection } from './_components/related-reports-section';

function ContentModerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const { data, loading, error } = useViolationContent(numericId);
  const { banContent, loading: banning } = useBanContent();
  const { bypassContent, loading: bypassing } = useBypassContent();
  const [pendingAction, setPendingAction] = useState<'ban' | 'bypass' | null>(null);

  const handleBan = async () => {
    setPendingAction('ban');
    try {
      await banContent(numericId);
    } finally {
      setPendingAction(null);
    }
  };

  const handleBypass = async () => {
    setPendingAction('bypass');
    try {
      await bypassContent(numericId);
    } finally {
      setPendingAction(null);
    }
  };

  const violation = data?.violation;
  const content = data?.content;
  const user = content?.user;

  return (
    <div className='flex flex-col gap-4'>
      <DetailPageHeader title={i18n._(msg`Content Detail`)} subtitle={i18n._(msg`Violation report #${numericId}`)} />

      {error && (
        <Card>
          <CardContent className='p-6'>
            <p className='text-destructive text-sm'>{error.message}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className='grid gap-4 @5xl/main:grid-cols-3'>
          <Card className='@5xl/main:col-span-2'>
            <CardContent className='flex flex-col gap-3 p-6'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-20 w-full' />
            </CardContent>
          </Card>
          <Card>
            <CardContent className='flex flex-col gap-3 p-6'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && violation && (
        <div className='grid gap-4 @5xl/main:grid-cols-3'>
          <div className='@5xl/main:col-span-2'>
            <ContentCard violation={violation} content={content} user={user} />
          </div>

          <div className='flex flex-col gap-4'>
            <QuickStatsCard metrics={content?.post_metrics} />
            <ViolationInfoCard violation={violation} />
          </div>

          <div className='@5xl/main:col-span-3'>
            <RelatedReportsSection
              violation={violation}
              isPending={violation.violation_status === VIOLATION_STATUS.PENDING}
              onBypass={handleBypass}
              onBan={handleBan}
              banning={banning}
              bypassing={bypassing}
              pendingAction={pendingAction}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { ContentModerationDetailPage };
