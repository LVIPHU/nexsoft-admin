import { ReactNode } from 'react';

export type OverlayKind = 'dialog' | 'sheet';

export type OverlayMode = 'create' | 'update' | 'duplicate' | 'delete';

export interface Overlay {
  id: string;
  isTop: boolean;
  formId?: string;
  kind: OverlayKind;
  mode: OverlayMode;
  title?: ReactNode;
  description?: ReactNode;
  onSubmit?: (mode: OverlayMode) => void | Promise<void>;
  onClose?: (mode: OverlayMode) => void | Promise<void>;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  children?: ReactNode;
}

export interface OverlayItem<T extends Record<string, any> = Record<string, any>> extends Omit<
  Overlay,
  'children' | 'isTop'
> {
  name: string;
  props?: T;
}
