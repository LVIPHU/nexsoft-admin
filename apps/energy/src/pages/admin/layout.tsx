import { Outlet } from 'react-router';
import { SidebarProvider, SidebarInset } from '@nexsoft-admin/ui/sidebar';
import { Header } from './_components/header';
import { Sidebar } from './_components/sidebar';

function AdminLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className='@container/main flex flex-1 flex-col gap-4 p-4 pt-0 md:gap-6 md:p-6'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AdminLayout };
