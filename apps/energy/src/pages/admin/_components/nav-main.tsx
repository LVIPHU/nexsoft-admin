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
          <div className='border-b border-gray-200 pb-2 last:border-0' key={item.id}>
            <NavItem data={item} />
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavMain };
