import { create } from "zustand";

export type CursorType = "default" | "project";

type CursorState = {
  cursorType: CursorType;
  cursorLabel: string | null;
  setCursor: (type: CursorType, label?: string) => void;
  resetCursor: () => void;
};

export const useCursorStore = create<CursorState>((set) => ({
  cursorType: "default",
  cursorLabel: null,
  setCursor: (type, label) => set({ cursorType: type, cursorLabel: label ?? null }),
  resetCursor: () => set({ cursorType: "default", cursorLabel: null }),
}));
