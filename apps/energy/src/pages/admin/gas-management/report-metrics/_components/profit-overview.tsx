import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { cn } from '@nexsoft-admin/utils';

interface ProfitOverviewProps {
  className?: string;
}

function ProfitOverview({ className }: ProfitOverviewProps) {
  return (
    <div className={cn('h-full', className)}>
      <Card className='h-full gap-4 pb-0'>
        <CardHeader>
          <HeaderCard title={i18n._(msg`Profit Overview`)} icon={'PieChartRadiant'} />
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1'>
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} />
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} />
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ProfitOverview };
