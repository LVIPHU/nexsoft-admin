import { useLingui } from '@lingui/react';
import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { cn } from '@nexsoft-admin/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@nexsoft-admin/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@nexsoft-admin/ui/sidebar';
import type { NavParent, NavSection } from '@/types/navigation.type.ts';
import { TreeLeafLine } from '@/pages/admin/_components/tree-leaf-line';

interface NavItemProps {
  data: NavParent | NavSection;
}

export function isNavParent(item: NavParent | NavSection): item is NavParent {
  return 'items' in item;
}

function NavItem({ data }: NavItemProps) {
  const { i18n } = useLingui();
  const location = useLocation();
  const pathname = location.pathname;

  const isActive =
    (!isNavParent(data) && pathname.endsWith(data.href)) ||
    (isNavParent(data) && data.items.some((x) => pathname.endsWith(x.href)));

  const defaultOpen = isNavParent(data) ? (isActive ? true : !data.isCollapsed) : undefined;

  if (!isNavParent(data)) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={i18n._(data.title)}
          className={cn(
            'h-10 px-4 py-3 font-medium dark:text-neutral-400',
            isActive && 'bg-primary/12 text-primary! hover:bg-primary/12 hover:text-primary',
          )}
        >
          <Link to={data.href}>
            {data.icon ? <data.icon /> : null}
            <span>{i18n._(data.title)}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className='group/collapsible'>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className='h-10 px-4 py-3 font-medium dark:text-neutral-400 dark:hover:text-neutral-400'>
          {data.icon ? <data.icon /> : null}
          {i18n._(data.title)}{' '}
          <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      {data.items?.length ? (
        <CollapsibleContent>
          <SidebarMenuSub className='ml-0 border-0 pl-0'>
            {data.items.map((subItem, idx) => {
              const isLast = idx === data.items.length - 1;
              const isActive = pathname.endsWith(subItem.href);
              return (
                <SidebarMenuSubItem key={subItem.id} className='flex'>
                  <TreeLeafLine isLast={isLast} />
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      'h-11 w-full px-4 py-3 font-medium dark:text-neutral-400',
                      isActive && 'bg-primary/12 text-primary! hover:bg-primary/12 hover:text-primary',
                    )}
                  >
                    <Link to={subItem.href}>
                      <span>{i18n._(subItem.title)}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}

export { NavItem };
