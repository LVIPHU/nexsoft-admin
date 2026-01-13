import { UsersTable } from './_components/users-table';
import { H1 } from '@/pages/admin/_components/heading';
import { Trans } from '@lingui/react/macro';
import { useMemo } from 'react';
import { EllipsisVerticalIcon, UserIcon } from 'lucide-react';
import {
  Badge,
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
      // Prefetch user data trước khi mở overlay nếu có id
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
        cell: ({ row }) => {
          const isActive = row.getValue('status') === 'ACTIVE';
          return <Badge variant={isActive ? 'default' : 'destructive'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
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
              <DropdownMenuItem
                onClick={() =>
                  openUserOverlay({ mode: 'update', props: { id: 'ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY10obO' } })
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openUserOverlay({ mode: 'duplicate', props: { id: 'ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY10obO' } })
                }
              >
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  openUserOverlay({ mode: 'delete', props: { id: 'ELQfzt3BhekiCoa861jpDSetRn9q853hrdBb39qY10obO' } })
                }
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
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <div className='flex w-full flex-col items-start justify-between gap-4 @xl/main:flex-row @xl/main:items-center'>
        <div>
          <H1>
            <Trans>User Management</Trans>
          </H1>
          <p className='text-muted-foreground'>
            <Trans>Manage all users in the system.</Trans>
          </p>
        </div>

        <Button size='lg' onClick={() => openUserOverlay({ mode: 'create' })}>
          <UserIcon />
          <Trans>Add user</Trans>
        </Button>
      </div>
      <UsersTable columns={columns} />
    </div>
  );
}

export { UsersPage };
