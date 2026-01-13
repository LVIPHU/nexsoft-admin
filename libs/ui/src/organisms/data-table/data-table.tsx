'use client';

import * as React from 'react';
import {
  KeyboardSensor,
  useSensor,
  useSensors,
  DndContext,
  closestCenter,
  type UniqueIdentifier,
  type DragEndEvent,
  PointerSensor,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  PaginationState,
  ColumnOrderState,
  RowSelectionState,
  OnChangeFn,
  type Table as TanStackTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsUpDown,
  EyeOff,
  Settings2,
  GripVerticalIcon,
  DatabaseIcon,
} from 'lucide-react';
import { cn, isDefined } from '@nexsoft-admin/utils';
import { Button } from '../../atoms/button';
import { Label } from '../../atoms/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '../dropdown-menu/dropdown-menu';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../atoms/empty';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/select';
import { Skeleton } from '../../atoms';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

interface DataTableState {
  sorting?: SortingState;
  pagination?: PaginationState;
  columnFilters?: ColumnFiltersState;
  columnVisibility?: VisibilityState;
  columnOrder?: ColumnOrderState;
  rowSelection?: RowSelectionState;
}

interface DataTableStateHandlers {
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

interface UseDataTableInstanceProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];

  enableRowSelection?: boolean;
  getRowId?: (row: TData, index: number) => string;

  state?: DataTableState;
  handlers?: DataTableStateHandlers;

  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

function useDataTableInstance<TData, TValue>({
  data,
  columns,
  enableRowSelection = true,
  getRowId,

  state,
  handlers,

  manualFiltering,
  manualPagination,
  manualSorting,
}: UseDataTableInstanceProps<TData, TValue>) {
  return useReactTable({
    data,
    columns,
    enableRowSelection,

    state: {
      sorting: state?.sorting,
      columnOrder: state?.columnOrder,
      columnFilters: state?.columnFilters,
      columnVisibility: state?.columnVisibility,
      rowSelection: state?.rowSelection,
      pagination: state?.pagination,
    },

    manualFiltering,
    manualPagination,
    manualSorting,

    getRowId: getRowId ?? ((row) => (row as any).id.toString()),

    onRowSelectionChange: handlers?.onRowSelectionChange,
    onSortingChange: handlers?.onSortingChange,
    onColumnFiltersChange: handlers?.onColumnFiltersChange,
    onColumnVisibilityChange: handlers?.onColumnVisibilityChange,
    onPaginationChange: handlers?.onPaginationChange,
    onColumnOrderChange: handlers?.onColumnOrderChange,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
}

function getSortIcon(sort: 'asc' | 'desc' | false | undefined) {
  switch (sort) {
    case 'desc':
      return <ArrowDown />;
    case 'asc':
      return <ArrowUp />;
    default:
      return <ChevronsUpDown />;
  }
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='data-[state=open]:bg-accent -ml-3 h-8'>
            <span>{title}</span>
            {getSortIcon(column.getIsSorted())}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className='text-muted-foreground/70 size-4' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className='text-muted-foreground/70 size-4' />
            Desc
          </DropdownMenuItem>
          {column.columnDef.enableHiding !== false && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOff className='text-muted-foreground/70 size-4' />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DataTableDragHandle({ id }: { id: string | number }) {
  const { attributes, listeners, isDragging } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      size='icon'
      variant='ghost'
      data-dragging={isDragging}
      className='text-muted-foreground size-7 cursor-grab hover:bg-transparent active:cursor-grabbing data-[dragging=true]:cursor-grabbing'
    >
      <GripVerticalIcon className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  );
}

const DataTableDragColumn: ColumnDef<any> = {
  id: 'drag',
  header: () => null,
  cell: ({ row }) => <DataTableDragHandle id={row.original.id.toString()} />,
  enableSorting: false,
  enableHiding: false,
};

function withDndColumn<T>(columns: ColumnDef<T>[]): ColumnDef<T>[] {
  return [DataTableDragColumn as ColumnDef<T>, ...columns];
}

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  pageSideOptions?: number[];
}

function DataTablePagination<TData>({ table, pageSideOptions = PAGE_SIZE_OPTIONS }: DataTablePaginationProps<TData>) {
  return (
    <div className='flex items-center justify-between'>
      <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex w-full items-center gap-8 lg:w-fit'>
        <div className='hidden items-center gap-2 lg:flex'>
          <Label htmlFor='rows-per-page' className='text-sm font-medium'>
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSideOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-fit items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className='ml-auto flex items-center gap-2 lg:ml-0'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant='outline'
            className='size-8'
            size='icon'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant='outline'
            className='size-8'
            size='icon'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant='outline'
            className='hidden size-8 lg:flex'
            size='icon'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DataTableDraggableRow<TData>({ row }: { row: Row<TData> }) {
  const getId = (): UniqueIdentifier => {
    const originalId = (row.original as { id?: string | number }).id;
    if (!originalId) return row.id;
    if (typeof originalId === 'string') return originalId;
    else return originalId.toString();
  };

  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: getId(),
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

function SortableColumnItem({
  id,
  label,
  disabled,
  checked,
  onCheckedChange,
  enableColumnVisibility,
}: {
  id: string;
  label: string;
  disabled?: boolean;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  enableColumnVisibility: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-dragging={isDragging}
      className='z-0 flex items-center justify-between rounded px-2 py-1 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
    >
      {!disabled && (
        <div
          {...listeners}
          data-dragging={isDragging}
          className='text-muted-foreground cursor-grab active:cursor-grabbing data-[dragging=true]:cursor-grabbing'
        >
          <GripVerticalIcon className='size-4' />
        </div>
      )}
      <div className='flex-1 text-sm'>
        {enableColumnVisibility ? (
          <DropdownMenuCheckboxItem className='capitalize' checked={checked} onCheckedChange={onCheckedChange}>
            {label}
          </DropdownMenuCheckboxItem>
        ) : (
          <span className='capitalize'>{label}</span>
        )}
      </div>
    </div>
  );
}

interface DataTableViewOptionsProps<TData> {
  table: TanStackTable<TData>;
  enableColumnVisibility?: boolean;
  enableColumnOrder?: boolean;
}

function DataTableViewOptions<TData>({
  table,
  enableColumnOrder = false,
  enableColumnVisibility = true,
}: DataTableViewOptionsProps<TData>) {
  const allColumns = table.getAllColumns();

  // Split columns into 2 groups: special columns (cannot be hidden) and data columns (can be hidden)
  const specialColumns = allColumns.filter(
    (column) => column.columnDef.enableHiding === false || typeof column.accessorFn === 'undefined',
  );
  const dataColumns = allColumns.filter(
    (column) =>
      column.columnDef.enableHiding !== false && typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  );

  // Only show data columns in dropdown
  const columns = dataColumns;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const columnOrder = table.getState().columnOrder ?? [];
  const currentFullOrder = columnOrder.length > 0 ? columnOrder : allColumns.map((col) => col.id);

  const orderedColumns =
    columnOrder.length > 0 ? columnOrder.map((id) => columns.find((c) => c.id === id)).filter(isDefined) : columns;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedColumns.findIndex((col) => col?.id === active.id);
    const newIndex = orderedColumns.findIndex((col) => col?.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder only data columns
      const newDataColumnOrder = arrayMove(
        orderedColumns.map((col) => col?.id),
        oldIndex,
        newIndex,
      );

      // Merge back with special columns: preserve special columns' positions in current order
      const specialColumnIds = new Set(specialColumns.map((col) => col.id));
      const dataColumnSet = new Set(newDataColumnOrder);
      const newOrder: string[] = [];
      let dataColumnIndex = 0;

      // Iterate through current order and rebuild
      for (const columnId of currentFullOrder) {
        if (specialColumnIds.has(columnId)) {
          // Preserve special column position
          newOrder.push(columnId);
        } else if (dataColumnSet.has(columnId)) {
          // Replace it with new order of data columns
          if (dataColumnIndex < newDataColumnOrder.length) {
            newOrder.push(newDataColumnOrder[dataColumnIndex]);
            dataColumnIndex++;
          }
        }
      }

      table.setColumnOrder(newOrder);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {enableColumnOrder ? (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={orderedColumns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
              {orderedColumns.map((column) => (
                <SortableColumnItem
                  id={column.id}
                  key={column.id}
                  label={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                  enableColumnVisibility={enableColumnVisibility}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          columns.map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DataTableEmptyState<TData, TValue>({ columns }: { columns: ColumnDef<TData, TValue>[] }) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length}>
        <Empty className='from-muted/50 to-background h-full bg-gradient-to-b from-30%'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <DatabaseIcon />
            </EmptyMedia>
            <EmptyTitle>No data to show</EmptyTitle>
            <EmptyDescription>This log will automatically be updated when new data is available.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </TableCell>
    </TableRow>
  );
}

function DataTableBody<TData, TValue>({
  table,
  columns,
  dndEnabled,
  dataIds,
  loading,
}: {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  loading: boolean;
  dndEnabled: boolean;
  dataIds: UniqueIdentifier[];
}) {
  if (loading) {
    const pageSize = table.getState().pagination.pageSize;
    return Array.from({ length: pageSize }, (_, index) => (
      <TableRow key={`loading-row-${index}`}>
        {Array.from({ length: columns.length }, (_, index) => (
          <TableCell key={`loading-cell-${index}`}>
            <Skeleton className={'h-6'} />
          </TableCell>
        ))}
      </TableRow>
    ));
  }
  if (!table.getRowModel().rows.length) {
    return <DataTableEmptyState columns={columns} />;
  }
  if (dndEnabled) {
    return (
      <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
        {table.getRowModel().rows.map((row) => (
          <DataTableDraggableRow key={row.id} row={row} />
        ))}
      </SortableContext>
    );
  }
  return table.getRowModel().rows.map((row) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
}

interface DataTableProps<TData, TValue> {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
  dndEnabled?: boolean;
  onReorder?: (newData: TData[]) => void;
}

function DataTable<TData, TValue>({
  table,
  columns,
  dndEnabled = false,
  loading = false,
  onReorder,
}: DataTableProps<TData, TValue>) {
  const dataIds: UniqueIdentifier[] = table.getRowModel().rows.map((row) => row.id.toString() as UniqueIdentifier);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id && onReorder) {
      const oldIndex = dataIds.indexOf(active.id.toString());
      const newIndex = dataIds.indexOf(over.id.toString());

      // Call parent with new data order (parent manages state)
      const newData = arrayMove(table.options.data, oldIndex, newIndex);
      onReorder(newData);
    }
  }

  const tableContent = (
    <Table>
      <TableHeader className='bg-muted sticky top-0 z-10'>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className='**:data-[slot=table-cell]:first:w-8'>
        {DataTableBody({ table, columns, dndEnabled, dataIds, loading })}
      </TableBody>
    </Table>
  );

  if (dndEnabled) {
    return (
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        {tableContent}
      </DndContext>
    );
  }

  return tableContent;
}

export {
  useDataTableInstance,
  DataTableDragColumn,
  withDndColumn,
  DataTable,
  DataTableBody,
  DataTableColumnHeader,
  DataTableDragHandle,
  DataTableDraggableRow,
  DataTableEmptyState,
  DataTablePagination,
  DataTableViewOptions,
  type DataTableState,
  type DataTableStateHandlers,
};
