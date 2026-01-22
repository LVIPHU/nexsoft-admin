import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import dayjs from 'dayjs';

interface ResourceSummaryProps {
  className?: string;
}

function ResourceSummary({ className }: ResourceSummaryProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

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
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} icon={'ZapSolid'} />
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} icon={'GaugeSolid'} />
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} icon={'ZapSolid'} />
            <SectionCard title={i18n._(msg`Total Energy System earned`)} value={10890000000} icon={'GaugeSolid'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ResourceSummary };
