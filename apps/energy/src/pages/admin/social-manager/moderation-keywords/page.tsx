import { useMemo } from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@nexsoft-admin/ui';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { ModerationKeywordDto } from '@nexsoft-admin/models';
import { useOverlayStore } from '@/stores/overlay.store';
import { OverlayMode } from '@/types/overlay.type';
import { ModerationKeywordsTable } from './_components/moderation-keywords-table';
import { HeaderCard } from '@/components/header-card';

function ModerationKeywordsPage() {
  const openKeywordOverlay = ({ mode, props }: { mode: OverlayMode; props?: Record<string, unknown> }) => {
    useOverlayStore.getState().open({
      id: crypto.randomUUID(),
      kind: 'sheet',
      name: 'moderation-keyword',
      mode,
      props,
    });
  };

  const columns = useMemo<Array<ColumnDef<ModerationKeywordDto>>>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title={i18n._(msg`ID`)} />,
        cell: ({ row }) => <span className='text-muted-foreground text-sm'>{row.original.id}</span>,
        enableSorting: false,
        size: 60,
      },
      {
        id: 'keyword',
        accessorKey: 'keyword',
        header: ({ column }) => <DataTableColumnHeader column={column} title={i18n._(msg`Keyword`)} />,
        cell: ({ row }) => <span className='max-w-48 truncate font-mono text-sm'>{row.original.keyword}</span>,
        enableSorting: false,
      },
      {
        id: 'lang_code',
        accessorKey: 'lang_code',
        header: ({ column }) => <DataTableColumnHeader column={column} title={i18n._(msg`Language`)} />,
        cell: ({ row }) => (
          <Badge variant='outline' className='font-mono uppercase'>
            {row.original.lang_code}
          </Badge>
        ),
        enableSorting: false,
        size: 90,
      },
      {
        id: 'topics',
        accessorKey: 'topics',
        header: ({ column }) => <DataTableColumnHeader column={column} title={i18n._(msg`Topics`)} />,
        cell: ({ row }) => (
          <div className='flex flex-wrap gap-1'>
            {row.original.topics.map((topic) => (
              <Badge key={topic} variant='secondary' className='text-xs'>
                {topic.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: 'is_active',
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title={i18n._(msg`Status`)} />,
        cell: ({ row }) =>
          row.original.is_active ? (
            <Badge className='border-green-500/30 bg-green-500/15 text-green-600'>{i18n._(msg`Active`)}</Badge>
          ) : (
            <Badge variant='outline' className='text-muted-foreground'>
              {i18n._(msg`Inactive`)}
            </Badge>
          ),
        enableSorting: false,
        size: 90,
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
                <span className='sr-only'>{i18n._(msg`Open menu`)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-32'>
              <DropdownMenuItem
                onClick={() =>
                  openKeywordOverlay({
                    mode: 'update',
                    props: {
                      id: row.original.id,
                      keyword: row.original.keyword,
                      lang_code: row.original.lang_code,
                      topics: row.original.topics,
                      is_active: row.original.is_active,
                    },
                  })
                }
              >
                {i18n._(msg`Edit`)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
    ],
    [],
  );

  return (
    <Card className='gap-4'>
      <CardHeader>
        <HeaderCard
          title={i18n._(msg`Moderation Keywords`)}
          description={i18n._(msg`Manage sensitive keywords that trigger auto-ban.`)}
        />
      </CardHeader>
      <CardContent>
        <ModerationKeywordsTable columns={columns} />
      </CardContent>
    </Card>
  );
}

export { ModerationKeywordsPage };
