import { Button } from '@nexsoft-admin/ui/button';
import { useOverlayStore } from '@/stores/overlay.store';

function UsersPage() {
  return (
    <div>
      <Button
        onClick={() =>
          useOverlayStore.getState().open({
            id: crypto.randomUUID(),
            kind: 'dialog',
            name: 'test',
            mode: 'delete',
            props: {},
          })
        }
      >
        Test
      </Button>
    </div>
  );
}

export { UsersPage };
