"use client";

import { useEffect, useRef } from "react";
import type { Candle } from "@/lib/market";

const VISIBLE = 36; // settled candles to show

type GameChartProps = {
  candles: Candle[];
  /** The candle currently forming during a live reveal, or null. */
  live: Candle | null;
  /** Entry (open) price of the active round — drawn as a dashed guide. */
  entry: number | null;
  /** "Predict the close" target — drawn as a dashed amber guide. */
  predicted: number | null;
};

const GREEN = "#26D07C";
const RED = "#FF5C6C";
const ACCENT = "#38BDF8";
const AMBER = "#F5B14C";

/**
 * Lightweight canvas candlestick chart for the play game. Redraws whenever the
 * candle series or the forming live candle changes; auto-scales to the visible
 * range and overlays entry / target / live-price guides.
 */
export default function GameChart({ candles, live, entry, predicted }: GameChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const settled = candles.slice(-VISIBLE);
    const view: Candle[] = live ? [...settled, live] : settled;
    if (view.length === 0) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const padR = 52; // price axis gutter
    const padY = 18;
    const plotW = w - padR;

    let min = Infinity;
    let max = -Infinity;
    for (const c of view) {
      min = Math.min(min, c.l);
      max = Math.max(max, c.h);
    }
    for (const g of [entry, predicted]) {
      if (g != null) {
        min = Math.min(min, g);
        max = Math.max(max, g);
      }
    }
    const span = max - min || 1;
    min -= span * 0.08;
    max += span * 0.08;

    const yOf = (p: number) => padY + (1 - (p - min) / (max - min)) * (h - padY * 2);

    // Capacity is fixed so candles don't resize as the series grows.
    const slots = VISIBLE + 1;
    const step = plotW / slots;
    const bodyW = Math.max(3, step * 0.62);
    const xOf = (i: number) => step * (i + 0.5);

    // Horizontal price gridlines + labels.
    ctx.font = "500 10px ui-monospace, 'JetBrains Mono', monospace";
    ctx.textBaseline = "middle";
    for (let g = 0; g <= 4; g++) {
      const price = min + ((max - min) * g) / 4;
      const y = yOf(price);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(plotW, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(139,152,169,0.7)";
      ctx.fillText(price.toFixed(2), plotW + 8, y);
    }

    const guide = (price: number, color: string, label: string) => {
      const y = yOf(price);
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(plotW, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.fillText(label, 4, y - 7);
    };
    if (entry != null) guide(entry, "rgba(139,152,169,0.8)", "entry " + entry.toFixed(2));
    if (predicted != null) guide(predicted, AMBER, "target " + predicted.toFixed(2));

    // Candles.
    view.forEach((c, i) => {
      const x = xOf(i);
      const up = c.c >= c.o;
      const isLive = live != null && i === view.length - 1;
      const col = up ? GREEN : RED;
      ctx.globalAlpha = isLive ? 1 : 0.92;

      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yOf(c.h));
      ctx.lineTo(x, yOf(c.l));
      ctx.stroke();

      const yO = yOf(c.o);
      const yC = yOf(c.c);
      ctx.fillStyle = col;
      ctx.fillRect(x - bodyW / 2, Math.min(yO, yC), bodyW, Math.max(2, Math.abs(yC - yO)));
      ctx.globalAlpha = 1;
    });

    // Live current-price marker + dashed line.
    if (live) {
      const y = yOf(live.c);
      const x = xOf(view.length - 1);
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = ACCENT;
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // current price tag on the axis
      ctx.fillStyle = ACCENT;
      ctx.fillRect(plotW, y - 8, padR, 16);
      ctx.fillStyle = "#0A0E14";
      ctx.font = "600 10px ui-monospace, 'JetBrains Mono', monospace";
      ctx.fillText(live.c.toFixed(2), plotW + 6, y);
    }
  }, [candles, live, entry, predicted]);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
