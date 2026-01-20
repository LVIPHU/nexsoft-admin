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
import { useSSO } from '@nexsoft-admin/sso';
import { Button } from '@nexsoft-admin/ui/button';
import { Logo } from '@/components/logo';
import { NAVIGATION_ITEMS } from '@/constants/navigation.constant';
import { NavMain } from './nav-main';
import { Link } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { LogOutIcon } from 'lucide-react';

function Sidebar({ ...props }: React.ComponentProps<typeof SidebarComponent>) {
  const { logout } = useSSO();

  const onSignOut = () => {
    logout().then(() => window.location.reload());
  };

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
      <SidebarFooter>
        <Button variant={'outline'} className='rounded-full' onClick={onSignOut} aria-label='Logout'>
          <LogOutIcon />
          <Trans>Logout</Trans>
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
}

export { Sidebar };
