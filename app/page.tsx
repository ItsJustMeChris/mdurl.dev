import Terminal from "./components/Terminal";
import InstallBlock from "./components/InstallBlock";
import FeatureGrid from "./components/FeatureGrid";
import MarqueeExamples from "./components/MarqueeExamples";

const EXAMPLE_OUTPUT = `---
url: https://example.com/
title: Example Domain
fetched_at: 2026-05-10T00:00:00.000Z
status: 200
render_mode: http
elapsed_ms: 120
word_count: 21
content_type: text/html
content_kind: html
byte_count: 1256
description: A concise page summary from meta tags
site_name: Example
canonical_url: https://example.com/
---

# Example Domain

This domain is for use in illustrative examples in documents.`;

const SHIPPING_PIPELINE = [
  { label: "HTTP", desc: "Plain fetch with retry + redirect cookies" },
  { label: "Detect", desc: "Sniff content-kind: html, pdf, feed, json, xml" },
  { label: "Render", desc: "Readability, or Chromium fallback for SPAs" },
  { label: "Extract", desc: "Markdown body, resources, structured data" },
  { label: "Emit", desc: "Frontmatter + markdown, or JSON envelope" },
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="aurora -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-od-bg/0 to-od-bg" />

      {/* Nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <a href="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-od-panel ring-1 ring-white/10">
              <span className="font-mono text-[13px] font-bold text-od-blue">
                md
              </span>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-od-green ring-2 ring-od-bg animate-pulse" />
            </span>
            <span className="font-mono text-sm text-od-fg-bright tracking-tight">
              mdurl<span className="text-od-mute">.dev</span>
            </span>
          </a>
          <nav className="flex items-center gap-1 text-sm">
            <a
              href="#terminal"
              className="px-3 py-1.5 text-od-fg/70 hover:text-od-fg-bright transition"
            >
              try it
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 text-od-fg/70 hover:text-od-fg-bright transition"
            >
              features
            </a>
            <a
              href="https://www.npmjs.com/package/mdurl-cli"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-od-fg/70 hover:text-od-fg-bright transition"
            >
              npm
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-od-panel/60 px-3 py-1.5 text-od-fg-bright hover:border-white/20 transition"
            >
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                aria-hidden
                className="text-od-fg-bright"
              >
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.88-1.17-.88-1.17-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.86.86 2.31.66.07-.52.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.22 2.2.82a7.62 7.62 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.65 3.96.29.25.54.74.54 1.49v2.21c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
              github
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-16 md:pt-24 md:pb-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-od-panel/50 px-3 py-1 text-xs text-od-fg/80 backdrop-blur-sm fade-up">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-od-green animate-pulse" />
          <span className="font-mono">v0.1.0</span>
          <span className="text-od-mute">·</span>
          <span>A curl-shaped CLI built for coding agents</span>
        </div>

        <h1 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-od-fg-bright fade-up delay-1">
          Webpages to{" "}
          <span className="text-gradient">clean markdown.</span>
          <br />
          <span className="text-od-fg/85">Built for agents.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-od-fg/75 fade-up delay-2">
          <span className="font-mono text-od-fg-bright">mdurl</span> fetches a
          page or a web search and emits a YAML frontmatter block followed by
          markdown — predictable on success, predictable on failure. The
          default <em className="not-italic text-od-fg-bright">"read a page"</em>{" "}
          primitive for LLM tools.
        </p>

        <div className="mt-9 max-w-md fade-up delay-3">
          <InstallBlock />
        </div>

        <div className="mt-12 fade-up delay-4">
          <MarqueeExamples />
        </div>
      </section>

      {/* Terminal */}
      <section
        id="terminal"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-24"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-od-mute font-mono mb-2">
              ⇢ demo · cached output
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-od-fg-bright">
              Real mdurl output. Replayed in the browser.
            </h2>
            <p className="mt-2 max-w-2xl text-od-fg/75">
              The terminal replays real{" "}
              <code className="font-mono text-od-fg-bright">mdurl</code>{" "}
              snapshots captured ahead of time — no live fetch is made from
              this site. Type{" "}
              <code className="font-mono text-od-fg-bright">list</code> to see
              what's in the demo set, or install the CLI to use it for real.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-od-mute font-mono">
            <span className="rounded-md border border-white/8 bg-od-panel/50 px-2 py-1">
              no server fetch
            </span>
            <span className="rounded-md border border-white/8 bg-od-panel/50 px-2 py-1">
              bundled snapshots
            </span>
            <span className="rounded-md border border-white/8 bg-od-panel/50 px-2 py-1">
              client-only
            </span>
          </div>
        </div>
        <Terminal />
      </section>

      {/* Pipeline strip */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-white/8 bg-od-panel/40 backdrop-blur-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {SHIPPING_PIPELINE.map((step, i) => (
              <div
                key={step.label}
                className="relative p-6 md:p-7 border-b md:border-b-0 md:border-r border-white/5 last:border-r-0 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-od-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-white/8" />
                </div>
                <div className="font-mono text-sm text-od-fg-bright mb-1.5">
                  {step.label}
                </div>
                <div className="text-xs text-od-fg/70 leading-relaxed">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-24"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-od-mute font-mono mb-2">
              ⇢ features
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-od-fg-bright max-w-xl">
              Built to be the default "read a page" tool.
            </h2>
          </div>
          <p className="max-w-md text-sm text-od-fg/70">
            Predictable shape on success and failure. Stable exit codes. JSON
            envelope on demand. No surprises in the pipeline.
          </p>
        </div>
        <FeatureGrid />
      </section>

      {/* Sample output */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.25em] text-od-mute font-mono mb-2">
              ⇢ output
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-od-fg-bright">
              YAML up top.{" "}
              <span className="text-gradient">Markdown below.</span>
            </h2>
            <p className="mt-4 text-od-fg/75 leading-relaxed">
              Same shape, every time. Status, render mode, byte and word counts,
              canonical URL, content kind — everything an agent needs to decide
              what to do next sits in the frontmatter.
            </p>
            <p className="mt-3 text-od-fg/75 leading-relaxed">
              Failures keep the same envelope: an{" "}
              <code className="font-mono text-od-fg-bright">error</code> field,
              an{" "}
              <code className="font-mono text-od-fg-bright">access_status</code>{" "}
              when a paywall or bot-check is detected, and a stable exit code.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl border border-white/8 bg-od-panel/80 ring-soft overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-od-bg-soft/70 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-mono text-od-mute">
                  <span className="h-2 w-2 rounded-full bg-od-green" />
                  example.com.md
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-od-mute">
                  default output
                </div>
              </div>
              <pre className="px-5 py-4 font-mono text-[12.5px] leading-relaxed text-od-fg overflow-x-auto term-scroll">
                <SyntaxOutput text={EXAMPLE_OUTPUT} />
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-od-panel/60 to-od-bg-soft/30 p-10 md:p-14 backdrop-blur-sm">
          <div className="absolute inset-0 -z-10 opacity-50">
            <div className="aurora" />
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-od-fg-bright max-w-2xl">
                Install once. Pipe it into anything.
              </h2>
              <p className="mt-4 max-w-xl text-od-fg/75 leading-relaxed">
                Stable output means stable pipelines. Use{" "}
                <code className="font-mono text-od-fg-bright">--json</code> and{" "}
                <code className="font-mono text-od-fg-bright">jq</code> for
                structured access, or pipe straight markdown into your agent.
              </p>
            </div>
            <div className="w-full md:max-w-md">
              <InstallBlock />
              <p className="mt-3 text-xs text-od-mute font-mono">
                requires node ≥ 20 · Chromium optional for{" "}
                <span className="text-od-fg-bright">--js</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2 text-od-mute font-mono">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-od-green" />
            mdurl.dev · onedark · {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-5 text-od-fg/70">
            <a
              href="https://www.npmjs.com/package/mdurl-cli"
              target="_blank"
              rel="noreferrer"
              className="hover:text-od-fg-bright transition"
            >
              npm
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-od-fg-bright transition"
            >
              github
            </a>
            <a
              href="#terminal"
              className="hover:text-od-fg-bright transition"
            >
              try it
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SyntaxOutput({ text }: { text: string }) {
  // Light highlighting: YAML keys, values, headings, comments.
  const lines = text.split("\n");
  let inFront = false;
  return (
    <>
      {lines.map((line, i) => {
        if (line === "---") {
          inFront = !inFront;
          return (
            <div key={i} className="text-od-mute">
              {line}
            </div>
          );
        }
        if (inFront) {
          const m = line.match(/^([a-z_][\w-]*): (.*)$/);
          if (m) {
            return (
              <div key={i}>
                <span className="text-od-red">{m[1]}</span>
                <span className="text-od-mute">: </span>
                <span className="text-od-green">{m[2]}</span>
              </div>
            );
          }
        }
        if (line.startsWith("#")) {
          return (
            <div key={i} className="text-od-blue font-semibold">
              {line}
            </div>
          );
        }
        return <div key={i}>{line || " "}</div>;
      })}
    </>
  );
}
