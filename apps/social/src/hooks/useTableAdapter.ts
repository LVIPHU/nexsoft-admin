import * as React from 'react';
import { useSearchParams } from 'react-router';
import type {
  SortingState,
  PaginationState,
  ColumnFiltersState,
  VisibilityState,
  ColumnOrderState,
  RowSelectionState,
  OnChangeFn,
} from '@tanstack/react-table';

import type { DataTableState, DataTableStateHandlers } from '@nexsoft-admin/ui/data-table';
import {
  COlUMN_FILTERS,
  COlUMN_ORDER,
  COlUMN_VISIBILITY,
  PAGE_INDEX,
  PAGE_SIZE,
  SORT,
} from '@/constants/table.constant';
import { useLocalStorage } from '@nexsoft-admin/hooks';

function useTableAdapter(storageKey = 'data-table'): {
  state: DataTableState;
  handlers: DataTableStateHandlers;
} {
  const [params, setParams] = useSearchParams();

  const pagination: PaginationState = {
    pageIndex: Math.max(Number(params.get(PAGE_INDEX.KEY) ?? PAGE_INDEX.DEFAULT_VALUE) - 1, 0),
    pageSize: Number(params.get(PAGE_SIZE.KEY) ?? PAGE_SIZE.DEFAULT_VALUE),
  };

  const sorting: SortingState = React.useMemo(() => {
    const raw = params.get(SORT.KEY);
    if (!raw) return [];
    return raw.split(',').map((s) => {
      const [id, dir] = s.split(':');
      return { id, desc: dir === 'desc' };
    });
  }, [params]);

  const columnFilters: ColumnFiltersState = React.useMemo(() => {
    const raw = params.get(COlUMN_FILTERS.KEY);
    if (!raw) return [];
    return raw.split(',').map((f) => {
      const [id, value] = f.split(':');
      return { id, value };
    });
  }, [params]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    `${storageKey}:${COlUMN_VISIBILITY.KEY}`,
    {},
  );

  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(`${storageKey}:${COlUMN_ORDER.KEY}`, []);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;

    setParams((prev) => {
      prev.set(PAGE_INDEX.KEY, String(next.pageIndex + 1));
      prev.set(PAGE_SIZE.KEY, String(next.pageSize));
      return prev;
    });
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;

    setParams((prev) => {
      if (!next.length) {
        prev.delete(SORT.KEY);
      } else {
        prev.set(SORT.KEY, next.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','));
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;

    setParams((prev) => {
      if (!next.length) {
        prev.delete(COlUMN_FILTERS.KEY);
      } else {
        prev.set(COlUMN_FILTERS.KEY, next.map((f) => `${f.id}:${f.value}`).join(','));
      }
      prev.set(PAGE_INDEX.KEY, '1');
      return prev;
    });
  };

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibility((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  const onColumnOrderChange: OnChangeFn<ColumnOrderState> = (updater) => {
    setColumnOrder((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelection((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  };

  return {
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    handlers: {
      onPaginationChange,
      onSortingChange,
      onColumnFiltersChange,
      onColumnVisibilityChange,
      onColumnOrderChange,
      onRowSelectionChange,
    },
  };
}

export { useTableAdapter };
