import { downloads, isPublished, publishedPlatforms, type Store } from "@/config/site";
import { cn } from "@/lib/cn";

// Simple Icons (CC0) glyphs. Swap in the official badges from Apple / Google
// once the app is live, following their badge guidelines.
const GLYPHS: Record<Store["id"], string> = {
  "app-store":
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
  "google-play":
    "M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z",
};

function StoreButton({ store }: { store: Store }) {
  const live = isPublished(store);
  const inner = (
    <>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
        <path d={GLYPHS[store.id]} />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10.5px] tracking-wide text-steel-300">{live ? store.eyebrow : `${store.platform} · ${downloads.comingSoon}`}</span>
        <span className="mt-1 text-[17px] font-semibold tracking-tight">{store.name}</span>
      </span>
    </>
  );
  if (live) {
    return (
      <a className="store-btn" href={store.url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <span className={cn("store-btn is-soon")} aria-disabled="true" title={`${store.name}: ${downloads.comingSoon}`}>
      {inner}
    </span>
  );
}

/** Store buttons; unpublished stores render as clearly marked "coming soon" placeholders. */
export function StoreButtons({ className, showNote = true }: { className?: string; showNote?: boolean }) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {downloads.stores.map((s) => (
          <StoreButton key={s.id} store={s} />
        ))}
      </div>
      {showNote && (
        <p className="spec mt-5 text-center">
          {publishedPlatforms.length ? `Available for ${publishedPlatforms.join(" and ")}` : downloads.pendingNote}
        </p>
      )}
    </div>
  );
}
