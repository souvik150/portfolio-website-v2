"use client";

import { useEffect, useState } from "react";
import { type Candle, nextCandle, seedCandles } from "@/lib/market";
import { usePrefersReducedMotion } from "@/lib/hooks";
import GameChart from "./play/GameChart";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";

const CHIPS = ["$10,000 play money", "up to 25× leverage", "predict the close → 10×"];

/**
 * Homepage teaser for the /play market game: a self-playing candlestick demo
 * (a new candle streams in on a loop) beside a challenge headline + CTA. The
 * loop pauses under reduced-motion, leaving a static chart.
 */
export default function PlayCTA() {
  const reduce = usePrefersReducedMotion();
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    setCandles(seedCandles(30, 100));
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setCandles((prev) => {
        const last = prev.length ? prev[prev.length - 1].c : 100;
        return [...prev, nextCandle(last)].slice(-30);
      });
    }, 1300);
    return () => window.clearInterval(id);
  }, [reduce]);

  const lastPrice = candles.length ? candles[candles.length - 1].c : 100;
  const prev = candles.length > 1 ? candles[candles.length - 2].c : lastPrice;
  const up = lastPrice >= prev;

  return (
    <section id="game" className="shell scroll-mt-24 py-24 sm:py-32">
      <Reveal>
        <div className="panel relative overflow-hidden p-6 shadow-panel sm:p-10">
          {/* atmosphere */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-bid/[0.06] blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
            {/* Copy */}
            <div>
              <div className="flex items-center gap-3">
                <span className="mono-label text-accent">// market game</span>
                <span className="h-px w-12 bg-line" aria-hidden />
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                Think you can
                <br />
                beat the tape<span className="text-accent">?</span>
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                Take leveraged long/short positions or call the exact close on a simulated
                market — settled candle by candle, live. It&apos;s the kind of feed my OMS and
                matching engine drive, turned into a game. No sign-up, no real risk.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {CHIPS.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-line bg-base/60 px-2.5 py-1 font-mono text-xs text-muted"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Magnetic strength={28}>
                  <a
                    href="/play"
                    className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-base shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    Take the challenge
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </Magnetic>
              </div>
            </div>

            {/* Live demo chart */}
            <div className="rounded-xl border border-line bg-base/40 p-1">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    {!reduce && (
                      <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
                    )}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <span className="mono-label text-faint">SIMEX · LIVE DEMO</span>
                </span>
                <span className={`tnum font-mono text-xs tabular-nums ${up ? "text-bid" : "text-ask"}`}>
                  {up ? "▲" : "▼"} {lastPrice.toFixed(2)}
                </span>
              </div>
              <div className="h-[240px] w-full sm:h-[280px]">
                <GameChart candles={candles} live={null} entry={null} predicted={null} />
              </div>
              <p className="px-3 pb-2 pt-1 text-center font-mono text-[10px] text-faint">
                auto-playing preview — your move on the real thing
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
