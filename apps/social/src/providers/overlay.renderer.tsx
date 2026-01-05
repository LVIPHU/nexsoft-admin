import { useOverlayStore } from '@/stores/overlay.store';
import { testModal } from '@/components/testModal';
import { UserOverlay } from '@/pages/admin/users/_components/user-overlay';

const overlayRegistry: Record<string, React.ComponentType<any>> = {
  test: testModal,
  user: UserOverlay,
};

export function OverlayRenderer() {
  const stack = useOverlayStore((s) => s.stack);

  return (
    <>
      {stack.map((item, index) => {
        const Component = overlayRegistry[item.name];
        if (!Component) return null;

        const { name, props, ...itemProps } = item;
        return <Component key={item.id} {...itemProps} isTop={index === stack.length - 1} props={props} />;
      })}
    </>
  );
}
