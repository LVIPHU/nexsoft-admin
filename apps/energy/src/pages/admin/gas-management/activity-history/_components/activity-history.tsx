import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';

interface ActivityHistoryProps {
  className?: string;
}

function ActivityHistory({ className }: ActivityHistoryProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs('2022-07-13').toDate(),
    to: dayjs('2023-07-20').toDate(),
  }));

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            icon={'ClockRadiant'}
            title={i18n._(msg`Activity History`)}
            description={i18n._(msg`View and manage all energy system transactions`)}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'></CardContent>
      </Card>
    </div>
  );
}

export { ActivityHistory };
