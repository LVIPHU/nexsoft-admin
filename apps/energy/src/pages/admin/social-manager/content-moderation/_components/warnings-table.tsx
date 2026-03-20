import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  useDataTableInstance,
} from '@nexsoft-admin/ui/data-table';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationContentDto } from '@nexsoft-admin/models';
import { useViolationContents } from '@/services/content-moderation';
import { PAGE_SIZE } from '@/constants/table.constant';
import { VIOLATION_STATUS } from '@/constants/violation.constant';
import { ContentTypeBadge, ViolationStatusBadge, ReportCountBadge } from './violation-badges';
import { ActionButtons } from './action-buttons';
import { HeaderCard } from '@/components/header-card';

const HEADER_CLASS = 'text-xs uppercase';

function WarningsTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE.DEFAULT_VALUE });

  const { data, loading, error } = useViolationContents({
    violation_status: VIOLATION_STATUS.PENDING,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns = useMemo<ColumnDef<ViolationContentDto>[]>(
    () => [
      {
        accessorKey: 'content',
        header: ({ column }) => (
          <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Content`)} />
        ),
        cell: ({ row }) => (
          <div className='max-w-xs truncate text-sm' title={row.original.content}>
            {row.original.content}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Type`)} />
        ),
        cell: ({ row }) => <ContentTypeBadge type={row.original.type} />,
        enableSorting: false,
      },
      {
        accessorKey: 'violation_status',
        header: ({ column }) => (
          <DataTableColumnHeader className={HEADER_CLASS} column={column} title={i18n._(msg`Status`)} />
        ),
        cell: ({ row }) => <ViolationStatusBadge status={row.original.violation_status} />,
        enableSorting: false,
      },
      {
        accessorKey: 'number_of_violations',
        header: ({ column }) => (
          <DataTableColumnHeader
            className={`${HEADER_CLASS} text-center`}
            column={column}
            title={i18n._(msg`Reports`)}
          />
        ),
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <ReportCountBadge count={row.original.number_of_violations} />
          </div>
        ),
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
      <HeaderCard title={i18n._(msg`Warning Content`)} description={i18n._(msg`Content pending review.`)} />
      {error && <p className='text-destructive text-sm'>{error.message}</p>}
      <div className='overflow-hidden rounded-lg border'>
        <DataTable table={table} columns={columns} loading={loading} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { WarningsTable };
