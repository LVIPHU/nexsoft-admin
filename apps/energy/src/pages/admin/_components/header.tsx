import { cn } from '@nexsoft-admin/utils';
import { Separator } from '@nexsoft-admin/ui/separator';
import { SidebarTrigger } from '@nexsoft-admin/ui/sidebar';
import { ThemeSwitch } from '@/components/theme-switch';
import SearchDialog from '@/components/search-dialog';
import { useLayoutStore } from '@/stores/layout.store';

function Header() {
  const navbarStyle = useLayoutStore((state) => state.navbarStyle);

  return (
    <header
      data-navbar-style={navbarStyle}
      className={cn(
        'flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
        // Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
        'data-[navbar-style=sticky]:bg-background/50 data-[navbar-style=sticky]:sticky data-[navbar-style=sticky]:top-0 data-[navbar-style=sticky]:z-50 data-[navbar-style=sticky]:overflow-hidden data-[navbar-style=sticky]:rounded-t-[inherit] data-[navbar-style=sticky]:backdrop-blur-md',
      )}
    >
      <div className='flex flex-1 items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
        <SearchDialog />
      </div>
      <div className='px-4'>
        <ThemeSwitch />
      </div>
    </header>
  );
}

export { Header };
