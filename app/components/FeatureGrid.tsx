const FEATURES = [
  {
    title: "Predictable frontmatter",
    body: "YAML metadata up top with status, render mode, byte/word counts, canonical URL, and content kind. Same shape on success and failure.",
    badge: "01",
    accent: "blue",
  },
  {
    title: "Search, not scrape",
    body: "`mdurl search` returns a normalized organic-result list with snippets and source URLs across Google, Bing, and DuckDuckGo.",
    badge: "02",
    accent: "magenta",
  },
  {
    title: "Headless when needed",
    body: "Plain HTTP first; auto-fallback to Chromium for SPAs. `--js` to force it, `--no-js` to disable, `--wait-selector` to gate.",
    badge: "03",
    accent: "green",
  },
  {
    title: "PDFs, feeds, JSON",
    body: "PDFs, RSS/Atom, sitemaps, JSON, plain text — handled before the HTML pipeline so agents never receive mangled binary as article text.",
    badge: "04",
    accent: "yellow",
  },
  {
    title: "Structured data section",
    body: "Recipes, products, events, FAQs — JSON-LD is parsed and appended as compact markdown so noisy pages still surface the facts.",
    badge: "05",
    accent: "cyan",
  },
  {
    title: "Designed for agents",
    body: "`--json` envelope, `--section` extraction, `--max-bytes` truncation, `--selector` subtree, and stable exit codes for piping.",
    badge: "06",
    accent: "orange",
  },
] as const;

const ACCENT: Record<string, string> = {
  blue: "text-od-blue",
  magenta: "text-od-magenta",
  green: "text-od-green",
  yellow: "text-od-yellow",
  cyan: "text-od-cyan",
  orange: "text-od-orange",
};

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/10">
      {FEATURES.map((f) => (
        <div
          key={f.badge}
          className="group relative bg-od-bg p-7 transition hover:bg-od-panel"
        >
          <div className="flex items-baseline justify-between mb-5">
            <span
              className={`font-mono text-xs tracking-[0.25em] ${
                ACCENT[f.accent]
              }`}
            >
              {f.badge}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-od-mute">
              feature
            </span>
          </div>
          <h3 className="text-lg font-semibold text-od-fg-bright mb-2 tracking-tight">
            {f.title}
          </h3>
          <p className="text-sm leading-relaxed text-od-fg/80">
            {f.body.split("`").map((part, i) =>
              i % 2 === 1 ? (
                <code
                  key={i}
                  className="font-mono text-od-fg-bright bg-white/5 rounded px-1 py-0.5 text-[12px]"
                >
                  {part}
                </code>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-px ${
              ACCENT[f.accent]
            } opacity-0 group-hover:opacity-70 transition`}
            style={{
              background:
                "linear-gradient(90deg, transparent, currentColor, transparent)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
