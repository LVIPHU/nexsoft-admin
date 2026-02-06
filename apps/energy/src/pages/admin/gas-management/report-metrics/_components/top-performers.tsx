import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nexsoft-admin/ui/table';
import { Button } from '@nexsoft-admin/ui/button';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { HeaderCard } from '@/components/header-card';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { formatNumber, formatCurrency } from '@nexsoft-admin/utils';
import { usePerformers } from '@/services/report-metrics';

interface TopPerformersProps {
  className?: string;
}

function TopPerformers({ className }: TopPerformersProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() => ({
    from: dayjs().subtract(7, 'day').toDate(),
    to: dayjs().toDate(),
  }));

  const from_date =
    selectedDateRanger?.from != null ? dayjs(selectedDateRanger.from).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';
  const to_date =
    selectedDateRanger?.to != null ? dayjs(selectedDateRanger.to).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' : '';

  const {
    data,
    isPending: loading,
    error,
  } = usePerformers({ from_date, to_date }, { enabled: Boolean(from_date && to_date) });

  const rows = data?.pagination?.Data ?? [];
  const isEmpty = !loading && !error && rows.length === 0;

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
                {loading &&
                  Array.from({ length: 4 }, (_, i) => (
                    <TableRow key={i} className='even:bg-muted/30 h-20'>
                      <TableCell colSpan={5}>
                        <Skeleton className='h-8 w-full' />
                      </TableCell>
                    </TableRow>
                  ))}
                {error && (
                  <TableRow>
                    <TableCell colSpan={5} className='text-destructive py-6 text-center text-sm'>
                      {error.message}
                    </TableCell>
                  </TableRow>
                )}
                {isEmpty && (
                  <TableRow>
                    <TableCell colSpan={5} className='text-muted-foreground py-8 text-center text-sm'>
                      {i18n._(msg`No performers in this period`)}
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  !error &&
                  rows.length > 0 &&
                  rows.map((row) => (
                    <TableRow key={row.user_address} className='even:bg-muted/30 group h-20'>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-mono text-sm font-medium'>
                            {row.user_address.length > 12
                              ? `${row.user_address.slice(0, 8)}...${row.user_address.slice(-8)}`
                              : row.user_address}
                          </span>
                          <span className='text-muted-foreground text-xs'>{row.user_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(row.total_orders, { noDecimals: true })}</TableCell>
                      <TableCell>
                        {formatNumber(row.total_delegated_energy, {
                          noDecimals: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {formatNumber(row.total_delegated_bandwidth, {
                          noDecimals: true,
                        })}
                      </TableCell>
                      <TableCell className='font-medium text-white group-odd:bg-[#25342C] group-even:bg-[#0DCC6114]'>
                        {formatCurrency(row.total_usdt_revenue)}
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
