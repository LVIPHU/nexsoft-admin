import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader, DataTablePagination, useDataTableInstance } from '@nexsoft-admin/ui/data-table';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationContentDto } from '@nexsoft-admin/models';
import { useViolationContents } from '@/services/content-moderation';
import { PAGE_SIZE } from '@/constants/table.constant';
import { ContentTypeBadge, PriorityBadge, ReportCountBadge } from './violation-badges';
import { ActionButtons } from './action-buttons';

const HEADER_CLASS = 'text-xs uppercase';

function HighPriorityTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE.DEFAULT_VALUE });

  const { data, loading, error } = useViolationContents({
    priority: 'VERY_HIGH,HIGH',
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
        <h3 className='text-destructive flex items-center gap-2 font-semibold'>
          {i18n._(msg`High Priority Content`)}
        </h3>
        <p className='text-muted-foreground text-sm'>{i18n._(msg`Content with high violation levels requiring immediate action`)}</p>
      </div>
      {error && <p className='text-destructive text-sm'>{error.message}</p>}
      <div className='overflow-hidden rounded-lg border'>
        <DataTable table={table} columns={columns} loading={loading} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { HighPriorityTable };
