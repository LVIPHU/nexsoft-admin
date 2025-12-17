import { NavItem } from './nav-item';
import { SidebarGroup, SidebarMenu } from '@nexsoft-admin/ui/sidebar';
import type { Navigation } from '@/types/navigation.type';

interface NavMainProps {
  items: Navigation;
}

function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu className='gap-y-2'>
        {items.map((item) => (
          <NavItem key={item.id} data={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavMain };
