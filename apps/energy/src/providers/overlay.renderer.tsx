import { useOverlayStore } from '@/stores/overlay.store';
import { UserOverlay } from '@/pages/admin/social-manager/user-management/_components/user-overlay';
import { UsersFilterOverlay } from '@/pages/admin/social-manager/user-management/_components/users-filter-overlay';
import { ModerationKeywordOverlay } from '@/pages/admin/social-manager/moderation-keywords/_components/moderation-keyword-overlay';
import { ModerationKeywordsFilterOverlay } from '@/pages/admin/social-manager/moderation-keywords/_components/moderation-keywords-filter-overlay';

const overlayRegistry: Record<string, React.ComponentType<any>> = {
  user: UserOverlay,
  'users-filter': UsersFilterOverlay,
  'moderation-keyword': ModerationKeywordOverlay,
  'moderation-keywords-filter': ModerationKeywordsFilterOverlay,
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
