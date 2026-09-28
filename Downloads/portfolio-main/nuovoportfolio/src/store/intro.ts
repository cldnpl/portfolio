import { create } from "zustand";

const INTRO_KEY = "introPlayed";

/** The loader runs once per browser session; later visits skip straight in. */
export const hasIntroPlayed = () => {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === "true";
  } catch {
    return false;
  }
};

export const markIntroPlayed = () => {
  try {
    window.sessionStorage.setItem(INTRO_KEY, "true");
  } catch {}
};

type IntroState = {
  loaderComplete: boolean;
  revealMeta: boolean;
  setLoaderComplete: () => void;
  setRevealMeta: (value: boolean) => void;
};

export const useIntroStore = create<IntroState>((set) => ({
  loaderComplete: false,
  revealMeta: false,
  setLoaderComplete: () => set({ loaderComplete: true }),
  setRevealMeta: (value) => set({ revealMeta: value }),
}));
