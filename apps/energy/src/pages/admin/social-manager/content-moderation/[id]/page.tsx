import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@nexsoft-admin/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@nexsoft-admin/ui/card';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { Badge } from '@nexsoft-admin/ui/badge';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useViolationContent, useBanContent, useBypassContent } from '@/services/content-moderation';
import { ViolationStatusBadge, PriorityBadge, ReportCountBadge, ContentTypeBadge } from '../_components/violation-badges';

function ContentModerationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
          <ArrowLeftIcon className='size-4' />
        </Button>
        <div>
          <h1 className='text-xl font-semibold'>{i18n._(msg`Content Detail`)}</h1>
          <p className='text-muted-foreground text-sm'>{i18n._(msg`Violation report #${numericId}`)}</p>
        </div>
      </div>

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
          {/* Content Card */}
          <Card className='@5xl/main:col-span-2'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <ContentTypeBadge type={violation.content_type} />
                <CardTitle className='text-base'>{i18n._(msg`Content`)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <p className='text-sm leading-relaxed whitespace-pre-wrap'>{violation.content}</p>
              {violation.hashtags && violation.hashtags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {violation.hashtags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              {user && (
                <div className='border-t pt-4'>
                  <p className='text-muted-foreground mb-1 text-xs uppercase'>{i18n._(msg`Author`)}</p>
                  <div className='flex items-center gap-2'>
                    <div>
                      <p className='text-sm font-medium'>{user.name}</p>
                      <p className='text-muted-foreground text-xs'>@{user.username}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Violation Info Card */}
          <div className='flex flex-col gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>{i18n._(msg`Violation Info`)}</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>{i18n._(msg`Status`)}</span>
                  <ViolationStatusBadge status={violation.violation_status} />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>{i18n._(msg`Priority`)}</span>
                  <PriorityBadge priority={violation.priority} />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>{i18n._(msg`Reports`)}</span>
                  <ReportCountBadge count={violation.number_of_violations} />
                </div>
                {violation.total_by_violation_type && violation.total_by_violation_type.length > 0 && (
                  <div className='border-t pt-3'>
                    <p className='text-muted-foreground mb-2 text-xs uppercase'>{i18n._(msg`Violation Types`)}</p>
                    <div className='flex flex-col gap-1'>
                      {violation.total_by_violation_type
                        .filter((v) => v.total > 0)
                        .map((v) => (
                          <div key={v.violation_type} className='flex items-center justify-between'>
                            <span className='text-sm'>{v.violation_type.replace(/_/g, ' ')}</span>
                            <Badge variant='secondary'>{v.total}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            {violation.violation_status === 'PENDING' && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>{i18n._(msg`Actions`)}</CardTitle>
                  <CardDescription>{i18n._(msg`Take action on this content`)}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                  <Button
                    variant='outline'
                    className='w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
                    onClick={handleBypass}
                    disabled={banning || bypassing}
                  >
                    {pendingAction === 'bypass' ? i18n._(msg`Approving...`) : i18n._(msg`Approve (Not a violation)`)}
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
                    onClick={handleBan}
                    disabled={banning || bypassing}
                  >
                    {pendingAction === 'ban' ? i18n._(msg`Banning...`) : i18n._(msg`Ban (Confirm violation)`)}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { ContentModerationDetailPage };
