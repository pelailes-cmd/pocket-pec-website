/**
 * Marketing copy for every section, in page order. Edit freely.
 *
 * Content rules this copy follows: Pocket PEC is presented as a reference
 * companion app, never as the Code itself or as an official/endorsed product,
 * and no speed, accuracy or availability claims are made that are not backed
 * by measurements or releases.
 */
export const copy = {
  hero: {
    eyebrow: "Philippine Electrical Code · Mobile Reference",
    words: ["POCKET", "PEC"],
    headline: ["The Philippine Electrical Code.", "In your pocket."],
    sub: "Fast access to articles, tables, and references for Electrical Practitioners in the Philippines.",
    primary: "Download Pocket PEC",
    secondary: "See How It Works",
    audience: "Built for Electrical Practitioners • Philippines",
    /** Floating search panel demo */
    panelQuery: "grounding electrode",
    /** Copy revealed when the phone settles */
    endEyebrow: "From search to section",
    endHeadline: ["Find the article.", "Find the table.", "Get to the reference faster."],
    endBody: "A faster way to access the Philippine Electrical Code wherever electrical work takes you.",
  },

  problem: {
    eyebrow: "The problem",
    headline: ["The code is essential.", "Finding what you need shouldn't be difficult."],
    resolution: ["Pocket PEC brings the reference closer", "to the way electrical practitioners work today."],
    ticker: ["Index", "Chapter", "Article", "Part", "Section", "Table", "Note"],
  },

  search: {
    eyebrow: "How it works",
    headline: "Find what you're looking for. Faster.",
    body: "Search through articles, tables, terms, and references from one simple interface.",
    placeholder: "Search the Philippine Electrical Code...",
  },

  showcase: {
    eyebrow: "The app",
    headline: ["One reference.", "Every way in."],
    items: [
      { id: "home", title: "Home", body: "One search field, shortcuts, and the tables you reach for most." },
      { id: "search", title: "Search", body: "Keywords, section numbers, and table references in one field." },
      { id: "article", title: "Article", body: "Reflowed for the phone, with numbering and lists intact." },
      { id: "table", title: "Table", body: "Wide tables keep their headings in view as you scroll." },
      { id: "reference", title: "Reference", body: "Browse the Code by chapter, article, and part." },
      { id: "bookmarks", title: "Bookmarks", body: "Keep the sections you return to one tap away." },
    ],
  },

  articles: {
    label: "Article reference",
    headline: "Go straight to the article.",
    body: "Navigate electrical-code references through a cleaner mobile reading experience.",
    points: ["Numbered parts and sections", "Lists, exceptions, and notes kept in order", "Every passage linked to its page"],
  },

  tables: {
    label: "Table reference",
    headline: "Tables, without the page hunting.",
    body: "Reach commonly referenced technical tables through the Pocket PEC interface.",
    demoNote: "Table values shown on this page are sample data for demonstration only. They are not taken from the PEC.",
  },

  quick: {
    label: "Quick search",
    headline: "Search the way you think.",
    body: "Use keywords, article numbers, table references, and technical terms to get closer to what you need.",
    kinds: ["Keywords", "Article numbers", "Table references", "Technical terms"],
  },

  field: {
    label: "Built for the field",
    headline: ["Built for the way", "electrical practitioners work."],
    scenes: [
      { id: "office", line: "At the office.", caption: "Office" },
      { id: "site", line: "On site.", caption: "Site" },
      { id: "design", line: "In design.", caption: "Design" },
      { id: "inspection", line: "During inspection.", caption: "Inspection" },
    ],
    closing: "Wherever the reference is needed.",
  },

  moment: {
    labels: ["Articles", "Tables", "Search", "References", "Bookmarks"],
    line: ["The code.", "Closer than ever."],
  },

  why: {
    eyebrow: "Why Pocket PEC",
    items: [
      { word: "Fast", body: "Get to the reference without unnecessary navigation." },
      { word: "Simple", body: "A cleaner way to interact with electrical-code information." },
      { word: "Mobile", body: "Designed around the smartphone experience." },
      { word: "Practical", body: "Built with electrical practitioners in mind." },
    ],
  },

  philippines: {
    eyebrow: "Philippines",
    headline: "Made for Electrical Practitioners in the Philippines.",
    body: "A modern digital companion for those who work with electrical installations, design, inspection, maintenance, and engineering.",
    regions: ["Luzon", "Visayas", "Mindanao"],
    work: ["Installation", "Design", "Inspection", "Maintenance", "Engineering"],
  },

  download: {
    headline: "Your electrical code reference, wherever you work.",
    cta: "Download the app",
  },

  qr: {
    eyebrow: "Download",
    headline: ["Scan. Download.", "Carry the code with you."],
    body: "Scan the QR code with your phone to download Pocket PEC.",
    placeholder: "Download link coming soon",
    mobileHint: "On your phone already? Use the download buttons below.",
  },

  final: {
    headline: ["The Philippine Electrical Code.", "In your pocket."],
    primary: "Download Pocket PEC",
    secondary: "Learn More",
  },

  footer: {
    tagline: "The Philippine Electrical Code. In your pocket.",
    made: "Designed for Electrical Practitioners in the Philippines.",
    copyright: "© POCKET PEC",
  },
} as const;
