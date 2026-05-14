import data from "@/data/snapshots.json";

const snaps = data as Record<string, string>;

export type Snapshot = {
  command: string;
  output: string;
  durationMs: number;
};

type FetchEntry = {
  url: string;
  file: keyof typeof snaps;
  command: string;
  durationMs: number;
};

type SearchEntry = {
  query: string;
  engine: "google" | "bing" | "duckduckgo";
  file: keyof typeof snaps;
  durationMs: number;
};

const FETCH_LIST: FetchEntry[] = [
  {
    url: "https://example.com",
    file: "example",
    command: "mdurl https://example.com",
    durationMs: 142,
  },
  {
    url: "https://en.wikipedia.org/wiki/Markdown",
    file: "wiki-markdown",
    command:
      "mdurl https://en.wikipedia.org/wiki/Markdown --max-bytes 5000",
    durationMs: 203,
  },
  {
    url: "https://news.ycombinator.com",
    file: "hn",
    command: "mdurl https://news.ycombinator.com --max-bytes 4000",
    durationMs: 416,
  },
  {
    url: "https://www.rust-lang.org",
    file: "rust",
    command: "mdurl https://www.rust-lang.org --max-bytes 4000",
    durationMs: 164,
  },
  {
    url: "https://nextjs.org",
    file: "nextjs",
    command: "mdurl https://nextjs.org --max-bytes 4000",
    durationMs: 1034,
  },
];

const SEARCH_LIST: SearchEntry[] = [
  {
    query: "milwaukee espresso",
    engine: "duckduckgo",
    file: "search-coffee",
    durationMs: 808,
  },
  {
    query: "next.js 16 release notes",
    engine: "duckduckgo",
    file: "search-next",
    durationMs: 851,
  },
  {
    query: "weather mke",
    engine: "duckduckgo",
    file: "search-weather",
    durationMs: 926,
  },
];

function normalizeUrl(input: string): string | null {
  try {
    const u = new URL(input);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    const host = u.hostname.toLowerCase();
    let path = u.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return `${u.protocol}//${host}${path}${u.search}`;
  } catch {
    return null;
  }
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

const FETCH_BY_KEY = new Map<string, FetchEntry>();
for (const entry of FETCH_LIST) {
  const key = normalizeUrl(entry.url);
  if (key) FETCH_BY_KEY.set(key, entry);
}

const SEARCH_BY_KEY = new Map<string, SearchEntry>();
for (const entry of SEARCH_LIST) {
  SEARCH_BY_KEY.set(normalizeQuery(entry.query), entry);
}

export function findFetch(input: string): Snapshot | null {
  const key = normalizeUrl(input);
  if (!key) return null;
  const entry = FETCH_BY_KEY.get(key);
  if (!entry) return null;
  return {
    command: entry.command,
    output: snaps[entry.file] ?? "",
    durationMs: entry.durationMs,
  };
}

export function findSearch(query: string): Snapshot | null {
  const entry = SEARCH_BY_KEY.get(normalizeQuery(query));
  if (!entry) return null;
  return {
    command: `mdurl search "${entry.query}" --engine ${entry.engine}`,
    output: snaps[entry.file] ?? "",
    durationMs: entry.durationMs,
  };
}

export const FETCH_URLS = FETCH_LIST.map((e) => e.url);
export const SEARCH_QUERIES = SEARCH_LIST.map((e) => e.query);
