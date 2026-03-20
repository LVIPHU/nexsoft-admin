import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@nexsoft-admin/ui/tabs';
import { Button } from '@nexsoft-admin/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@nexsoft-admin/ui/avatar';
import { Badge } from '@nexsoft-admin/ui/badge';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@nexsoft-admin/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto } from '@nexsoft-admin/models';
import { VIOLATION_TOPIC } from '@/constants/violation.constant';
import { useViolationReplies, useViolationReports } from '@/services/content-moderation';

const TAB_PARAM = 'rt';
const TABS = {
  REPLIES: 'replies',
  REPORT_DETAIL: 'report-detail',
} as const;

const VIOLATION_LABELS: Record<string, string> = {
  [VIOLATION_TOPIC.HATE_SPEECH_OR_DISCRIMINATION]: 'Hate Speech',
  [VIOLATION_TOPIC.HARASSMENT_OR_BULLYING]: 'Abuse & Harassment',
  [VIOLATION_TOPIC.VIOLENCE_OR_HARMFUL_CONTENT]: 'Violent Speech',
  [VIOLATION_TOPIC.SPAM_OR_SCAM]: 'Spam or Scam',
  [VIOLATION_TOPIC.NUDITY_OR_SEXUAL_CONTENT]: 'Nudity / Sexual Content',
};

interface RelatedReportsSectionProps {
  violation: ViolationFullDto;
  isPending: boolean;
  onBypass: () => void;
  onBan: () => void;
  banning: boolean;
  bypassing: boolean;
  pendingAction: 'ban' | 'bypass' | null;
}

function RelatedReportsSection({
  violation,
  isPending,
  onBypass,
  onBan,
  banning,
  bypassing,
  pendingAction,
}: RelatedReportsSectionProps) {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get(TAB_PARAM) ?? TABS.REPLIES;
  const [repliesPage, setRepliesPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);

  const { data: repliesData, loading: repliesLoading } = useViolationReplies(violation.content_id, repliesPage);
  const { data: reportsData, loading: reportsLoading } = useViolationReports(violation.id, reportsPage);

  const handleTabChange = (value: string) => {
    setParams((prev) => {
      prev.set(TAB_PARAM, value);
      return prev;
    });
  };

  const totalReplies = repliesData?.pagination.total_rows ?? 0;
  const totalPages = repliesData?.pagination.total_pages ?? 1;

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
          <div>
            <h3 className='font-semibold'>{i18n._(msg`Related replies & reports`)}</h3>
            <p className='text-muted-foreground text-sm'>
              {i18n._(msg`Total`)} {totalReplies} {i18n._(msg`replies`)}
              {(reportsData?.pagination.total_rows ?? 0) > 0 && (
                <>
                  {' '}
                  · {reportsData?.pagination.total_rows} {i18n._(msg`report entries`)}
                </>
              )}
            </p>
          </div>

          {isPending && (
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                onClick={onBypass}
                disabled={banning || bypassing}
              >
                <CheckCircle className='mr-1.5 size-4' />
                {pendingAction === 'bypass' ? i18n._(msg`Approving...`) : i18n._(msg`Approve reports`)}
              </Button>
              <Button size='sm' variant='destructive' onClick={onBan} disabled={banning || bypassing}>
                <XCircle className='mr-1.5 size-4' />
                {pendingAction === 'ban' ? i18n._(msg`Rejecting...`) : i18n._(msg`Reject reports`)}
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className='mb-4'>
            <TabsTrigger value={TABS.REPLIES}>{i18n._(msg`Replies`)}</TabsTrigger>
            <TabsTrigger value={TABS.REPORT_DETAIL}>{i18n._(msg`Report Detail`)}</TabsTrigger>
          </TabsList>

          <TabsContent value={TABS.REPLIES}>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{i18n._(msg`Author`)}</TableHead>
                    <TableHead>{i18n._(msg`Content`)}</TableHead>
                    <TableHead className='whitespace-nowrap'>{i18n._(msg`Created`)}</TableHead>
                    <TableHead>{i18n._(msg`Hashtags`)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repliesLoading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className='h-4 w-28' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-full' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-20' />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !repliesData?.data.length ? (
                    <TableRow>
                      <TableCell colSpan={4} className='text-muted-foreground py-8 text-center text-sm'>
                        {i18n._(msg`No replies yet`)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    repliesData.data.map((reply) => (
                      <TableRow key={reply.id}>
                        <TableCell className='whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Avatar className='size-7 shrink-0'>
                              <AvatarImage src={reply.creator.thumbnail_url ?? undefined} alt={reply.creator.name} />
                              <AvatarFallback className='text-xs'>
                                {reply.creator.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='text-sm leading-tight font-medium'>{reply.creator.name}</p>
                              <p className='text-muted-foreground text-xs'>@{reply.creator.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='max-w-xs'>
                          <p className='line-clamp-2 text-sm'>{reply.content}</p>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm whitespace-nowrap'>
                          {reply.created_at
                            ? new Date(reply.created_at).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </TableCell>
                        <TableCell>
                          {(reply.hashtags ?? []).length > 0 ? (
                            <div className='flex flex-wrap gap-1'>
                              {(reply.hashtags ?? []).map((tag) => (
                                <Badge key={tag} variant='secondary' className='text-xs'>
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className='text-muted-foreground text-xs'>—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!repliesLoading && totalPages > 1 && (
              <div className='mt-3 flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>
                  {i18n._(msg`Page`)} {repliesPage} / {totalPages}
                </span>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={repliesPage <= 1}
                    onClick={() => setRepliesPage((p) => p - 1)}
                  >
                    {i18n._(msg`Previous`)}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={repliesPage >= totalPages}
                    onClick={() => setRepliesPage((p) => p + 1)}
                  >
                    {i18n._(msg`Next`)}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value={TABS.REPORT_DETAIL}>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{i18n._(msg`Type`)}</TableHead>
                    <TableHead>{i18n._(msg`Reason`)}</TableHead>
                    <TableHead>{i18n._(msg`Status`)}</TableHead>
                    <TableHead className='whitespace-nowrap'>{i18n._(msg`Created`)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsLoading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className='h-4 w-28' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-32' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-16' />
                        </TableCell>
                        <TableCell>
                          <Skeleton className='h-4 w-24' />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !reportsData?.data.length ? (
                    <TableRow>
                      <TableCell colSpan={4} className='text-muted-foreground py-8 text-center text-sm'>
                        {i18n._(msg`No report details available`)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportsData.data.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className='text-sm font-medium'>
                          {VIOLATION_LABELS[report.violation_type] ?? report.violation_type.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {VIOLATION_LABELS[report.reason] ?? report.reason.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell>
                          <Badge variant='secondary' className='text-xs'>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm whitespace-nowrap'>
                          {report.created_at
                            ? new Date(report.created_at).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!reportsLoading && (reportsData?.pagination.total_pages ?? 1) > 1 && (
              <div className='mt-3 flex items-center justify-between'>
                <span className='text-muted-foreground text-xs'>
                  {i18n._(msg`Page`)} {reportsPage} / {reportsData?.pagination.total_pages}
                </span>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={reportsPage <= 1}
                    onClick={() => setReportsPage((p) => p - 1)}
                  >
                    {i18n._(msg`Previous`)}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={reportsPage >= (reportsData?.pagination.total_pages ?? 1)}
                    onClick={() => setReportsPage((p) => p + 1)}
                  >
                    {i18n._(msg`Next`)}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { RelatedReportsSection };
