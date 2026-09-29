import {
  BookOpen,
  Bookmark,
  FileText,
  GraduationCap,
  House,
  Search,
  SpellCheck,
  Table2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Hit, HitKind } from "@/config/screens";
import { cn } from "@/lib/cn";

export function StatusBar({ time = "9:30" }: { time?: string }) {
  return (
    <div className="ui-status" aria-hidden>
      <span>{time}</span>
      <span className="ui-status-icons">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <rect x="0" y="7" width="2.6" height="4" rx="0.8" />
          <rect x="4" y="5" width="2.6" height="6" rx="0.8" />
          <rect x="8" y="2.5" width="2.6" height="8.5" rx="0.8" />
          <rect x="12" y="0" width="2.6" height="11" rx="0.8" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.2c2.5 0 4.8.9 6.6 2.5l1.2-1.3A11.3 11.3 0 0 0 8 .4 11.3 11.3 0 0 0 .2 3.4l1.2 1.3A9.6 9.6 0 0 1 8 2.2Zm0 3.6c1.5 0 2.9.5 4 1.5l1.2-1.3A7.9 7.9 0 0 0 8 4c-2 0-3.8.7-5.2 2l1.2 1.3c1.1-1 2.5-1.5 4-1.5Zm0 3.5c-.6 0-1.2.2-1.6.6L8 11.6l1.6-1.7c-.4-.4-1-.6-1.6-.6Z" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="14" height="8" rx="1.6" fill="currentColor" />
          <rect x="21.5" y="4" width="1.8" height="4" rx="0.8" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

const NAV: { label: string; icon: LucideIcon }[] = [
  { label: "Home", icon: House },
  { label: "Library", icon: BookOpen },
  { label: "Search", icon: Search },
  { label: "Practice", icon: GraduationCap },
  { label: "Saved", icon: Bookmark },
];

export function NavBar({ active }: { active: "Home" | "Library" | "Search" | "Practice" | "Saved" }) {
  return (
    <div className="ui-navbar" aria-hidden>
      {NAV.map(({ label, icon: Icon }) => (
        <div key={label} className={cn("ui-nav-item", label === active && "is-active")}>
          <span className="ui-nav-pill">
            <Icon size={22} strokeWidth={label === active ? 2.4 : 2} />
          </span>
          {label}
        </div>
      ))}
      <span className="ui-gesture" />
    </div>
  );
}

export const kindIcon: Record<HitKind, LucideIcon> = {
  article: FileText,
  part: Bookmark,
  section: FileText,
  table: Table2,
};

export const shortcutIcon: Record<string, LucideIcon> = {
  articles: BookOpen,
  tables: Table2,
  definitions: SpellCheck,
  bookmarks: Bookmark,
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Highlights words that start with any of `terms` (case-insensitive), like the
 * app's result highlighting.
 */
export function Highlight({ text, terms }: { text: string; terms: readonly string[] }) {
  if (!terms.length) return <>{text}</>;
  const alternatives = [...terms].sort((a, b) => b.length - a.length).map(escape).join("|");
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])((?:${alternatives})[\\p{L}\\p{N}]*)`, "giu");
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const start = m.index + m[1].length;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <mark key={start} className="ui-mark">
        {m[2]}
      </mark>,
    );
    last = start + m[2].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function PageChip({ page }: { page: string }) {
  return (
    <span className="ui-pagechip">
      <FileText size={13} />
      p. {page}
    </span>
  );
}

export function ResultTile({
  hit,
  terms = [],
  emphasize = false,
  className,
}: {
  hit: Hit;
  terms?: readonly string[];
  emphasize?: boolean;
  className?: string;
}) {
  const Icon = kindIcon[hit.kind];
  return (
    <div className={cn("ui-result", className)}>
      <span className={cn("ui-result-icon", emphasize && "is-emph")}>
        <Icon size={19} />
      </span>
      <div className="ui-result-main">
        <div className="ui-result-title">
          <Highlight text={hit.label} terms={terms} />
        </div>
        <div className="ui-crumbs">{hit.crumbs}</div>
      </div>
      <PageChip page={hit.page} />
    </div>
  );
}

/** App search field; GSAP types into `.js-typed`. */
export function SearchField({
  text = "",
  placeholder,
  focused = true,
  caret = true,
}: {
  text?: string;
  placeholder: string;
  focused?: boolean;
  caret?: boolean;
}) {
  return (
    <div className={cn("ui-search", focused && "is-focused")}>
      <Search size={22} />
      <span className="ui-search-text">
        <span className="js-typed" data-placeholder={placeholder}>
          {text}
        </span>
        {caret && <i className="ui-caret" />}
      </span>
    </div>
  );
}
