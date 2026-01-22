import { Outlet } from 'react-router';
import { SidebarProvider, SidebarInset } from '@nexsoft-admin/ui/sidebar';
import { Header } from './_components/header';
import { Sidebar } from './_components/sidebar';

function AdminLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className='flex min-h-screen flex-col gap-8'>
          <Header />
          <main className='@container/main flex flex-1 flex-col gap-4 p-4 pt-0 md:gap-6 md:px-6'>
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AdminLayout };
