import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { UserDto } from '@nexsoft-admin/models';
import {
  DataTable,
  DataTableViewOptions,
  DataTablePagination,
  useDataTableInstance,
} from '@nexsoft-admin/ui/data-table';
import { useTableAdapter } from '@/hooks/useTableAdapter';
import { PAGE_INDEX, PAGE_SIZE } from '@/constants/table.constant';
import { useUsers } from '@/services/user';
import { UsersFilter } from '@/pages/admin/users/_components/users-filter';
import { Button } from '@nexsoft-admin/ui/button';
import { Trans } from '@lingui/react/macro';
import { OverlayMode } from '@/types/overlay.type';
import { useOverlayStore } from '@/stores/overlay.store';

function UsersTable({ columns }: { columns: Array<ColumnDef<UserDto>> }) {
  const { state, handlers } = useTableAdapter('users');

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
      search: undefined,
      status: undefined,
      page: state.pagination?.pageIndex || PAGE_INDEX.DEFAULT_VALUE,
      limit: state.pagination?.pageSize || PAGE_SIZE.DEFAULT_VALUE,
    }),
    [state.pagination?.pageIndex, state.pagination?.pageSize],
  );

  const { users, loading, error } = useUsers(data);

  const [list, setList] = useState<UserDto[]>([]);

  useEffect(() => {
    if (users && users.data && users.data.length) {
      setList([...users.data]);
    }
  }, [users]);

  const table = useDataTableInstance({
    data: list,
    columns,
    state,
    handlers,
    getRowId: (row: any) => row.user_id.toString(),
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
          <UsersFilter />
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
