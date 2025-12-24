'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CircleCheckIcon, EllipsisVerticalIcon, LoaderIcon } from 'lucide-react';
import {
  DataTable as ComponentDataTable,
  DataTableColumnHeader,
  useDataTableInstance,
  withDndColumn,
} from './data-table';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Checkbox } from '../../atoms/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu';
import { Input } from '../../atoms/input';
import { Label } from '../../atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/select';
import data from '../../tests/data.json';

const meta: Meta<typeof ComponentDataTable> = {
  title: 'Organisms/DataTable',
  component: ComponentDataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Section Type' />,
    cell: ({ row }) => (
      <div className='w-32'>
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.type}
        </Badge>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'Done' ? (
          <CircleCheckIcon className='stroke-border fill-green-500 dark:fill-green-400' />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'target',
    header: ({ column }) => <DataTableColumnHeader className='w-full text-right' column={column} title='Target' />,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: 'Done',
            error: 'Error',
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className='sr-only'>
          Target
        </Label>
        <Input
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'limit',
    header: ({ column }) => <DataTableColumnHeader className='w-full text-right' column={column} title='Limit' />,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: 'Done',
            error: 'Error',
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className='sr-only'>
          Limit
        </Label>
        <Input
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'reviewer',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Reviewer' />,
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== 'Assign reviewer';

      if (isAssigned) {
        return row.original.reviewer;
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className='sr-only'>
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className='w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
              size='sm'
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder='Assign reviewer' />
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='Eddie Lake'>Eddie Lake</SelectItem>
              <SelectItem value='Jamik Tashpulatov'>Jamik Tashpulatov</SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <EllipsisVerticalIcon />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];

const TempDataTable = ({ data: initialData }: { data: z.infer<typeof schema>[] }) => {
  const [data, setData] = React.useState(() => initialData);
  const cols = withDndColumn(columns);
  const table = useDataTableInstance({ data, columns, getRowId: (row: any) => row.id.toString() });
  return <ComponentDataTable dndEnabled table={table} columns={cols} onReorder={setData} />;
};

export const BasicDataTable: Story = {
  render: () => {
    return (
      <div className='mx-auto p-4'>
        <TempDataTable data={data} />
      </div>
    );
  },
};
