import type { I18n } from '@lingui/core';
import { useLingui } from '@lingui/react';
import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@nexsoft-admin/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@nexsoft-admin/ui/collapsible';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@nexsoft-admin/ui/sidebar';
import ActiveIndicator from './active-indicator';
import type { NavItem as NavItemType, NavParent } from '@/types/navigation.type.ts';

interface NavItemProps {
  data: NavParent;
}

function NavItem({ data }: NavItemProps) {
  const { i18n } = useLingui();
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = pathname.startsWith(data.href);

  return (
    <Collapsible asChild defaultOpen={data.isCollapsed}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={i18n._(data.title)}
          className={cn('h-11 px-4 py-3 font-medium', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
        >
          <Link to={data.href}>
            {data.icon ? <data.icon /> : null}
            <span>{i18n._(data.title)}</span>
            {isActive && <ActiveIndicator className='ml-auto' />}
          </Link>
        </SidebarMenuButton>
        <SubItem data={data.items} i18n={i18n} />
      </SidebarMenuItem>
    </Collapsible>
  );
}

interface SubItemProps {
  data?: ReadonlyArray<NavItemType>;
  i18n: I18n;
}

function SubItem({ data, i18n }: SubItemProps) {
  if (!data || !data.length) return null;
  return (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className='data-[state=open]:rotate-90'>
          <ChevronRight />
          <span className='sr-only'>Toggle</span>
        </SidebarMenuAction>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {data.map((subItem) => (
            <SidebarMenuSubItem key={subItem.id}>
              <SidebarMenuSubButton asChild>
                <Link to={subItem.href}>
                  <span>{i18n._(subItem.title)}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </>
  );
}

export { NavItem, SubItem };
