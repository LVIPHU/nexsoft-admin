import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader, DataTablePagination, useDataTableInstance } from '@nexsoft-admin/ui/data-table';
import { Input } from '@nexsoft-admin/ui/input';
import { NativeSelect } from '@nexsoft-admin/ui/native-select';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationContentDto } from '@nexsoft-admin/models';
import { useViolationContents } from '@/services/content-moderation';
import { PAGE_SIZE } from '@/constants/table.constant';
import { ContentTypeBadge, ViolationStatusBadge, PriorityBadge, ReportCountBadge } from './violation-badges';
import { ActionButtons } from './action-buttons';

const HEADER_CLASS = 'text-xs uppercase';

function AllContentTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE.DEFAULT_VALUE });
  const [statusFilter, setStatusFilter] = useState('');

  const { data, loading, error } = useViolationContents({
    violation_status: statusFilter || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns = useMemo<ColumnDef<ViolationContentDto>[]>(
    () => [
      {
        accessorKey: 'content',
        header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Content`)} />,
        cell: ({ row }) => (
          <div className='max-w-xs truncate text-sm' title={row.original.content}>
            {row.original.content}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Type`)} />,
        cell: ({ row }) => <ContentTypeBadge type={row.original.type} />,
        enableSorting: false,
      },
      {
        accessorKey: 'violation_status',
        header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Status`)} />,
        cell: ({ row }) => <ViolationStatusBadge status={row.original.violation_status} />,
        enableSorting: false,
      },
      {
        accessorKey: 'number_of_violations',
        header: ({ column }) => <DataTableColumnHeader className={`${HEADER_CLASS} text-center`} column={column} title={i18n._(msg`Reports`)} />,
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <ReportCountBadge count={row.original.number_of_violations} />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'priority',
        header: ({ column }) => <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Priority`)} />,
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
        enableSorting: false,
      },
      {
        id: 'actions',
        header: () => <span className={`${HEADER_CLASS} font-medium`}>{i18n._(msg`Actions`)}</span>,
        cell: ({ row }) => <ActionButtons id={row.original.id} status={row.original.violation_status} />,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const table = useDataTableInstance({
    data: data?.data ?? [],
    columns,
    enableRowSelection: false,
    manualPagination: true,
    pageCount: data?.pagination.total_pages,
    state: { pagination },
    handlers: { onPaginationChange: setPagination },
  });

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h3 className='font-semibold'>{i18n._(msg`All Content`)}</h3>
        <p className='text-muted-foreground text-sm'>
          {i18n._(msg`Total`)} {data?.pagination.total_rows ?? 0} {i18n._(msg`content items`)}
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Input
          placeholder={i18n._(msg`Search...`)}
          className='max-w-xs'
          disabled
        />
        <NativeSelect
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          className='w-36'
        >
          <option value=''>{i18n._(msg`All Status`)}</option>
          <option value='PENDING'>{i18n._(msg`Pending`)}</option>
          <option value='BYPASS'>{i18n._(msg`Approved`)}</option>
          <option value='BAN'>{i18n._(msg`Banned`)}</option>
        </NativeSelect>
      </div>
      {error && <p className='text-destructive text-sm'>{error.message}</p>}
      <div className='overflow-hidden rounded-lg border'>
        <DataTable table={table} columns={columns} loading={loading} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { AllContentTable };
