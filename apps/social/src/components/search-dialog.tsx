import { useLingui } from '@lingui/react';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@nexsoft-admin/ui';
import { useEventListener } from '@nexsoft-admin/hooks';
import { NAVIGATION_ITEMS } from '@/constants/navigation.constant';
import type { NavParent } from '@/types/navigation.type.ts';

interface SearchItem extends NavParent {
  group: string;
  disabled?: boolean;
}

const searchItems: Array<SearchItem> = NAVIGATION_ITEMS.map((item) => {
  return {
    group: 'Management',
    disabled: false,
    ...item,
  };
});

export default function SearchDialog() {
  const { i18n } = useLingui();
  const [open, setOpen] = React.useState<boolean>(false);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((prevState) => !prevState);
    }
  };

  useEventListener('keydown', onKeydown);

  return (
    <>
      <Button
        variant='link'
        className='text-muted-foreground !px-0 font-normal hover:no-underline'
        onClick={() => setOpen(true)}
      >
        <SearchIcon className='size-4' />
        Search
        <kbd className='bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none'>
          <span className='text-xs'>⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search features, users, and more…' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem className='!py-1.5' key={item.id} onSelect={() => setOpen(false)}>
                      {item.icon && <item.icon />}
                      <span>{i18n._(item.title)}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
