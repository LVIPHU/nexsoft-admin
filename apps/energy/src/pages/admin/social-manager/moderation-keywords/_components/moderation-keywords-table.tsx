import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTablePagination, useDataTableInstance } from '@nexsoft-admin/ui/data-table';
import { Button } from '@nexsoft-admin/ui/button';
import { Trans } from '@lingui/react/macro';
import { ModerationKeywordDto } from '@nexsoft-admin/models';
import { useModerationKeywords } from '@/services/content-moderation';
import { PAGE_SIZE } from '@/constants/table.constant';
import { useOverlayStore } from '@/stores/overlay.store';
import { ModerationKeywordsFilter } from './moderation-keywords-filter';

const TOPIC_PARAM = 'topic';

function ModerationKeywordsTable({ columns }: { columns: Array<ColumnDef<ModerationKeywordDto>> }) {
  const [params, setParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE.DEFAULT_VALUE,
  });

  const topic = params.get(TOPIC_PARAM) ?? '';

  const handleTopicChange = (value: string) => {
    setParams((prev) => {
      if (value) {
        prev.set(TOPIC_PARAM, value);
      } else {
        prev.delete(TOPIC_PARAM);
      }
      setPagination((p) => ({ ...p, pageIndex: 0 }));
      return prev;
    });
  };

  const openCreateOverlay = () => {
    useOverlayStore.getState().open({
      id: crypto.randomUUID(),
      kind: 'sheet',
      name: 'moderation-keyword',
      mode: 'create',
      props: {},
    });
  };

  const openMobileFilterOverlay = () => {
    useOverlayStore.getState().open({
      id: crypto.randomUUID(),
      kind: 'sheet',
      name: 'moderation-keywords-filter',
      mode: 'create',
      props: {},
    });
  };

  const { data, loading, error } = useModerationKeywords({
    topic: topic || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useDataTableInstance({
    data: data?.data ?? [],
    columns,
    enableRowSelection: false,
    manualPagination: true,
    pageCount: data?.pagination.total_pages,
    state: { pagination },
    handlers: { onPaginationChange: setPagination },
    getRowId: (row: ModerationKeywordDto) => String(row.id),
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-4'>
        <div className='hidden items-center gap-3 lg:flex'>
          <ModerationKeywordsFilter topic={topic} onTopicChange={handleTopicChange} />
        </div>
        <div className='flex items-center gap-2 lg:hidden'>
          <Button variant='outline' size='sm' onClick={openMobileFilterOverlay}>
            <Trans>Filter</Trans>
          </Button>
        </div>
        <Button size='sm' onClick={openCreateOverlay}>
          <Trans>Add Keyword</Trans>
        </Button>
      </div>
      {error && <p className='text-destructive text-sm'>{error.message}</p>}
      <div className='overflow-hidden rounded-lg border'>
        <DataTable loading={loading} table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { ModerationKeywordsTable };
