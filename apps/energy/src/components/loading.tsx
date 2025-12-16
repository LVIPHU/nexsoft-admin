import { SwirlingEffectSpinner } from '@nexsoft-admin/ui/spinner';

function Loading() {
  return (
    <div className='fixed top-0 right-0 left-0 flex h-dvh items-center justify-center'>
      <SwirlingEffectSpinner />
    </div>
  );
}

export { Loading };
