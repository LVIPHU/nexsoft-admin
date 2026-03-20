import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';

function ModerationKeywordsFilterOverlay({ isTop, props, ...rest }: OverlayItem & { isTop: boolean }) {
  return <Overlay isTop={isTop} {...rest}></Overlay>;
}

export { ModerationKeywordsFilterOverlay };
