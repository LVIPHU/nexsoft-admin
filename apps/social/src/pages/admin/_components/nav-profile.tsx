import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';
import { ChevronsUpDownIcon, LogOutIcon } from 'lucide-react';
import { useSSO } from '@nexsoft-admin/sso';
import { Avatar, AvatarFallback, AvatarImage } from '@nexsoft-admin/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@nexsoft-admin/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@nexsoft-admin/ui/sidebar';
import type { ProfileDto } from '@nexsoft-admin/models';
import type { NavItem } from '@/types/navigation.type';

interface NavProfileProps {
  profile: ProfileDto;
  items: Array<NavItem>;
}

function NavProfile({ profile, items }: NavProfileProps) {
  const { i18n } = useLingui();
  const { logout } = useSSO();
  const { isMobile } = useSidebar();

  const onSignOut = () => {
    logout().then(() => window.location.reload());
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                <AvatarFallback className='rounded-lg'>TBC</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{profile.name}</span>
              </div>
              <ChevronsUpDownIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
                  <AvatarFallback className='rounded-lg'>TBC</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{profile.name}</span>
                  <span className='truncate text-xs'>{profile.bio}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {items.map((item) => (
                <Link key={item.id} to={item.href} aria-label={item.id}>
                  <DropdownMenuItem>
                    {item.icon ? <item.icon /> : null}
                    <p>{i18n._(item.title)}</p>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOutIcon />
              <Trans>Sign out</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { NavProfile };
