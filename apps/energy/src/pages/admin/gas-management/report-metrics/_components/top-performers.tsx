import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';

interface TopPerformersProps {
  className?: string;
}

function TopPerformers( { className }: TopPerformersProps ) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Top Performers`)}
            icon={'AwardRadiant'}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'>
        </CardContent>
      </Card>
    </div>
  )
}

export { TopPerformers };
