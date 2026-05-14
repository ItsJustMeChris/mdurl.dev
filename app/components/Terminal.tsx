"use client";

import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  findFetch,
  findSearch,
  FETCH_URLS,
  SEARCH_QUERIES,
  type Snapshot,
} from "@/lib/snapshots";

type Line = {
  id: number;
  kind: "prompt" | "stdout" | "meta" | "info" | "error";
  text: string;
};

const PROMPT = "mdurl";

const SUGGESTIONS: { input: string; label: string }[] = [
  ...FETCH_URLS.map((u) => ({ input: u, label: u })),
  ...SEARCH_QUERIES.map((q) => ({
    input: `search ${q}`,
    label: `search ${q}`,
  })),
];

type Parsed =
  | { kind: "fetch"; url: string }
  | { kind: "search"; query: string }
  | { kind: "clear" }
  | { kind: "help" }
  | { kind: "list" }
  | { kind: "error"; reason: string };

function tokenize(input: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (c === " " || c === "\t") {
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      let buf = "";
      while (j < input.length && input[j] !== quote) {
        buf += input[j];
        j++;
      }
      out.push(buf);
      i = j + 1;
      continue;
    }
    let buf = "";
    while (i < input.length && input[i] !== " " && input[i] !== "\t") {
      buf += input[i];
      i++;
    }
    out.push(buf);
  }
  return out;
}

function parseCommand(tokens: string[]): Parsed {
  if (tokens.length === 0) return { kind: "error", reason: "empty input" };
  const first = tokens[0];
  if (first === "clear") return { kind: "clear" };
  if (first === "help" || first === "--help" || first === "-h")
    return { kind: "help" };
  if (first === "list" || first === "ls") return { kind: "list" };
  if (first === "search") {
    const query = tokens
      .slice(1)
      .filter((t) => !t.startsWith("-"))
      .join(" ")
      .trim();
    if (!query) return { kind: "error", reason: "search requires a query" };
    return { kind: "search", query };
  }
  if (tokens.length > 1) {
    return {
      kind: "error",
      reason:
        "this demo accepts a single URL or `search <terms>` — flags aren't simulated",
    };
  }
  try {
    const u = new URL(first);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { kind: "error", reason: "only http(s) URLs are accepted" };
    }
  } catch {
    return {
      kind: "error",
      reason: "not a valid URL. Type `list` to see the demo set.",
    };
  }
  return { kind: "fetch", url: first };
}

const WELCOME_LINES: Line[] = [
  { id: 1, kind: "info", text: "mdurl v0.1.1 — sandboxed demo" },
  {
    id: 2,
    kind: "meta",
    text: "These are real mdurl outputs, captured ahead of time. Type `list` to see what's available, or click a chip below.",
  },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(WELCOME_LINES);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const idRef = useRef(WELCOME_LINES.length + 1);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const nextId = () => idRef.current++;

  const pushLine = useCallback((line: Omit<Line, "id">) => {
    setLines((prev) => [...prev, { ...line, id: nextId() }]);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const replaySnapshot = useCallback(
    async (snapshot: Snapshot) => {
      setBusy(true);
      // Tiny artificial delay so the "live" feel reads
      const delay = Math.min(snapshot.durationMs, 800);
      await new Promise<void>((r) => setTimeout(r, delay));
      pushLine({ kind: "stdout", text: snapshot.output });
      pushLine({
        kind: "meta",
        text: `exit 0 · ${snapshot.durationMs}ms · cached snapshot`,
      });
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [pushLine]
  );

  const submit = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const tokens = tokenize(trimmed);
      const args = tokens[0] === "mdurl" ? tokens.slice(1) : tokens;
      const parsed = parseCommand(args);

      setHistory((h) => [...h, trimmed]);
      setHistoryIdx(null);

      if (parsed.kind === "clear") {
        pushLine({ kind: "prompt", text: `${PROMPT} clear` });
        setLines([]);
        idRef.current = 1;
        return;
      }
      if (parsed.kind === "help") {
        pushLine({ kind: "prompt", text: `${PROMPT} help` });
        pushLine({
          kind: "info",
          text: `This is a demo. The terminal replays real mdurl output captured ahead of time — no live fetch is made from this site.

Two commands:
  mdurl <url>            replay a cached fetch
  mdurl search <terms>   replay a cached search

Built-ins:
  list     show the demo set
  clear    clear the screen

The real CLI supports many more flags (--json, --section,
--selector, --max-bytes, --js, ...). Install it locally:

  bun i -g mdurl-cli`,
        });
        return;
      }
      if (parsed.kind === "list") {
        pushLine({ kind: "prompt", text: `${PROMPT} list` });
        const fetchBlock = FETCH_URLS.map((u) => `  mdurl ${u}`).join("\n");
        const searchBlock = SEARCH_QUERIES.map(
          (q) => `  mdurl search ${q}`
        ).join("\n");
        pushLine({
          kind: "info",
          text: `Available in this demo:\n\n${fetchBlock}\n\n${searchBlock}`,
        });
        return;
      }
      if (parsed.kind === "error") {
        pushLine({ kind: "prompt", text: `${PROMPT} ${args.join(" ")}` });
        pushLine({ kind: "error", text: parsed.reason });
        return;
      }

      if (parsed.kind === "fetch") {
        const snapshot = findFetch(parsed.url);
        pushLine({
          kind: "prompt",
          text: `${PROMPT} ${parsed.url}`,
        });
        if (!snapshot) {
          pushLine({
            kind: "error",
            text: `not in the demo set. Type \`list\` for available URLs, or install the real CLI: bun i -g mdurl-cli`,
          });
          return;
        }
        await replaySnapshot(snapshot);
        return;
      }
      if (parsed.kind === "search") {
        const snapshot = findSearch(parsed.query);
        pushLine({
          kind: "prompt",
          text: `${PROMPT} search "${parsed.query}"`,
        });
        if (!snapshot) {
          pushLine({
            kind: "error",
            text: `not in the demo set. Type \`list\` for available queries, or install the real CLI: bun i -g mdurl-cli`,
          });
          return;
        }
        await replaySnapshot(snapshot);
      }
    },
    [pushLine, replaySnapshot]
  );

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (busy) {
      if (e.key === "Enter") e.preventDefault();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const val = input;
      setInput("");
      void submit(val);
      return;
    }
    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      e.preventDefault();
      const idx =
        historyIdx === null
          ? history.length - 1
          : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx]);
      return;
    }
    if (e.key === "ArrowDown") {
      if (historyIdx === null) return;
      e.preventDefault();
      const idx = historyIdx + 1;
      if (idx >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
      return;
    }
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
      idRef.current = 1;
    }
  };

  const renderedLines = useMemo(() => {
    return lines.map((l) => {
      const cls =
        l.kind === "prompt"
          ? "text-od-fg-bright"
          : l.kind === "meta"
          ? "text-od-mute"
          : l.kind === "info"
          ? "text-od-blue"
          : l.kind === "error"
          ? "text-od-red"
          : "text-od-fg";
      if (l.kind === "prompt") {
        return (
          <div key={l.id} className="whitespace-pre-wrap">
            <span className="text-od-green">❯</span>{" "}
            <span className="text-od-magenta">{PROMPT}</span>{" "}
            <span className="text-od-fg-bright">
              {l.text.slice(PROMPT.length + 1)}
            </span>
          </div>
        );
      }
      if (l.kind === "stdout") {
        return (
          <pre
            key={l.id}
            className="whitespace-pre-wrap break-words font-mono text-od-fg"
          >
            <SnapshotOutput text={l.text} />
          </pre>
        );
      }
      return (
        <pre
          key={l.id}
          className={`whitespace-pre-wrap break-words font-mono ${cls}`}
        >
          {l.text}
        </pre>
      );
    });
  }, [lines]);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-white/8 bg-od-panel/90 shadow-2xl ring-soft glow-blue overflow-hidden backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-od-bg-soft/70 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
          <span className="h-3 w-3 rounded-full bg-[#febc2e]"></span>
          <span className="h-3 w-3 rounded-full bg-[#28c840]"></span>
          <div className="ml-3 flex items-center gap-2 text-xs text-od-mute font-mono">
            <span className="text-od-fg-bright">~/projects</span>
            <span className="opacity-50">—</span>
            <span>zsh · mdurl</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-od-mute">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-od-yellow"></span>
            demo
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="term-scroll h-[440px] overflow-y-auto px-5 py-4 font-mono text-[13px] leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-2">{renderedLines}</div>

          {busy ? (
            <div className="mt-2 flex items-center gap-2 text-od-mute">
              <span className="inline-block h-2 w-2 rounded-full bg-od-blue animate-pulse"></span>
              <span>replaying snapshot…</span>
            </div>
          ) : (
            <div className="mt-2 flex items-start gap-2">
              <span className="text-od-green select-none">❯</span>
              <span className="text-od-magenta select-none">{PROMPT}</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="flex-1 resize-none bg-transparent text-od-fg-bright outline-none placeholder:text-od-mute caret-od-fg-bright"
                placeholder="type `list`, or pick a chip below"
              />
            </div>
          )}
        </div>

        {/* Suggestion chips */}
        <div className="border-t border-white/5 bg-od-bg-soft/60 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-od-mute mr-1">
              try
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.input}
                disabled={busy}
                onClick={() => {
                  setInput(s.input);
                  inputRef.current?.focus();
                }}
                className="group rounded-full border border-white/8 bg-od-panel-2/60 px-3 py-1 font-mono text-od-fg hover:border-od-blue/40 hover:text-od-fg-bright hover:bg-od-panel-2 transition disabled:opacity-40"
              >
                <span className="text-od-mute group-hover:text-od-blue">$</span>{" "}
                mdurl {s.label}
              </button>
            ))}
            <button
              disabled={busy}
              onClick={() => {
                setLines([]);
                idRef.current = 1;
                inputRef.current?.focus();
              }}
              className="ml-auto rounded-full border border-white/8 px-3 py-1 text-od-mute hover:text-od-fg-bright hover:border-white/20 transition disabled:opacity-40"
            >
              clear
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 px-1 text-xs text-od-mute font-mono">
        demo · cached snapshots · real output from{" "}
        <span className="text-od-fg-bright">bun i -g mdurl-cli</span>
      </p>
    </div>
  );
}

function SnapshotOutput({ text }: { text: string }) {
  // Light highlighting: YAML keys/values inside the frontmatter,
  // markdown headings, link text, and a special tint for separator lines.
  const lines = text.split("\n");
  let inFront = false;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "---") {
      inFront = !inFront;
      out.push(
        <div key={i} className="text-od-mute">
          {line}
        </div>
      );
      continue;
    }
    if (inFront) {
      const m = line.match(/^([a-z_][\w-]*): (.*)$/);
      if (m) {
        out.push(
          <div key={i}>
            <span className="text-od-red">{m[1]}</span>
            <span className="text-od-mute">: </span>
            <span className="text-od-green">{m[2]}</span>
          </div>
        );
        continue;
      }
    }
    if (line.startsWith("# ")) {
      out.push(
        <div key={i} className="text-od-blue font-semibold">
          {line}
        </div>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        <div key={i} className="text-od-cyan font-semibold">
          {line}
        </div>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(
        <div key={i} className="text-od-magenta">
          {line}
        </div>
      );
      continue;
    }
    out.push(<div key={i}>{line || " "}</div>);
  }
  return <>{out}</>;
}
