import { UsersTable } from './_components/users-table';
import { useMemo } from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DataTableDragHandle,
  DataTableColumnHeader,
} from '@nexsoft-admin/ui';
import { UserDto } from '@nexsoft-admin/models';
import { ColumnDef } from '@tanstack/react-table';
import { useOverlayStore } from '@/stores/overlay.store';
import { OverlayMode } from '@/types/overlay.type';
import { queryClient } from '@/libs/query-client';
import { getUser } from '@/services/user';
import { USER_KEY } from '@/constants/query-keys.constant';

function UsersPage() {
  const openUserOverlay = ({ mode, props }: { mode: OverlayMode; props?: Record<string, any> }) => {
    useOverlayStore.getState().open({
      id: crypto.randomUUID(),
      kind: 'sheet',
      name: 'user',
      mode: mode,
      props: props,
      onBeforeOpen: async () => {
        if (mode !== 'create' && props?.id) {
          await queryClient.prefetchQuery({
            queryKey: [USER_KEY, { id: props.id }],
            queryFn: () => getUser({ id: props.id }),
          });
        }
      },
    });
  };

  const columns = useMemo<Array<ColumnDef<UserDto>>>(
    () => [
      {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DataTableDragHandle id={row.original.UserId} />,
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
        id: 'UserId',
        accessorKey: 'UserId',
        header: ({ column }) => <DataTableColumnHeader column={column} title='User ID' />,
        cell: ({ row }) => <div className='max-w-50 truncate'>{row.getValue('UserId')}</div>,
      },
      {
        id: 'Username',
        accessorKey: 'Username',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
        cell: ({ row }) => <div className='max-w-37.5 truncate'>{row.getValue('Username')}</div>,
      },
      {
        id: 'Name',
        accessorKey: 'Name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div className='max-w-50 truncate'>{row.getValue('Name')}</div>,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
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
              <DropdownMenuItem
                onClick={() => openUserOverlay({ mode: 'update', props: { id: row.original.UserId } })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openUserOverlay({ mode: 'duplicate', props: { id: row.original.UserId } })}
              >
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openUserOverlay({ mode: 'delete', props: { id: row.original.UserId } })}
                className='text-destructive'
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  return (
    <div className='flex flex-1 flex-col'>
      <UsersTable columns={columns} />
    </div>
  );
}

export { UsersPage };
