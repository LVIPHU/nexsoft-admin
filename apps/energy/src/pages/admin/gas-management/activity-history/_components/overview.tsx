import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { SectionCard } from '@/components/section-card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';

interface OverviewProps {
  className?: string;
}

// Mock data cho metrics
const metrics = {
  totalEnergySystemEarned: 10890000000,
  totalBandwidthEarned1: 10890000000,
  totalBandwidthEarned2: 10890000000,
  totalBandwidthEarned3: 10890000000,
};

function Overview({ className }: OverviewProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs('2022-07-13').toDate(),
    to: dayjs('2023-07-20').toDate(),
  }));

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            title={i18n._(msg`Overview`)}
            icon={'ZapRadiant'}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1 *:data-[slot=card]:border-t @5xl/main:grid-cols-2 @5xl/main:*:data-[slot=card]:even:border-l @7xl/main:grid-cols-4 @7xl/main:*:data-[slot=card]:border-l @7xl/main:*:data-[slot=card]:first:border-l-0'>
            <SectionCard title={i18n._(msg`TOTAL ENERGY SYSTEM EARNED`)} value={metrics.totalEnergySystemEarned} />
            <SectionCard title={i18n._(msg`TOTAL BANDWIDTH EARNED`)} value={metrics.totalBandwidthEarned1} />
            <SectionCard title={i18n._(msg`TOTAL BANDWIDTH EARNED`)} value={metrics.totalBandwidthEarned2} />
            <SectionCard title={i18n._(msg`TOTAL BANDWIDTH EARNED`)} value={metrics.totalBandwidthEarned3} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { Overview };
