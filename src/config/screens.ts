/**
 * Content shown on the phone mockups.
 *
 * Article, part, section and table headings, chapter titles and printed page
 * numbers are taken from the Pocket PEC content database (PEC 2017 Part 1,
 * content version 78aa74115e646fc4). They are references, not requirements.
 *
 * Body text and table values are DEMONSTRATION CONTENT: they describe the app
 * or are sample numbers, are labelled as such on screen, and are never PEC text.
 *
 * To use real app screenshots instead of a live mockup, put the image in
 * /public/screens and reference it in `screenshots` below (e.g. 360 x 780 or
 * any 9:19.5 image). Animated demos then show the still screenshot.
 */

export type ScreenId = "home" | "search" | "article" | "table" | "reference" | "bookmarks" | "splash";

export const screenshots: Partial<Record<ScreenId, string>> = {
  // home: "/screens/home.webp",
};

export type HitKind = "article" | "part" | "section" | "table";

export type Hit = {
  kind: HitKind;
  /** Reference and title, as the app lists them */
  label: string;
  crumbs: string;
  /** Printed page number */
  page: string;
};

export type SearchDemo = {
  query: string;
  /** Words highlighted in results (prefix match, like the app) */
  terms: string[];
  goTo: Hit[];
  matches: Hit[];
};

const T = {
  ampacity16: "Table 3.10.2.6(B)(16) Allowable Ampacities of Insulated Conductors Rated Up to and Including 2000 Volts, 60°C Through 90°C",
  correction30: "Table 3.10.2.6(B)(2)(a) Ambient Temperature Correction Factors Based on 30°C",
  adjustment: "Table 3.10.2.6(B)(3)(a) Adjustment Factors for More Than Three Current-Carrying Conductors",
  gec: "Table 2.50.3.17 Grounding Electrode Conductor for Alternating-Current Systems",
  egc: "Table 2.50.6.13 Minimum Size Equipment Grounding Conductors for Grounding Raceway and Equipment",
  motor3: "Table 4.30.14.4 Full-Load Current, Three-Phase Alternating-Current Motors",
  motor1: "Table 4.30.14.2 Full-Load Currents in Amperes, Single-Phase Alternating-Current Motors",
};

export const searches = {
  /** Hero floating panel */
  groundingElectrode: {
    query: "grounding electrode",
    terms: ["grounding", "electrode"],
    goTo: [],
    matches: [
      { kind: "part", label: "2.50.3 Grounding Electrode System and Grounding Electrode Conductor", crumbs: "Chapter 2 › Article 2.50", page: "108" },
      { kind: "section", label: "2.50.3.1 Grounding Electrode System", crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "108" },
      { kind: "table", label: T.gec, crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "113" },
      { kind: "section", label: "2.50.3.3 Grounding Electrodes", crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "109" },
      { kind: "section", label: "2.50.3.13 Grounding Electrode Conductor Material", crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "111" },
    ],
  },
  conductorAmpacity: {
    query: "conductor ampacity",
    terms: ["conductor", "ampacit"],
    goTo: [],
    matches: [
      { kind: "section", label: "3.10.2.6 Ampacities for Conductors Rated 0 – 2000 Volts", crumbs: "Chapter 3 › Article 3.10", page: "168" },
      { kind: "table", label: T.ampacity16, crumbs: "Chapter 3 › Article 3.10", page: "174" },
      { kind: "section", label: "2.10.2.2 Conductors — Minimum Ampacity and Size", crumbs: "Chapter 2 › Article 2.10", page: "42" },
      { kind: "table", label: T.correction30, crumbs: "Chapter 3 › Article 3.10", page: "170" },
      { kind: "table", label: T.adjustment, crumbs: "Chapter 3 › Article 3.10", page: "172" },
    ],
  },
  article310: {
    query: "Article 3.10",
    terms: ["3.10"],
    goTo: [{ kind: "article", label: "Article 3.10 Conductors for General Wiring", crumbs: "Chapter 3", page: "166" }],
    matches: [
      { kind: "part", label: "3.10.1 General", crumbs: "Chapter 3 › Article 3.10", page: "166" },
      { kind: "section", label: "3.10.1.1 Scope", crumbs: "Chapter 3 › Article 3.10 › Part 3.10.1", page: "166" },
      { kind: "section", label: "3.10.2.6 Ampacities for Conductors Rated 0 – 2000 Volts", crumbs: "Chapter 3 › Article 3.10", page: "168" },
    ],
  },
  /** The ampacity table's actual number in PEC 2017 (there is no "Table 3.10.1.16"). */
  table310: {
    query: "Table 3.10.2.6(B)(16)",
    terms: ["3.10.2.6(B)(16)"],
    goTo: [{ kind: "table", label: T.ampacity16, crumbs: "Chapter 3 › Article 3.10", page: "174" }],
    matches: [
      { kind: "section", label: "3.10.2.6 Ampacities for Conductors Rated 0 – 2000 Volts", crumbs: "Chapter 3 › Article 3.10", page: "168" },
      { kind: "table", label: T.correction30, crumbs: "Chapter 3 › Article 3.10", page: "170" },
    ],
  },
  grounding: {
    query: "grounding",
    terms: ["grounding"],
    goTo: [],
    matches: [
      { kind: "article", label: "Article 2.50 Grounding and Bonding", crumbs: "Chapter 2", page: "96" },
      { kind: "part", label: "2.50.3 Grounding Electrode System and Grounding Electrode Conductor", crumbs: "Chapter 2 › Article 2.50", page: "108" },
      { kind: "table", label: T.egc, crumbs: "Chapter 2 › Article 2.50 › Part 2.50.6", page: "124" },
      { kind: "table", label: T.gec, crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "113" },
    ],
  },
  motor: {
    query: "motor",
    terms: ["motor"],
    goTo: [],
    matches: [
      { kind: "article", label: "Article 4.30 Motors, Motor Circuits, and Controllers", crumbs: "Chapter 4", page: "341" },
      { kind: "table", label: T.motor3, crumbs: "Chapter 4 › Article 4.30 › Part 4.30.14", page: "372" },
      { kind: "table", label: T.motor1, crumbs: "Chapter 4 › Article 4.30 › Part 4.30.14", page: "370" },
      { kind: "section", label: "4.30.1.6 Ampacity and Motor Rating Determination", crumbs: "Chapter 4 › Article 4.30 › Part 4.30.1", page: "342" },
    ],
  },
  ampacity: {
    query: "ampacity",
    terms: ["ampacit"],
    goTo: [],
    matches: [
      { kind: "section", label: "3.10.2.6 Ampacities for Conductors Rated 0 – 2000 Volts", crumbs: "Chapter 3 › Article 3.10", page: "168" },
      { kind: "table", label: T.ampacity16, crumbs: "Chapter 3 › Article 3.10", page: "174" },
      { kind: "section", label: "2.10.2.2 Conductors — Minimum Ampacity and Size", crumbs: "Chapter 2 › Article 2.10", page: "42" },
      { kind: "section", label: "4.30.1.6 Ampacity and Motor Rating Determination", crumbs: "Chapter 4 › Article 4.30 › Part 4.30.1", page: "342" },
    ],
  },
} satisfies Record<string, SearchDemo>;

/** Home screen */
export const home = {
  title: "Pocket PEC",
  subtitle: "Philippine Electrical Code 2017 · Part 1",
  prompt: "What do you need to look up?",
  searchHint: "Search PEC Articles, Tables & Terms",
  shortcuts: [
    { icon: "articles", title: "Articles", subtitle: "Chapters, articles, sections" },
    { icon: "tables", title: "Tables", subtitle: "Ampacity, motors, conduit" },
    { icon: "definitions", title: "Definitions", subtitle: "Article 1.1" },
    { icon: "bookmarks", title: "Bookmarks", subtitle: "Your saved references" },
  ],
  commonTables: [
    { label: "Ampacity of conductors", number: "3.10.2.6(B)(16)" },
    { label: "Motor full-load current (3-phase)", number: "4.30.14.4" },
    { label: "Grounding electrode conductor", number: "2.50.3.17" },
    { label: "Equipment grounding conductor", number: "2.50.6.13" },
    { label: "Conductor properties", number: "10.1.1.8" },
  ],
  recent: [
    { kind: "article" as HitKind, label: "Article 2.50 Grounding and Bonding", crumbs: "Chapter 2" },
    { kind: "table" as HitKind, label: T.motor3, crumbs: "Chapter 4 › Article 4.30" },
  ],
};

export type ArticleBlock =
  | { type: "head"; number: string; title: string }
  | { type: "part"; text: string }
  | { type: "section"; id: string; heading: string; body: string }
  | { type: "item"; marker: string; text: string }
  | { type: "fpn"; text: string }
  | { type: "exception"; text: string };

export type ArticleDemo = {
  reference: string;
  context: string;
  progress: number;
  blocks: ArticleBlock[];
};

// Sample sentences describe the reader itself, so they can never be mistaken
// for requirements of the Code.
const S = {
  reflow: "Sample text. The reader reflows each section for your screen and keeps its numbering, lists, and exceptions in order.",
  links: "Sample text. Cross-references open the linked section, and every passage links back to its source page.",
  lists: "Sample text. Numbered items stay aligned under their section heading.",
  exception: "Sample text. Where a passage cannot be reflowed cleanly, the original page opens instead.",
  note: "Sample note. Notes and exceptions keep their own styling so they stand apart from the main text.",
  focus: "Sample text. Opening a search result brings you straight to the matching section, highlighted.",
};

export const articles = {
  /** Article 2.50 from the top */
  groundingTop: {
    reference: "Article 2.50",
    context: "Grounding and Bonding",
    progress: 0.04,
    blocks: [
      { type: "head", number: "2.50", title: "GROUNDING AND BONDING" },
      { type: "part", text: "2.50.1 General" },
      { type: "section", id: "2.50.1.1", heading: "2.50.1.1 Scope.", body: S.reflow },
      { type: "item", marker: "(1)", text: "Sample item. Headings stay attached to their numbers." },
      { type: "item", marker: "(2)", text: "Sample item. References such as 2.50.3.1 open in one tap." },
      { type: "section", id: "2.50.1.2", heading: "2.50.1.2 Definition.", body: S.lists },
      { type: "fpn", text: S.note },
      { type: "section", id: "2.50.1.3", heading: "2.50.1.3 Application of Other Articles.", body: S.links },
      { type: "section", id: "2.50.1.4", heading: "2.50.1.4 General Requirements for Grounding and Bonding.", body: S.reflow },
      { type: "exception", text: `Exception: ${S.exception.replace("Sample text. ", "")} (Sample text.)` },
      { type: "section", id: "2.50.1.6", heading: "2.50.1.6 Objectionable Current.", body: S.lists },
      { type: "section", id: "2.50.1.8", heading: "2.50.1.8 Connection of Grounding and Bonding Equipment.", body: S.links },
    ],
  },
  /** Article 2.50 opened from a search result, focused on 2.50.3.1 */
  groundingFocus: {
    reference: "Article 2.50",
    context: "2.50.3 Grounding Electrode System and Grounding Electrode Conductor",
    progress: 0.34,
    blocks: [
      { type: "part", text: "2.50.3 Grounding Electrode System and Grounding Electrode Conductor" },
      { type: "section", id: "2.50.3.1", heading: "2.50.3.1 Grounding Electrode System.", body: S.focus },
      { type: "section", id: "2.50.3.3", heading: "2.50.3.3 Grounding Electrodes.", body: S.reflow },
      { type: "item", marker: "(A)", text: "Sample item. Lettered items keep their hanging indent." },
      { type: "item", marker: "(B)", text: "Sample item. Long items wrap cleanly on small screens." },
      { type: "section", id: "2.50.3.4", heading: "2.50.3.4 Grounding Electrode System Installation.", body: S.links },
      { type: "fpn", text: S.note },
      { type: "section", id: "2.50.3.5", heading: "2.50.3.5 Auxiliary Grounding Electrodes.", body: S.lists },
    ],
  },
  /** Article 3.10 (search demo "Article 3.10") */
  conductors: {
    reference: "Article 3.10",
    context: "Conductors for General Wiring",
    progress: 0.02,
    blocks: [
      { type: "head", number: "3.10", title: "CONDUCTORS FOR GENERAL WIRING" },
      { type: "part", text: "3.10.1 General" },
      { type: "section", id: "3.10.1.1", heading: "3.10.1.1 Scope.", body: S.reflow },
      { type: "section", id: "3.10.1.2", heading: "3.10.1.2 Definitions.", body: S.lists },
      { type: "section", id: "3.10.2.6", heading: "3.10.2.6 Ampacities for Conductors Rated 0 – 2000 Volts.", body: S.links },
      { type: "fpn", text: S.note },
    ],
  },
} satisfies Record<string, ArticleDemo>;

/**
 * Sample table. Conductor sizes are standard metric sizes; the values are
 * generated demonstration numbers and do NOT come from any PEC table.
 */
const SIZES = ["2.0", "3.5", "5.5", "8.0", "14", "22", "30", "38", "50", "60", "80", "100", "125", "150", "200"];
const demoValue = (size: number, factor: number) => Math.round(11.5 * Math.pow(size, 0.64) * factor);

export const demoTable = {
  title: "Sample table",
  subtitle: "Demonstration layout · sample values",
  badge: "Demo data",
  columns: ["60°C", "75°C", "90°C"],
  wideGroups: ["Copper · demo", "Aluminum · demo"],
  rows: SIZES.map((s) => {
    const n = parseFloat(s);
    return {
      size: s,
      cu: [demoValue(n, 1), demoValue(n, 1.18), demoValue(n, 1.33)],
      al: [demoValue(n, 0.78), demoValue(n, 0.92), demoValue(n, 1.04)],
    };
  }),
};

/** Library (reference browser): chapter titles, article counts and pages from PEC 2017 Part 1. */
export const library = {
  chapters: [
    { number: "1", title: "General", articles: 5, page: "1" },
    { number: "2", title: "Wiring and Protection", articles: 11, page: "35" },
    { number: "3", title: "Wiring Methods and Materials", articles: 46, page: "153" },
    { number: "4", title: "Equipment for General Use", articles: 21, page: "279" },
    { number: "5", title: "Special Occupancies", articles: 28, page: "405" },
    { number: "6", title: "Special Equipment", articles: 27, page: "582" },
    { number: "7", title: "Special Conditions", articles: 15, page: "698" },
    { number: "8", title: "Communications Systems", articles: 5, page: "768" },
    { number: "9", title: "Watercrafts", articles: 35, page: "818" },
    { number: "10", title: "Tables", articles: 0, page: "934" },
  ],
  expanded: "2",
  articles: [
    { number: "2.0", title: "Use and Identification of Grounded Conductors" },
    { number: "2.10", title: "Branch Circuits" },
    { number: "2.15", title: "Feeders" },
    { number: "2.20", title: "Branch-Circuit, Feeder, and Service Load Calculations" },
    { number: "2.25", title: "Outside Branch Circuits and Feeders" },
    { number: "2.30", title: "Services" },
    { number: "2.40", title: "Overcurrent Protection" },
    { number: "2.50", title: "Grounding and Bonding" },
  ],
};

/** Saved screen */
export const saved = {
  bookmarks: [
    { kind: "article" as HitKind, label: "Article 2.50 Grounding and Bonding", crumbs: "Chapter 2", page: "96" },
    { kind: "table" as HitKind, label: T.ampacity16, crumbs: "Chapter 3 › Article 3.10", page: "174" },
    { kind: "section" as HitKind, label: "2.50.3.1 Grounding Electrode System", crumbs: "Chapter 2 › Article 2.50 › Part 2.50.3", page: "108" },
    { kind: "table" as HitKind, label: T.motor3, crumbs: "Chapter 4 › Article 4.30 › Part 4.30.14", page: "372" },
    { kind: "section" as HitKind, label: "2.10.2.2 Conductors — Minimum Ampacity and Size", crumbs: "Chapter 2 › Article 2.10", page: "42" },
    { kind: "article" as HitKind, label: "Article 1.1 Definitions", crumbs: "Chapter 1", page: "3" },
  ],
};
