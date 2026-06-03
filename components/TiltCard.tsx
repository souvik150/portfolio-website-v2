"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { useRichMotion } from "@/lib/hooks";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. */
  tilt?: number;
  as?: ElementType;
};

/**
 * Adds a cursor-following light sheen and subtle 3D tilt to a card. The tilt is
 * applied to the element itself; a radial "spotlight" overlay tracks the
 * pointer for depth. Static (no transform) on touch / reduced-motion.
 */
export default function TiltCard({
  children,
  className,
  tilt = 6,
  as,
}: TiltCardProps) {
  const rich = useRichMotion();
  const ref = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    if (!rich) return;
    const el = ref.current;
    const glow = glowRef.current;
    if (!el) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const relY = (e.clientY - r.top) / r.height - 0.5;
      ryTo(relX * tilt);
      rxTo(-relY * tilt);
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(380px circle at ${
          (relX + 0.5) * 100
        }% ${(relY + 0.5) * 100}%, rgba(56,189,248,0.14), transparent 55%)`;
      }
    };

    const onEnter = () => scaleTo(1.012);
    const onLeave = () => {
      rxTo(0);
      ryTo(0);
      scaleTo(1);
      if (glow) glow.style.opacity = "0";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [rich, tilt]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={rich ? { willChange: "transform" } : undefined}
    >
      {rich && (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
      {children}
    </Tag>
  );
}
