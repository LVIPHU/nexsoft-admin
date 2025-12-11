'use client';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { LanguagesIcon } from 'lucide-react';
import { useState } from 'react';
import { LocaleCombobox } from './locale-combobox';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@nexsoft-admin/ui';
import { LanguageId } from '@nexsoft-admin/utils';
import { usePathname, useRouter } from 'next/navigation';

export const LocaleSwitch = () => {
  const { i18n } = useLingui();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [locale, setLocale] = useState<LanguageId>(pathname?.split('/')[1] as LanguageId);

  function changeLanguage(id: LanguageId) {
    const pathNameWithoutLocale = pathname?.split('/')?.slice(2) ?? [];
    const newPath = `/${id}/${pathNameWithoutLocale.join('/')}`;

    setLocale(locale);
    router.push(`${newPath}${window.location.search}${window.location.hash}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' aria-label={i18n._(msg`Change Language`)}>
          <LanguagesIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='p-0'>
        <LocaleCombobox
          value={i18n.locale}
          onValueChange={(id) => {
            changeLanguage(id);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
