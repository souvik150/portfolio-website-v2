"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CANDLES = 64;
const SEED = 0x5e4f10;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Candle = { o: number; h: number; l: number; c: number; v: number };

/** Deterministic random-walk OHLC series so SSR/client and reloads agree. */
function buildSeries(): Candle[] {
  const rng = mulberry32(SEED);
  const out: Candle[] = [];
  let price = 100;
  for (let i = 0; i < CANDLES; i++) {
    const drift = (rng() - 0.46) * 4;
    const o = price;
    const c = Math.max(40, o + drift);
    const wick = 1 + rng() * 3;
    const h = Math.max(o, c) + rng() * wick;
    const l = Math.min(o, c) - rng() * wick;
    out.push({ o, h, l, c, v: 0.3 + rng() * 0.7 });
    price = c;
  }
  return out;
}

/**
 * A full-viewport candlestick chart fixed behind the content. As the page
 * scrolls, candles "stream in" left-to-right, an EMA line draws with a glowing
 * leading dot, and a price tag rides the leading edge — the page literally
 * scrubs a market chart. Under reduced-motion it renders the full chart static.
 */
export default function ScrollChart() {
  const reduce = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const series = buildSeries();
    const prices = series.flatMap((d) => [d.h, d.l]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // EMA over closes for the overlay line.
    const ema: number[] = [];
    const k = 2 / (9 + 1);
    series.forEach((d, i) => {
      ema[i] = i === 0 ? d.c : d.c * k + ema[i - 1] * (1 - k);
    });

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const padX = () => Math.max(24, w * 0.06);
    const bandTop = () => h * 0.16;
    const bandH = () => h * 0.68;

    const yOf = (price: number) => {
      const t = (price - min) / (max - min || 1);
      return bandTop() + (1 - t) * bandH();
    };

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, w, h);

      const left = padX();
      const right = w - padX();
      const span = right - left;
      const step = span / (CANDLES - 1);
      const bodyW = Math.max(2, step * 0.5);

      // How many candles are "revealed", with a fractional leading candle.
      const revealF = progress * CANDLES;
      const revealed = Math.floor(revealF);
      const lead = revealF - revealed;

      // Volume bars (bottom band).
      const volTop = bandTop() + bandH() + 8;
      const volMax = h - volTop - 6;
      for (let i = 0; i < CANDLES; i++) {
        if (i > revealed) break;
        const x = left + i * step;
        const a = i === revealed ? lead : 1;
        const d = series[i];
        ctx.fillStyle =
          d.c >= d.o ? `rgba(38,208,124,${0.05 * a})` : `rgba(255,92,108,${0.05 * a})`;
        const vh = d.v * volMax;
        ctx.fillRect(x - bodyW / 2, volTop + (volMax - vh), bodyW, vh);
      }

      // Candles.
      for (let i = 0; i < CANDLES; i++) {
        if (i > revealed) break;
        const x = left + i * step;
        const d = series[i];
        const a = i === revealed ? lead : 1;
        const up = d.c >= d.o;
        const stroke = up ? `rgba(38,208,124,` : `rgba(255,92,108,`;

        // wick
        ctx.strokeStyle = `${stroke}${0.32 * a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yOf(d.h));
        ctx.lineTo(x, yOf(d.l));
        ctx.stroke();

        // body
        const yO = yOf(d.o);
        const yC = yOf(d.c);
        const top = Math.min(yO, yC);
        const bh = Math.max(1.5, Math.abs(yC - yO));
        ctx.fillStyle = `${stroke}${0.22 * a})`;
        ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
      }

      // EMA line with glow, drawn up to the leading edge.
      ctx.beginPath();
      let started = false;
      const lastIdx = Math.min(revealed, CANDLES - 1);
      for (let i = 0; i <= lastIdx; i++) {
        const x = left + i * step;
        const y = yOf(ema[i]);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = "rgba(56,189,248,0.55)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(56,189,248,0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading dot + price tag.
      if (lastIdx >= 0) {
        const x = left + lastIdx * step;
        const y = yOf(ema[lastIdx]);
        ctx.fillStyle = "#38BDF8";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // dashed horizontal price guide
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = "rgba(56,189,248,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font =
          "600 11px ui-monospace, 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(56,189,248,0.85)";
        ctx.textBaseline = "middle";
        ctx.fillText(series[lastIdx].c.toFixed(2), Math.min(x + 8, right - 44), y);
      }
    };

    let ticking = false;
    const progressNow = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const requestDraw = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        draw(reduce ? 1 : progressNow());
        ticking = false;
      });
    };

    resize();
    draw(reduce ? 1 : progressNow());

    const onScroll = () => requestDraw();
    const onResize = () => {
      resize();
      requestDraw();
    };

    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] h-full w-full opacity-[0.55]"
    />
  );
}
