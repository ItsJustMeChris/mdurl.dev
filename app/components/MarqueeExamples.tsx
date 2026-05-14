const EXAMPLES = [
  "mdurl https://example.com",
  "mdurl https://news.ycombinator.com --max-bytes 4000",
  "mdurl search 'weather mke' --engine duckduckgo",
  "mdurl https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal) --full --section Table --no-resources",
  "mdurl https://en.wikipedia.org/wiki/Markdown --no-resources",
  "mdurl https://docs.python.org --section Tutorial",
  "mdurl https://example.com --json | jq '.title'",
  "mdurl https://example.com/recipe --json | jq '.structured_data'",
  "mdurl https://app.example.com --js --wait-selector '#root'",
  "mdurl https://example.com --selector article",
  "mdurl install-browser",
];

export default function MarqueeExamples() {
  const doubled = [...EXAMPLES, ...EXAMPLES];
  return (
    <div className="marquee relative overflow-hidden py-2">
      <div className="marquee-track flex gap-3 whitespace-nowrap w-max">
        {doubled.map((e, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-od-panel-2/40 px-3 py-1.5 font-mono text-[12px] text-od-fg/80"
          >
            <span className="text-od-green">$</span>
            <span>{e}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
