"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "bun", label: "bun", cmd: "bun i -g mdurl-cli" },
  { id: "npm", label: "npm", cmd: "npm i -g mdurl-cli" },
  { id: "pnpm", label: "pnpm", cmd: "pnpm add -g mdurl-cli" },
  { id: "npx", label: "npx", cmd: "npx mdurl-cli https://example.com" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function InstallBlock() {
  const [tab, setTab] = useState<TabId>("bun");
  const [copied, setCopied] = useState(false);
  const current = TABS.find((t) => t.id === tab)!;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.cmd);
      setCopied(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition ${
              tab === t.id
                ? "bg-od-panel-2 text-od-fg-bright border border-white/10"
                : "text-od-mute hover:text-od-fg-bright"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-od-panel/80 px-4 py-3 ring-soft backdrop-blur-sm">
        <span className="select-none font-mono text-od-green">$</span>
        <code className="flex-1 font-mono text-sm text-od-fg-bright truncate">
          {current.cmd}
        </code>
        <button
          onClick={copy}
          aria-label="Copy install command"
          className="relative shrink-0 rounded-md border border-white/10 bg-od-bg-soft/80 px-3 py-1.5 text-xs font-mono text-od-mute hover:text-od-fg-bright hover:border-white/20 transition"
        >
          <span
            className={`block transition ${
              copied ? "opacity-0" : "opacity-100"
            }`}
          >
            copy
          </span>
          <span
            className={`absolute inset-0 grid place-items-center text-od-green transition ${
              copied ? "opacity-100" : "opacity-0"
            }`}
          >
            copied
          </span>
        </button>
      </div>
    </div>
  );
}
