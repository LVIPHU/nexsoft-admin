'use client';
import { msg } from '@lingui/core/macro';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@nexsoft-admin/ui';
import { cn, languages, Language, LanguageId } from '@nexsoft-admin/utils';
import fuzzy from 'fuzzy';
import { useMemo, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';

type Props = {
  value: string;
  onValueChange: (id: LanguageId) => void;
};

function LocaleCombobox({ value, onValueChange }: Props) {
  const { i18n } = useLingui();
  const [search, setSearch] = useState<string>('');

  const options = useMemo(() => {
    return fuzzy.filter(search, languages as never, {
      extract: (lang: Language) => `${lang.name} ${lang.locale}`,
    });
  }, [search]);

  return (
    <Command shouldFilter={false}>
      <CommandInput value={search} placeholder={i18n._(msg`Search for a language`)} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>
          <Trans>No results found</Trans>
        </CommandEmpty>
        <CommandGroup>
          <ScrollArea>
            <div className='max-h-60'>
              {options.map((option) => (
                <CommandItem
                  key={option.original.id}
                  disabled={false}
                  value={option.original.id.trim()}
                  onSelect={(selectedValue) => {
                    const result = options.find(({ original }) => original.id.trim() === selectedValue);
                    if (!result) return;
                    onValueChange(option.original.id);
                  }}
                >
                  <CheckIcon className={cn('mr-2 size-4 opacity-0', value === option.original.id && 'opacity-100')} />
                  {option.original.subname} <span className='ml-1 text-xs opacity-50'>({option.original.locale})</span>
                </CommandItem>
              ))}
            </div>
          </ScrollArea>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function LocaleComboboxPopover({ value, onValueChange, ...rest }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const selected = useMemo(() => {
    return languages.find((lang) => lang.id === value);
  }, [value]);

  const onSelect = (selectedValue: LanguageId) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role='combobox'
          variant='outline'
          aria-expanded={open}
          className='hover:bg-secondary/20 w-full justify-between active:scale-100'
        >
          <span className='line-clamp-1 text-left font-normal'>
            {selected?.subname} <span className='ml-1 text-xs opacity-50'>({selected?.locale})</span>
          </span>
          <ChevronDownIcon
            className={cn('ml-2 size-4 shrink-0 rotate-0 opacity-50 transition-transform', open && 'rotate-180')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0'>
        <LocaleCombobox value={value} onValueChange={onSelect} {...rest} />
      </PopoverContent>
    </Popover>
  );
}

export { LocaleCombobox, LocaleComboboxPopover };
