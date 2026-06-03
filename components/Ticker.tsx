"use client";

import { useReducedMotion } from "framer-motion";

const ITEMS = [
  "STATE-MACHINE ORDER FLOWS",
  "EXACTLY-ONCE REPLAY",
  "BRACKET / OCO / TRAILING",
  "LOCK-FREE SPSC",
  "NUMA-AWARE PINNING",
  "MULTICAST UDP",
  "µs-PRECISION PROMETHEUS",
  "PARENT-CHILD ORDERS",
  "COLO STREAMING",
  "BRANCHLESS HOT PATHS",
];

export default function Ticker() {
  const reduce = useReducedMotion();
  const row = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative flex overflow-hidden border-y border-line bg-surface/30 py-3"
      aria-hidden
    >
      <div
        className={`flex shrink-0 items-center gap-8 pr-8 ${reduce ? "" : "animate-marquee"}`}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
              {t}
            </span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
          </span>
        ))}
      </div>
      {!reduce && (
        <div className="flex shrink-0 items-center gap-8 pr-8 animate-marquee" aria-hidden>
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                {t}
              </span>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
