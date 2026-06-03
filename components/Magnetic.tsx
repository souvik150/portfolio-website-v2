"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useRichMotion } from "@/lib/hooks";

type MagneticProps = {
  children: ReactNode;
  /** How far the element is pulled toward the pointer (px at the edge). */
  strength?: number;
  className?: string;
};

/**
 * Wraps a single interactive child and pulls it toward the pointer while
 * hovered, springing back on leave. The inner span gets a slightly larger
 * counter-pull so label + icon feel "alive". No-ops on touch / reduced-motion.
 */
export default function Magnetic({
  children,
  strength = 22,
  className,
}: MagneticProps) {
  const rich = useRichMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!rich) return;
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const ixTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" });
    const iyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      const dx = (relX / r.width) * strength;
      const dy = (relY / r.height) * strength;
      xTo(dx);
      yTo(dy);
      ixTo(dx * 0.4);
      iyTo(dy * 0.4);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      ixTo(0);
      iyTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [rich, strength]);

  return (
    <span
      ref={wrapRef}
      className={`inline-flex ${className ?? ""}`}
      style={{ willChange: "transform" }}
    >
      <span ref={innerRef} className="inline-flex" style={{ willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
