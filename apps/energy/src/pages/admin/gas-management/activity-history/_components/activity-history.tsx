import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { HeaderCard } from '@/components/header-card';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import { getDefaultReportMetricsDateRange, toIndexerDateParams } from '@/utils/date-range';
import { ACTIVITY_DEFAULT_FROM_DAYS_AGO, ACTIVITY_DEFAULT_TO_DAYS_AGO } from '@/constants/report-metrics.constant';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, DataTableColumnHeader, DataTable, DataTablePagination, useDataTableInstance } from '@nexsoft-admin/ui';
import { formatCurrency, formatNumber } from '@nexsoft-admin/utils';
import type { OrderDto } from '@nexsoft-admin/models';
import { useOrders } from '@/services/activity';

const HEADER_CLASS = 'uppercase font-bold text-muted-foreground';

interface ActivityHistoryProps {
  className?: string;
}

function truncateHash(hash: string, chars = 5) {
  if (!hash || hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

function truncateAddress(addr: string, chars = 5) {
  if (!addr || addr.length <= chars * 2) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

function getStatusPill(status: string) {
  const upper = status?.toUpperCase() ?? '';
  const label = upper === 'COMPLETED' ? 'Success' : upper === 'FAILED' ? 'Error' : 'Processing';
  const bgClass =
    upper === 'COMPLETED'
      ? 'bg-green-500 text-white'
      : upper === 'FAILED'
        ? 'bg-destructive text-white'
        : 'bg-amber-500 text-white';
  return (
    <Badge variant='secondary' className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-medium ${bgClass}`}>
      {label}
    </Badge>
  );
}

const columns: ColumnDef<OrderDto>[] = [
  {
    accessorKey: 'user_transaction_hash',
    header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title='Transaction ID' />,
    cell: ({ row }) => (
      <span className='font-mono text-sm' title={row.original.user_transaction_hash}>
        {truncateHash(row.original.user_transaction_hash)}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'to_address',
    header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title='User Wallet' />,
    cell: ({ row }) => (
      <span
        className='text-primary cursor-pointer font-mono text-sm underline hover:underline'
        title={row.original.to_address}
      >
        {truncateAddress(row.original.to_address)}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'from_address',
    header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title='Sender Wallet' />,
    cell: ({ row }) => (
      <span
        className='text-primary cursor-pointer font-mono text-sm underline hover:underline'
        title={row.original.from_address}
      >
        {truncateAddress(row.original.from_address)}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: 'amount_value',
    header: ({ column }) => (
      <DataTableColumnHeader className={`${HEADER_CLASS} text-right`} column={column} title='Amount/Value' />
    ),
    cell: ({ row }) => (
      <div className='text-right'>
        <div className='font-medium'>
          {row.original.amount} {row.original.amount_type}
        </div>
        <div className='text-muted-foreground text-sm'>≈ {formatCurrency(row.original.total_charge)}</div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'delegated_energy',
    header: ({ column }) => (
      <DataTableColumnHeader className={`${HEADER_CLASS} text-right`} column={column} title='Energy Used' />
    ),
    cell: ({ row }) => (
      <div className='text-right'>{formatNumber(row.original.delegated_energy, { noDecimals: true })}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'delegated_bandwidth',
    header: ({ column }) => (
      <DataTableColumnHeader className={`${HEADER_CLASS} text-right`} column={column} title='Bandwidth Used' />
    ),
    cell: ({ row }) => (
      <div className='text-right'>{formatNumber(row.original.delegated_bandwidth, { noDecimals: true })}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader className={`${HEADER_CLASS} text-center`} column={column} title='Status' />
    ),
    cell: ({ row }) => <div className='flex justify-center'>{getStatusPill(row.original.status)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader className={`${HEADER_CLASS} text-right`} column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      if (!createdAt) return <span className='text-right'>—</span>;
      const d = dayjs(createdAt);
      return (
        <div className='text-right'>
          <div>{d.format('HH:mm:ss')}</div>
          <div className='text-muted-foreground text-sm'>{d.format('DD/MM/YYYY')}</div>
        </div>
      );
    },
    enableSorting: false,
  },
];

function ActivityHistory({ className }: ActivityHistoryProps) {
  const [selectedDateRanger, setSelectedDateRanger] = useState<DateRange | undefined>(() =>
    getDefaultReportMetricsDateRange({
      fromDaysAgo: ACTIVITY_DEFAULT_FROM_DAYS_AGO,
      toDaysAgo: ACTIVITY_DEFAULT_TO_DAYS_AGO,
    }),
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { from_date, to_date } = toIndexerDateParams(selectedDateRanger);

  const {
    data,
    isPending: loading,
    error,
  } = useOrders({
    from: from_date,
    to: to_date,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useDataTableInstance({
    data: data?.pagination?.data ?? [],
    columns,
    enableRowSelection: false,
    manualPagination: true,
    pageCount: data?.pagination?.total_pages,
    state: { pagination },
    handlers: { onPaginationChange: setPagination },
  });

  return (
    <div className={className}>
      <Card className='gap-4 pb-0'>
        <CardHeader>
          <HeaderCard
            icon='ClockRadiant'
            title={i18n._(msg`Activity History`)}
            description={i18n._(msg`View and manage all energy system transactions`)}
            selectedDateRanger={selectedDateRanger}
            onSelectDateRanger={setSelectedDateRanger}
          />
        </CardHeader>
        <CardContent className='pb-6'>
          {error && (
            <div className='p-6'>
              <p className='text-destructive text-sm'>{error.message}</p>
            </div>
          )}
          {!error && (
            <div className='flex flex-col gap-4'>
              <div className='overflow-hidden rounded-lg border'>
                <DataTable table={table} columns={columns} loading={loading} />
              </div>
              <DataTablePagination table={table} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { ActivityHistory };
