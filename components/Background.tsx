"use client";

import { useEffect, useState } from "react";

/**
 * Fixed atmospheric backdrop: a faint terminal grid, two soft radial glows,
 * and a vignette. Pure CSS — no per-frame work, cheap on every device.
 * A pointer-reactive glow is layered in only on devices with a fine pointer.
 */
export default function Background() {
  const [pos, setPos] = useState({ x: 50, y: 12 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div
        className="absolute inset-0 transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(56,189,248,0.10), transparent 60%)`,
        }}
      />
      <div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-bid/[0.07] blur-[120px]" />
      <div className="absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-accent/[0.08] blur-[120px]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
