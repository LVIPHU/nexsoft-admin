import * as React from 'react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@nexsoft-admin/ui/sidebar';
import { Logo } from '@/components/logo';
import { NAVIGATION_ITEMS, USER_NAVIGATION_ITEMS } from '@/constants/navigation.constant';
import { useProfile } from '@/services/profile';
import { NavMain } from './nav-main';
import { NavProfile } from './nav-profile';
import { Link } from 'react-router';

function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const { profile } = useProfile();
  return (
    <SidebarComponent collapsible='offcanvas' variant={'sidebar'} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link to='/' aria-label='Home'>
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAVIGATION_ITEMS} />
      </SidebarContent>
      <SidebarFooter>{profile && <NavProfile profile={profile} items={USER_NAVIGATION_ITEMS} />}</SidebarFooter>
    </SidebarComponent>
  );
}

export { Sidebar };
