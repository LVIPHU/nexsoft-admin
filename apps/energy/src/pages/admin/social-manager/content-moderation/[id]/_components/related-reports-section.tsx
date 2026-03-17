import { useSearchParams } from 'react-router';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@nexsoft-admin/ui/tabs';
import { Badge } from '@nexsoft-admin/ui/badge';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto } from '@nexsoft-admin/models';

const TAB_PARAM = 'rt';
const TABS = {
  REPLIES: 'replies',
  REPORT_DETAIL: 'report-detail',
} as const;

interface RelatedReportsSectionProps {
  violation: ViolationFullDto;
}

function RelatedReportsSection({ violation }: RelatedReportsSectionProps) {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get(TAB_PARAM) ?? TABS.REPLIES;

  const handleTabChange = (value: string) => {
    setParams((prev) => {
      prev.set(TAB_PARAM, value);
      return prev;
    });
  };

  const typeSummary = (violation.total_by_violation_type ?? []).filter((v) => v.total > 0);

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='mb-4'>
          <h3 className='font-semibold'>{i18n._(msg`Related replies & reports`)}</h3>
          <p className='text-muted-foreground text-sm'>
            {i18n._(msg`${violation.number_of_violations} reports total`)}
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className='mb-4'>
            <TabsTrigger value={TABS.REPLIES}>{i18n._(msg`Replies`)}</TabsTrigger>
            <TabsTrigger value={TABS.REPORT_DETAIL}>{i18n._(msg`Report Detail`)}</TabsTrigger>
          </TabsList>

          <TabsContent value={TABS.REPLIES}>
            <p className='text-muted-foreground py-8 text-center text-sm'>
              {i18n._(msg`No reply data available`)}
            </p>
          </TabsContent>

          <TabsContent value={TABS.REPORT_DETAIL}>
            {typeSummary.length === 0 ? (
              <p className='text-muted-foreground py-8 text-center text-sm'>
                {i18n._(msg`No report details available`)}
              </p>
            ) : (
              <div className='flex flex-col gap-2'>
                {typeSummary.map((v) => (
                  <div key={v.violation_type} className='flex items-center justify-between rounded-md border p-3'>
                    <span className='text-sm font-medium'>{v.violation_type.replace(/_/g, ' ')}</span>
                    <Badge variant='secondary'>{v.total}</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { RelatedReportsSection };
