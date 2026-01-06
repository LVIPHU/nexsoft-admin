import { create } from 'zustand';
import type { OverlayItem } from '@/types/overlay.type';

type OverlayState = {
  stack: OverlayItem[];
  open: (item: OverlayItem) => Promise<void> | void;
  close: () => void;
  closeById: (id: string) => void;
  replace: (item: OverlayItem) => void;
  reset: () => void;
};

export const useOverlayStore = create<OverlayState>((set) => ({
  stack: [],

  open: async (item) => {
    // Chạy onBeforeOpen nếu có
    if (item.onBeforeOpen) {
      await item.onBeforeOpen();
    }
    // Add vào stack sau khi onBeforeOpen hoàn thành
    set((state) => ({
      stack: [...state.stack, item],
    }));
  },

  close: () =>
    set((state) => ({
      stack: state.stack.slice(0, -1),
    })),

  closeById: (id) =>
    set((state) => ({
      stack: state.stack.filter((x) => x.id !== id),
    })),

  replace: (item) =>
    set((state) => ({
      stack: [...state.stack.slice(0, -1), item],
    })),

  reset: () => set({ stack: [] }),
}));
