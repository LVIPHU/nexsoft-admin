import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nexsoft-admin/ui/table';
import { Button } from '@nexsoft-admin/ui/button';
import { HeaderCard } from '@/components/header-card';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { formatNumber, formatCurrency } from '@nexsoft-admin/utils';

interface TopPerformer {
  userId: string;
  userName: string;
  totalTransactions: number;
  totalEnergyUsed: number;
  totalBandwidthUsed: number;
  totalTransactionValue: number;
}

const mockData: TopPerformer[] = [
  {
    userId: 'UID13579246',
    userName: 'Ryan White',
    totalTransactions: 361,
    totalEnergyUsed: 485000,
    totalBandwidthUsed: 463,
    totalTransactionValue: 9567,
  },
  {
    userId: 'UID24680135',
    userName: 'Sarah Chen',
    totalTransactions: 298,
    totalEnergyUsed: 412000,
    totalBandwidthUsed: 389,
    totalTransactionValue: 8234,
  },
  {
    userId: 'UID98765432',
    userName: 'Marcus Johnson',
    totalTransactions: 256,
    totalEnergyUsed: 368000,
    totalBandwidthUsed: 342,
    totalTransactionValue: 7156,
  },
  {
    userId: 'UID11223344',
    userName: 'Emma Wilson',
    totalTransactions: 224,
    totalEnergyUsed: 291000,
    totalBandwidthUsed: 298,
    totalTransactionValue: 5890,
  },
];

interface TopPerformersProps {
  className?: string;
}

function TopPerformers({ className }: TopPerformersProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
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
        <CardContent className='px-6 pt-0'>
          <div className='overflow-hidden rounded-2xl'>
            <Table>
              <TableHeader>
                <TableRow className='h-13 *:data-[slot=table-head]:uppercase dark:bg-black/70'>
                  <TableHead>{i18n._(msg`Top User`)}</TableHead>
                  <TableHead>{i18n._(msg`Total Transactions`)}</TableHead>
                  <TableHead>{i18n._(msg`Total Energy Used`)}</TableHead>
                  <TableHead>{i18n._(msg`Total Bandwidth Used`)}</TableHead>
                  <TableHead className='bg-[#0DCC6114] text-white'>{i18n._(msg`Total Transaction Value`)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((row) => (
                  <TableRow key={row.userId} className='even:bg-muted/30 group h-20'>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{row.userName}</span>
                        <span className='text-muted-foreground text-xs'>{row.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(row.totalTransactions, { noDecimals: true })}</TableCell>
                    <TableCell>{formatNumber(row.totalEnergyUsed, { noDecimals: true })}</TableCell>
                    <TableCell>{formatNumber(row.totalBandwidthUsed, { noDecimals: true })}</TableCell>
                    <TableCell className='font-medium text-white group-odd:bg-[#25342C] group-even:bg-[#0DCC6114]'>
                      {formatCurrency(row.totalTransactionValue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='mb-4 flex justify-end'>
            <Button variant='link' className='text-green-600 dark:text-green-500' asChild>
              <Link to='/gas-management/activity-history'>{i18n._(msg`View all`)}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { TopPerformers };
