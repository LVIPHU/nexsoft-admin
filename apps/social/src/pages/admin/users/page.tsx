import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { UserDto } from '@nexsoft-admin/models';
import {
  Badge,
  Button,
  Checkbox,
  DataTable,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DataTableDragHandle,
  DataTableColumnHeader,
  DataTableViewOptions,
  DataTablePagination,
  useDataTableInstance,
} from '@nexsoft-admin/ui';
import { useTableAdapter } from '@/hooks/useTableAdapter';
import { EllipsisVerticalIcon } from 'lucide-react';
import { PAGE_INDEX, PAGE_SIZE } from '@/constants/table.constant';
import { useUsers } from '@/services/users';

function UsersPage() {
  const { state, handlers } = useTableAdapter('users');

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

  const columns = useMemo<Array<ColumnDef<UserDto>>>(
    () => [
      {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DataTableDragHandle id={row.original.user_id} />,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'select',
        header: ({ table }) => (
          <div className='flex items-center justify-center'>
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
              aria-label='Select all'
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className='flex items-center justify-center'>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
              aria-label='Select row'
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'user_id',
        accessorKey: 'user_id',
        header: ({ column }) => <DataTableColumnHeader column={column} title='User ID' />,
        cell: ({ row }) => <div className='max-w-[200px] truncate'>{row.getValue('user_id')}</div>,
      },
      {
        id: 'username',
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
        cell: ({ row }) => <div className='max-w-[150px] truncate'>{row.getValue('username')}</div>,
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div className='max-w-[200px] truncate'>{row.getValue('name')}</div>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: () => {
          return (
            <Badge variant='outline' className='text-muted-foreground px-1.5'>
              N/A
            </Badge>
          );
        },
      },
      {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
        cell: ({ row }) => {
          const date = row.getValue('created_at');
          return date && date instanceof Date ? (
            <div className='max-w-[150px]'>{dayjs(date).format('MMM DD, YYYY')}</div>
          ) : (
            <span className='text-muted-foreground'>N/A</span>
          );
        },
      },
      {
        id: 'actions',
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                size='icon'
              >
                <EllipsisVerticalIcon />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-32'>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive'>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );
  const table = useDataTableInstance({
    data: list,
    columns,
    state,
    handlers,
    getRowId: (row: any) => row.user_id.toString(),
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-end'>
        <DataTableViewOptions table={table} enableColumnOrder/>
      </div>
      <div className='overflow-hidden rounded-lg border'>
        <DataTable dndEnabled table={table} columns={columns} onReorder={setList} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

export { UsersPage };
