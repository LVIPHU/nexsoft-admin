import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';

function testModal({ isTop, ...rest }: OverlayItem & { isTop: boolean }) {
  return (
    <Overlay isTop={isTop} {...rest}>
      <div>test</div>
    </Overlay>
  );
}

export { testModal };
