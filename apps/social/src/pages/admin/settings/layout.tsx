import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Link, Outlet, redirect, useLocation } from 'react-router';

import { H1 } from '../_components/heading';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@nexsoft-admin/ui/navigation-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nexsoft-admin/ui/select';
import { SETTINGS_NAVIGATION_ITEMS } from '@/constants/navigation.constant';
import { cn } from '@nexsoft-admin/utils';
import type { NavItem } from '@/types/navigation.type.ts';

export function SettingsLayout() {
  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-6'>
      <div>
        <H1>
          <Trans>Setting</Trans>
        </H1>
        <p className='text-muted-foreground'>
          <Trans>Update account preferences and manage integrations.</Trans>
        </p>
      </div>
      <div className='flex w-full flex-col items-start justify-center gap-4 @xl/main:flex-row'>
        <NavigationMenu className='hidden @xl/main:block'>
          <NavigationMenuList className='flex-col gap-1'>
            {SETTINGS_NAVIGATION_ITEMS.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <SelectItems items={SETTINGS_NAVIGATION_ITEMS} />

        <div className='flex w-full flex-1 gap-4 px-4 md:gap-6 md:px-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NavigationItem({ item }: { item: NavItem }) {
  const { i18n } = useLingui();
  const { pathname } = useLocation();
  const isActive = pathname.endsWith(item.href);
  console.log(pathname, item.href, isActive);
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        data-active={isActive}
        className={cn(navigationMenuTriggerStyle(), 'flex flex-row! justify-start')}
        asChild
      >
        <Link to={item.href} aria-label={item.id} className='text-sidebar-accent-foreground @xl/main:min-w-3xs'>
          {item.icon ? <item.icon /> : null}
          <span>{i18n._(item.title)}</span>
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function SelectItems({ items }: { items: ReadonlyArray<NavItem> }) {
  const { i18n } = useLingui();
  const { pathname } = useLocation();

  // Tìm item hiện tại dựa trên pathname
  const currentItem = items.find((item) => pathname === item.href || pathname.endsWith(item.href));
  const value = currentItem?.href || '';

  const handleValueChange = (newValue: string) => {
    const selectedItem = items.find((item) => item.href === newValue);
    if (selectedItem) {
      redirect(selectedItem.href);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className='flex w-full @xl/main:hidden' size='sm' aria-label='Select settings section'>
        <SelectValue placeholder={i18n._(msg`Select a section`)} />
      </SelectTrigger>
      <SelectContent className='rounded-xl'>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.href} className='rounded-lg' aria-label={item.id}>
            <div className='flex items-center gap-2'>
              {item.icon ? <item.icon className='h-4 w-4' /> : null}
              <span>{i18n._(item.title)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
