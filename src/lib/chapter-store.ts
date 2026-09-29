import { useSyncExternalStore } from "react";

/** Index into `chapters` (config/site.ts) for the corner HUD and sound cues. */
let current = 0;
const listeners = new Set<() => void>();

export function setChapter(index: number) {
  if (index === current) return;
  current = index;
  listeners.forEach((l) => l());
}

export function subscribeChapter(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getChapter = () => current;

export function useChapter() {
  return useSyncExternalStore(subscribeChapter, getChapter, () => 0);
}
