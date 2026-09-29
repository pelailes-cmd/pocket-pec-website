"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { sound } from "@/lib/sound";

/** Optional ambience. Off by default; audio is only created after a click. */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(sound.subscribe, sound.isEnabled, () => false);
  return (
    <button
      type="button"
      onClick={() => void sound.toggle()}
      aria-pressed={on}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full px-3.5 font-mono text-[10.5px] uppercase tracking-[0.2em] ring-1 transition-colors",
        on ? "text-white ring-white/30" : "text-steel-400 ring-white/12 hover:text-white",
        className,
      )}
    >
      <span className={cn("sound-bars", on && "is-on")} aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
