import { cn } from '@nexsoft-admin/utils';
import { H1 } from './heading';
import { useProfile } from '@/services/profile';

function Header() {
  const { profile } = useProfile();
  return (
    <header className={cn('mt-10 flex min-h-16 shrink-0 items-center gap-2 px-8')}>
      <div className='flex flex-1 flex-col gap-2'>
        <H1>Welcome to Gas Management</H1>
        <p>Monitor and manage your gas metrics and transactions</p>
      </div>
      <div className='px-4'>
        <div className='grid flex-1 text-left'>
          <span className='truncate'>{profile?.name}</span>
          <span className='truncate text-xs text-neutral-400'>UID {profile?.id}</span>
        </div>
      </div>
    </header>
  );
}

export { Header };
