import {
  ArrowBigUp,
  ArrowLeft,
  BookmarkPlus,
  ChevronDown,
  ChevronRight,
  Clock,
  Delete,
  FileText,
  Info,
  ListTree,
  Search,
  Settings,
  Table2,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
  type ArticleBlock,
  type ArticleDemo,
  type ScreenId,
  type SearchDemo,
  demoTable,
  home,
  library,
  saved,
  screenshots,
} from "@/config/screens";
import { asset, site } from "@/config/site";
import { cn } from "@/lib/cn";
import { NavBar, PageChip, ResultTile, SearchField, StatusBar, kindIcon, shortcutIcon } from "./primitives";

/** Renders a real screenshot instead of the mockup when one is configured. */
function Screen({ id, className, children }: { id: ScreenId; className?: string; children: ReactNode }) {
  const shot = screenshots[id];
  return (
    <div data-screen={id} className={className}>
      {shot ? <img src={asset(shot)} alt="" className="absolute inset-0 h-full w-full object-cover" /> : children}
    </div>
  );
}

export function SplashScreen({ className }: { className?: string }) {
  return (
    <Screen id="splash" className={className}>
      <div className="ui ui-splash">
        <div className="ui-splash-logo">
          <img src={asset(site.logo.color)} alt="" />
        </div>
        <div className="text-center">
          <div className="ui-t-lg" style={{ color: "#fff" }}>
            {home.title}
          </div>
          <div className="ui-b-sm" style={{ color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
            {home.subtitle}
          </div>
        </div>
        <div className="ui-splash-bar">
          <i className="js-splash-bar" />
        </div>
      </div>
    </Screen>
  );
}

export function HomeScreen({ className }: { className?: string }) {
  return (
    <Screen id="home" className={className}>
      <div className="ui">
        <div className="ui-home-header">
          <StatusBar />
          <div className="js-home-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="ui-logo-tile">
              <img src={asset(site.logo.color)} alt="" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, lineHeight: "26px", fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>{home.title}</div>
              <div className="ui-ellipsis" style={{ fontSize: 12, lineHeight: "16px", color: "rgba(255,255,255,0.8)" }}>
                {home.subtitle}
              </div>
            </div>
            <span className="ui-icon-btn" style={{ color: "#fff" }}>
              <Settings size={22} />
            </span>
          </div>
          <div className="js-home-prompt" style={{ marginTop: 18, fontSize: 20, lineHeight: "26px", fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
            {home.prompt}
          </div>
          <div className="ui-home-search js-home-search" style={{ marginTop: 12, marginRight: 8 }}>
            <Search size={22} />
            <span className="ui-ellipsis">{home.searchHint}</span>
          </div>
        </div>

        <div className="ui-body" style={{ padding: "16px 16px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {home.shortcuts.map((s) => {
              const Icon = shortcutIcon[s.icon];
              return (
                <div key={s.title} className="ui-card ui-tile js-home-tile">
                  <div className="ui-tile-icon">
                    <Icon size={21} />
                  </div>
                  <div className="ui-t-sm">{s.title}</div>
                  <div className="ui-b-sm ui-ellipsis" style={{ marginTop: 2 }}>
                    {s.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ui-section-title" style={{ padding: "22px 4px 10px" }}>
            Commonly used tables
          </div>
          <div className="js-home-chips" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {home.commonTables.map((t) => (
              <span key={t.number} className="ui-action-chip">
                <Table2 size={16} />
                {t.label} · {t.number}
              </span>
            ))}
          </div>
        </div>
        <NavBar active="Home" />
      </div>
    </Screen>
  );
}

const SEARCH_HINT = 'Search words, "exact phrase", 2.10.1.8, Table 3.10.2.6(B)(16)…';

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function Keyboard() {
  return (
    <div className="ui-kbd" aria-hidden>
      <div className="ui-kbd-row" style={{ marginTop: 0 }}>
        {[...KEY_ROWS[0]].map((k) => (
          <span key={k} className="ui-key" data-key={k}>
            {k}
          </span>
        ))}
      </div>
      <div className="ui-kbd-row">
        {[...KEY_ROWS[1]].map((k) => (
          <span key={k} className="ui-key" data-key={k}>
            {k}
          </span>
        ))}
      </div>
      <div className="ui-kbd-row">
        <span className="ui-key is-wide">
          <ArrowBigUp size={18} />
        </span>
        {[...KEY_ROWS[2]].map((k) => (
          <span key={k} className="ui-key" data-key={k}>
            {k}
          </span>
        ))}
        <span className="ui-key is-wide">
          <Delete size={18} />
        </span>
      </div>
      <div className="ui-kbd-row">
        <span className="ui-key is-wide">?123</span>
        <span className="ui-key is-wide">,</span>
        <span className="ui-key is-wide is-space" data-key=" " style={{ width: 150 }} />
        <span className="ui-key is-wide">.</span>
        <span className="ui-key is-wide" style={{ background: "var(--ui-gold)", color: "var(--ui-navy-950)" }}>
          <Search size={18} />
        </span>
      </div>
    </div>
  );
}

/**
 * Search screen with one results group per demo query; GSAP switches groups and
 * types into the field. The first group is shown statically.
 */
export function SearchScreen({
  demos,
  keyboard = false,
  typed = true,
  className,
}: {
  demos: readonly SearchDemo[];
  keyboard?: boolean;
  typed?: boolean;
  className?: string;
}) {
  return (
    <Screen id="search" className={className}>
      <div className="ui">
        <StatusBar />
        <SearchField text={typed ? demos[0].query : ""} placeholder={SEARCH_HINT} />
        <div className="ui-chips">
          <span className="ui-chip is-selected">All</span>
          <span className="ui-chip">
            <FileText size={16} />
            Articles &amp; sections
          </span>
          <span className="ui-chip">
            <Table2 size={16} />
            Tables
          </span>
        </div>
        <div className="ui-body">
          {demos.map((d, i) => (
            <div key={d.query} className="js-results" data-index={i} style={{ position: "absolute", inset: 0, visibility: i === 0 && typed ? "visible" : "hidden" }}>
              {d.goTo.length > 0 && (
                <>
                  <div className="ui-section-title js-result">Go to</div>
                  {d.goTo.map((h) => (
                    <ResultTile key={h.label} hit={h} terms={d.terms} emphasize className="js-result" />
                  ))}
                </>
              )}
              <div className="ui-section-title js-result">Top matches</div>
              {d.matches.map((h) => (
                <ResultTile key={h.label} hit={h} terms={d.terms} className="js-result" />
              ))}
            </div>
          ))}
        </div>
        {keyboard ? <Keyboard /> : <NavBar active="Search" />}
      </div>
    </Screen>
  );
}

function Block({ block, focus }: { block: ArticleBlock; focus?: string }) {
  switch (block.type) {
    case "head":
      return (
        <div>
          <span className="ui-art-chip">ARTICLE {block.number}</span>
          <div className="ui-art-title">{block.title}</div>
          <div className="ui-divider" />
        </div>
      );
    case "part":
      return <div className="ui-part">{block.text}</div>;
    case "section":
      return (
        <p className={cn("ui-sec", focus === block.id && "is-focus js-focus")} data-sec={block.id}>
          <b>{block.heading}</b> {block.body}
        </p>
      );
    case "item":
      return (
        <p className="ui-item">
          {block.marker}&nbsp;&nbsp;{block.text}
        </p>
      );
    case "fpn":
      return <div className="ui-fpn">FPN: {block.text}</div>;
    case "exception":
      return <p className="ui-exception">{block.text}</p>;
  }
}

export function ArticleScreen({ article, focus, className }: { article: ArticleDemo; focus?: string; className?: string }) {
  return (
    <Screen id="article" className={className}>
      <div className="ui">
        <StatusBar />
        <div className="ui-appbar">
          <span className="ui-icon-btn is-on">
            <ArrowLeft size={22} />
          </span>
          <div className="ui-appbar-title">
            <div className="ui-t-md ui-ellipsis">{article.reference}</div>
            <div className="ui-l-sm ui-ellipsis">{article.context}</div>
          </div>
          <span className="ui-icon-btn">
            <ListTree size={21} />
          </span>
          <span className="ui-icon-btn">
            <BookmarkPlus size={21} />
          </span>
          <span className="ui-icon-btn">
            <FileText size={21} />
          </span>
        </div>
        <div className="ui-progress">
          <i className="js-progress" style={{ transform: `scaleX(${article.progress})` }} />
        </div>
        <div className="ui-body">
          <div className="js-reader">
            <div className="ui-demo-banner" style={{ marginTop: 10 }}>
              <Info size={12} />
              Sample text · headings from PEC 2017
            </div>
            <div className="ui-reader">
              {article.blocks.map((b, i) => (
                <Block key={i} block={b} focus={focus} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "relative", height: 24, flex: "none" }}>
          <span className="ui-gesture" />
        </div>
      </div>
    </Screen>
  );
}

function TableHeader({ label }: { label?: string }) {
  return (
    <div className="ui-appbar">
      <span className="ui-icon-btn is-on">
        <ArrowLeft size={22} />
      </span>
      <div className="ui-appbar-title">
        <div className="ui-t-md ui-ellipsis">{label ?? demoTable.title}</div>
        <div className="ui-l-sm ui-ellipsis">{demoTable.subtitle}</div>
      </div>
      <span className="ui-icon-btn">
        <BookmarkPlus size={21} />
      </span>
      <span className="ui-icon-btn">
        <FileText size={21} />
      </span>
    </div>
  );
}

export function TableScreen({ className, highlightRow = 5 }: { className?: string; highlightRow?: number }) {
  const cols = "74px repeat(3, 1fr)";
  return (
    <Screen id="table" className={className}>
      <div className="ui">
        <StatusBar />
        <TableHeader />
        <div className="ui-tabs">
          <span className="ui-tab is-active">Table</span>
          <span className="ui-tab">Original</span>
        </div>
        <div className="ui-body" style={{ padding: "12px 12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="ui-badge">{demoTable.badge}</span>
            <span className="ui-l-sm">Not PEC values</span>
          </div>
          <div className="ui-table js-table">
            <div className="ui-table-row ui-table-head" style={{ gridTemplateColumns: cols }}>
              <span className="ui-table-cell">mm²</span>
              {demoTable.columns.map((c) => (
                <span key={c} className="ui-table-cell js-col">
                  {c}
                </span>
              ))}
            </div>
            {demoTable.rows.map((r, i) => (
              <div key={r.size} className={cn("ui-table-row js-row", i === highlightRow && "is-hl")} style={{ gridTemplateColumns: cols }}>
                <span className="ui-table-cell">{r.size}</span>
                {r.cu.map((v, j) => (
                  <span key={j} className="ui-table-cell">
                    {v}
                  </span>
                ))}
              </div>
            ))}
            <div className="ui-table-watermark">SAMPLE</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** The same table laid out for a landscape phone (780 x 360); rotate the parent by 90deg. */
export function TableLandscape({ className, highlightRow = 5 }: { className?: string; highlightRow?: number }) {
  const cols = "84px repeat(6, 1fr)";
  return (
    <div className={className} data-screen="table-landscape">
      <div className="ui" style={{ width: 780, height: 360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 40px 8px 44px", flex: "none" }}>
          <ArrowLeft size={20} />
          <div className="ui-t-md">{demoTable.title}</div>
          <span className="ui-l-sm">{demoTable.subtitle}</span>
          <span style={{ flex: 1 }} />
          <span className="ui-badge">{demoTable.badge}</span>
        </div>
        <div className="ui-body" style={{ padding: "0 40px 0 44px" }}>
          <div className="ui-table js-table">
            <div className="ui-table-row ui-table-group" style={{ gridTemplateColumns: "84px 1fr 1fr" }}>
              <span className="ui-table-cell" />
              {demoTable.wideGroups.map((g) => (
                <span key={g} className="ui-table-cell" style={{ textAlign: "center", borderLeft: "1px solid var(--ui-outline-var)" }}>
                  {g}
                </span>
              ))}
            </div>
            <div className="ui-table-row ui-table-head" style={{ gridTemplateColumns: cols }}>
              <span className="ui-table-cell">mm²</span>
              {[...demoTable.columns, ...demoTable.columns].map((c, i) => (
                <span key={i} className="ui-table-cell">
                  {c}
                </span>
              ))}
            </div>
            {demoTable.rows.slice(0, 9).map((r, i) => (
              <div key={r.size} className={cn("ui-table-row js-row", i === highlightRow && "is-hl")} style={{ gridTemplateColumns: cols }}>
                <span className="ui-table-cell">{r.size}</span>
                {[...r.cu, ...r.al].map((v, j) => (
                  <span key={j} className="ui-table-cell">
                    {v}
                  </span>
                ))}
              </div>
            ))}
            <div className="ui-table-watermark">SAMPLE DATA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LibraryScreen({ className }: { className?: string }) {
  return (
    <Screen id="reference" className={className}>
      <div className="ui">
        <StatusBar />
        <div className="ui-appbar" style={{ padding: "0 8px 0 16px" }}>
          <div className="ui-appbar-title ui-t-lg">Library</div>
          <span className="ui-icon-btn">
            <Search size={22} />
          </span>
        </div>
        <div className="ui-chips">
          <span className="ui-chip is-selected">Contents</span>
          <span className="ui-chip">Tables</span>
          <span className="ui-chip">Figures</span>
        </div>
        <div className="ui-body">
          <div className="ui-l-sm" style={{ padding: "10px 16px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {site.edition}
          </div>
          {library.chapters.map((ch) => {
            const open = ch.number === library.expanded;
            return (
              <Fragment key={ch.number}>
                <div className="ui-lib-row js-lib-row">
                  <span className="ui-lib-num">{ch.number}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ui-t-sm ui-ellipsis">{ch.title}</div>
                    <div className="ui-b-sm">
                      {ch.articles ? `${ch.articles} articles` : "Tables"} · p. {ch.page}
                    </div>
                  </div>
                  {open ? <ChevronDown size={20} color="var(--ui-on-var)" /> : <ChevronRight size={20} color="var(--ui-on-var)" />}
                </div>
                {open &&
                  library.articles.map((a) => (
                    <div key={a.number} className="ui-lib-sub js-lib-sub">
                      <b>{a.number}</b>
                      <span className="ui-ellipsis">{a.title}</span>
                    </div>
                  ))}
              </Fragment>
            );
          })}
        </div>
        <NavBar active="Library" />
      </div>
    </Screen>
  );
}

export function SavedScreen({ className }: { className?: string }) {
  return (
    <Screen id="bookmarks" className={className}>
      <div className="ui">
        <StatusBar />
        <div className="ui-appbar" style={{ padding: "0 8px 0 16px" }}>
          <div className="ui-appbar-title ui-t-lg">Saved</div>
          <span className="ui-icon-btn">
            <Clock size={21} />
          </span>
        </div>
        <div className="ui-chips">
          <span className="ui-chip is-selected">All</span>
          <span className="ui-chip">Sections</span>
          <span className="ui-chip">Tables</span>
          <span className="ui-chip">Figures</span>
        </div>
        <div className="ui-body">
          <div className="ui-section-title">
            Bookmarks <small>{saved.bookmarks.length}</small>
          </div>
          {saved.bookmarks.map((b) => {
            const Icon = kindIcon[b.kind];
            return (
              <div key={b.label} className="ui-result js-bookmark">
                <span className="ui-result-icon is-emph">
                  <Icon size={19} />
                </span>
                <div className="ui-result-main">
                  <div className="ui-result-title">{b.label}</div>
                  <div className="ui-crumbs">{b.crumbs}</div>
                </div>
                <PageChip page={b.page} />
              </div>
            );
          })}
        </div>
        <NavBar active="Saved" />
      </div>
    </Screen>
  );
}
