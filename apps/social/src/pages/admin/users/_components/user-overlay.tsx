import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';
import { UserForm } from './user-form';
import { useUser } from '@/services/user';

function UserOverlay({ isTop, props, ...rest }: OverlayItem & { isTop: boolean }) {
  const { user, loading, error } = useUser(props?.id);

  return (
    <Overlay isTop={isTop} {...rest}>
      <UserForm user={user} loading={loading} />
    </Overlay>
  );
}

export { UserOverlay };
