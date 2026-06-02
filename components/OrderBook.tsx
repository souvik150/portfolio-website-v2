"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const LEVELS = 8;
const TICK = 0.05; // price increment
const OPEN = 100.0; // reference / previous close
const BID_MIN = 99.7;
const BID_MAX = 100.3;

// Deterministic seeds so SSR and first client render match (no hydration drift).
const SEED_ASKS = [240, 168, 96, 132, 84, 205, 60, 150]; // row 0 = top (furthest)
const SEED_BIDS = [142, 96, 212, 64, 176, 120, 88, 238]; // row 0 = top (best bid)

type Trade = { price: number; side: "buy" | "sell"; qty: number; id: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmtSize = (n: number) => n.toLocaleString("en-US");

export default function OrderBook() {
  const reduce = useReducedMotion();

  const [asks, setAsks] = useState<number[]>(SEED_ASKS);
  const [bids, setBids] = useState<number[]>(SEED_BIDS);
  const [bestBid, setBestBid] = useState(OPEN); // top-of-book bid
  const [last, setLast] = useState<Trade | null>(null);
  const tradeId = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const rng = mulberry32(0xc0ffee);

    const tick = () => {
      // Jitter a few resting sizes on each side.
      const jitter = (arr: number[]) => {
        const next = [...arr];
        const hits = 2 + Math.floor(rng() * 2);
        for (let k = 0; k < hits; k++) {
          const i = Math.floor(rng() * LEVELS);
          const delta = Math.round((rng() - 0.45) * 60);
          next[i] = Math.max(12, Math.min(420, next[i] + delta));
        }
        return next;
      };
      setAsks((a) => jitter(a));
      setBids((b) => jitter(b));

      // ~65% of ticks print a trade at the touch; sometimes the book walks a tick.
      if (rng() < 0.65) {
        const side: Trade["side"] = rng() > 0.5 ? "buy" : "sell";
        setBestBid((b) => {
          let nb = b;
          if (rng() < 0.4) nb = side === "buy" ? b + TICK : b - TICK;
          nb = Math.min(BID_MAX, Math.max(BID_MIN, +nb.toFixed(2)));
          // Trades execute at the touch: buys lift the ask, sells hit the bid.
          const price = +(side === "buy" ? nb + TICK : nb).toFixed(2);
          tradeId.current += 1;
          setLast({ price, side, qty: 5 + Math.floor(rng() * 95), id: tradeId.current });
          return nb;
        });
      }
    };

    const interval = window.setInterval(tick, 900);
    return () => window.clearInterval(interval);
  }, [reduce]);

  const maxSize = Math.max(...asks, ...bids, 1);
  const bestAsk = +(bestBid + TICK).toFixed(2);
  const spread = +(bestAsk - bestBid).toFixed(2); // exactly one tick
  const lastPrice = last?.price ?? OPEN;
  const change = +(lastPrice - OPEN).toFixed(2);
  const changePct = ((change / OPEN) * 100).toFixed(2);
  const up = change >= 0;

  return (
    <div className="panel overflow-hidden shadow-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-bid" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-bid" />
          </span>
          <span className="font-mono text-xs font-medium tracking-wide text-ink">
            SENTINEL · SIMEX
          </span>
        </div>
        <span className="mono-label text-faint">
          {reduce ? "SNAPSHOT" : "LIVE FEED"}
        </span>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-3 px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        <span>Price</span>
        <span className="text-center">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (high → low, bottom row = best ask / touch) */}
      <div className="px-2">
        {asks.map((size, i) => {
          const price = +(bestAsk + TICK * (LEVELS - 1 - i)).toFixed(2);
          const total = asks.slice(i).reduce((s, v) => s + v, 0);
          return (
            <Row key={`a-${i}`} side="ask" price={price} size={size} total={total} pct={size / maxSize} />
          );
        })}
      </div>

      {/* Last trade / day change */}
      <div className="my-1 flex items-center justify-between border-y border-line bg-surface-2/60 px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span
            key={last?.id ?? "open"}
            className={`tnum font-mono text-lg font-semibold tabular-nums transition-colors ${
              up ? "text-bid" : "text-ask"
            }`}
          >
            {lastPrice.toFixed(2)}
          </span>
          <span className={`font-mono text-xs ${up ? "text-bid" : "text-ask"}`}>
            {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({up ? "+" : "−"}
            {Math.abs(Number(changePct)).toFixed(2)}%)
          </span>
        </div>
        <span className="mono-label">spread {spread.toFixed(2)}</span>
      </div>

      {/* Bids (high → low, top row = best bid / touch) */}
      <div className="px-2 pb-3">
        {bids.map((size, i) => {
          const price = +(bestBid - TICK * i).toFixed(2);
          const total = bids.slice(0, i + 1).reduce((s, v) => s + v, 0);
          return (
            <Row key={`b-${i}`} side="bid" price={price} size={size} total={total} pct={size / maxSize} />
          );
        })}
      </div>
    </div>
  );
}

function Row({
  side,
  price,
  size,
  total,
  pct,
}: {
  side: "bid" | "ask";
  price: number;
  size: number;
  total: number;
  pct: number;
}) {
  const isBid = side === "bid";
  return (
    <div className="group relative grid grid-cols-3 items-center rounded px-2 py-[3px] font-mono text-xs tabular-nums">
      <div
        aria-hidden
        className={`absolute inset-y-px right-0 rounded-sm transition-[width] duration-500 ${
          isBid ? "bg-bid/[0.12]" : "bg-ask/[0.12]"
        }`}
        style={{ width: `${Math.max(6, pct * 100)}%` }}
      />
      <span className={`relative z-10 tnum ${isBid ? "text-bid" : "text-ask"}`}>
        {price.toFixed(2)}
      </span>
      <span className="relative z-10 text-center tnum text-ink">{fmtSize(size)}</span>
      <span className="relative z-10 text-right tnum text-faint">{fmtSize(total)}</span>
    </div>
  );
}
