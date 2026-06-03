"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRichMotion } from "@/lib/hooks";

const CW = 10; // corner bracket size (px)
const HALF = 11; // idle reticle half-size (px)
const PAD = 8; // breathing room when locked onto a target

/**
 * A trading-terminal targeting reticle. Four corner brackets ride just around
 * the pointer and "lock on" — snapping out to frame any interactive element you
 * hover (green = locked) — while a precise center dot stays on the true pointer.
 * Localized to the pointer, so nothing ever streaks across the page text.
 * Desktop + fine-pointer only; restores the native cursor everywhere else.
 */
export default function Cursor() {
  const rich = useRichMotion();
  const [mounted, setMounted] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null); // holds the 4 corners
  const dotRef = useRef<HTMLDivElement>(null); // rides the real pointer
  const tlRef = useRef<HTMLDivElement>(null);
  const trRef = useRef<HTMLDivElement>(null);
  const blRef = useRef<HTMLDivElement>(null);
  const brRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!rich) return;
    document.documentElement.classList.add("cursor-none");

    const wrapX = gsap.quickTo(wrapRef.current, "x", { duration: 0.18, ease: "power3" });
    const wrapY = gsap.quickTo(wrapRef.current, "y", { duration: 0.18, ease: "power3" });
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" });

    const corners = [tlRef, trRef, blRef, brRef].map((r) => ({
      x: gsap.quickTo(r.current, "x", { duration: 0.3, ease: "power3" }),
      y: gsap.quickTo(r.current, "y", { duration: 0.3, ease: "power3" }),
    }));

    // Place the four brackets given a half-width / half-height from center.
    const setCorners = (hx: number, hy: number) => {
      corners[0].x(-hx); corners[0].y(-hy); // top-left
      corners[1].x(hx - CW); corners[1].y(-hy); // top-right
      corners[2].x(-hx); corners[2].y(hy - CW); // bottom-left
      corners[3].x(hx - CW); corners[3].y(hy - CW); // bottom-right
    };

    let target: HTMLElement | null = null;

    const setActive = (on: boolean) => {
      gsap.to([tlRef.current, trRef.current, blRef.current, brRef.current], {
        borderColor: on ? "#26D07C" : "#38BDF8",
        duration: 0.2,
      });
      gsap.to(dotRef.current, {
        backgroundColor: on ? "#26D07C" : "#38BDF8",
        scale: on ? 0 : 1, // hide the dot when locked; the frame does the work
        duration: 0.2,
      });
    };

    const lockTo = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      wrapX(r.left + r.width / 2);
      wrapY(r.top + r.height / 2);
      setCorners(r.width / 2 + PAD, r.height / 2 + PAD);
    };

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      if (target && document.contains(target)) {
        lockTo(target); // keep framed during scroll / layout shifts
      } else {
        target = null;
        wrapX(e.clientX);
        wrapY(e.clientY);
        setCorners(HALF, HALF);
      }
    };

    const interactive = (e: PointerEvent) =>
      (e.target as HTMLElement)?.closest?.(
        'a, button, input, textarea, select, [role="button"], [data-cursor="active"]',
      ) as HTMLElement | null;

    const onOver = (e: PointerEvent) => {
      const el = interactive(e);
      if (el && el !== target) {
        target = el;
        setActive(true);
        lockTo(el);
      }
    };

    const onOut = (e: PointerEvent) => {
      if (!target) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (related && target.contains(related)) return; // still inside target
      target = null;
      setActive(false);
    };

    const onDown = () => gsap.to(wrapRef.current, { scale: 0.85, duration: 0.12 });
    const onUp = () => gsap.to(wrapRef.current, { scale: 1, duration: 0.18 });

    const container = wrapRef.current?.parentElement ?? null;
    const onLeave = () => gsap.to(container, { opacity: 0, duration: 0.2 });
    const onEnter = () => gsap.to(container, { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [rich]);

  if (!mounted || !rich) return null;

  const corner =
    "absolute left-0 top-0 h-[10px] w-[10px] border-accent";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      {/* precise center dot — always on the true pointer */}
      <div
        ref={dotRef}
        className="absolute -left-[2px] -top-[2px] h-1 w-1 rounded-full bg-accent"
        style={{ willChange: "transform", boxShadow: "0 0 10px 1px rgba(56,189,248,0.7)" }}
      />
      {/* reticle: four corner brackets that frame the pointer / locked target */}
      <div ref={wrapRef} className="absolute left-0 top-0" style={{ willChange: "transform" }}>
        <div ref={tlRef} className={`${corner} border-l border-t`} style={{ willChange: "transform" }} />
        <div ref={trRef} className={`${corner} border-r border-t`} style={{ willChange: "transform" }} />
        <div ref={blRef} className={`${corner} border-b border-l`} style={{ willChange: "transform" }} />
        <div ref={brRef} className={`${corner} border-b border-r`} style={{ willChange: "transform" }} />
      </div>
    </div>
  );
}
