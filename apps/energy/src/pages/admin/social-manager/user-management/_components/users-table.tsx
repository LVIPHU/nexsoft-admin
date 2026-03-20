import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ColumnDef } from '@tanstack/react-table';
import { UserDto } from '@nexsoft-admin/models';
import {
  DataTable,
  DataTableViewOptions,
  DataTablePagination,
  useDataTableInstance,
} from '@nexsoft-admin/ui/data-table';
import { useTableAdapter } from '@/hooks/useTableAdapter';
import { KEYWORD, PAGE_INDEX, PAGE_SIZE } from '@/constants/table.constant';
import { useUsers } from '@/services/user';
import { UsersFilter } from './users-filter';
import { Button } from '@nexsoft-admin/ui/button';
import { Trans } from '@lingui/react/macro';
import { OverlayMode } from '@/types/overlay.type';
import { useOverlayStore } from '@/stores/overlay.store';

function UsersTable({ columns }: { columns: Array<ColumnDef<UserDto>> }) {
  const { state, handlers } = useTableAdapter('users');
  const [params, setParams] = useSearchParams();

  const keyword = params.get(KEYWORD.KEY) ?? '';

  const handleSearch = (value: string) => {
    setParams((prev) => {
      if (value) {
        prev.set(KEYWORD.KEY, value);
      } else {
        prev.delete(KEYWORD.KEY);
      }
      prev.set(PAGE_INDEX.KEY, '1');
      return prev;
    });
  };

  const openUsersFilterOverlay = ({ mode, props }: { mode: OverlayMode; props?: Record<string, any> }) => {
    useOverlayStore.getState().open({
      id: crypto.randomUUID(),
      kind: 'sheet',
      name: 'users-filter',
      mode: mode,
      props: props,
    });
  };

  const data = useMemo(
    () => ({
      page: state.pagination?.pageIndex || PAGE_INDEX.DEFAULT_VALUE,
      limit: state.pagination?.pageSize || PAGE_SIZE.DEFAULT_VALUE,
      keyword: keyword || undefined,
    }),
    [state.pagination?.pageIndex, state.pagination?.pageSize, keyword],
  );

  const { users, loading, error } = useUsers(data);

  const [list, setList] = useState<UserDto[]>([]);

  useEffect(() => {
    if (users && users.users && users.users.length) {
      setList([...users.users]);
    }
  }, [users]);

  const table = useDataTableInstance({
    data: list,
    columns,
    state,
    handlers,
    getRowId: (row: UserDto) => row.UserId,
  });

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-red-600'>Error fetching users</div>
          <div className='mb-4'>{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-end gap-4 lg:justify-between'>
        <div className='hidden lg:block'>
          <UsersFilter keyword={keyword} onSearch={handleSearch} />
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => openUsersFilterOverlay({ mode: 'create' })}
          className='lg:hidden'
        >
          <Trans>Filter</Trans>
        </Button>
        <DataTableViewOptions table={table} enableColumnOrder />
      </div>
      <div className='overflow-hidden rounded-lg border'>
        <DataTable loading={loading} dndEnabled table={table} columns={columns} onReorder={setList} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { UsersTable };
