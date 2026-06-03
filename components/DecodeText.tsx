"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&/<>[]{}=+*".split("");

type DecodeTextProps = {
  text: string;
  /** ms before the decode starts. */
  delay?: number;
  /** ms to fully resolve. */
  duration?: number;
  className?: string;
  as?: "span" | "h1" | "h2";
};

/**
 * Renders `text` as if a terminal is decrypting a feed: every glyph cycles
 * through random characters, then locks left-to-right into the real string.
 * Under reduced-motion it renders the final text immediately.
 */
export default function DecodeText({
  text,
  delay = 0,
  duration = 900,
  className,
  as = "span",
}: DecodeTextProps) {
  const reduce = usePrefersReducedMotion();
  const [output, setOutput] = useState(text);
  const [done, setDone] = useState(false);
  const frame = useRef(0);
  const Tag = as;

  useEffect(() => {
    if (reduce) {
      setOutput(text);
      setDone(true);
      return;
    }

    let raf = 0;
    let start = 0;
    const chars = text.split("");

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      // How many characters have locked, left to right.
      const locked = Math.floor(progress * chars.length);
      frame.current += 1;

      const next = chars
        .map((ch, i) => {
          if (ch === " " || ch === "\n") return ch;
          if (i < locked) return ch;
          // Cycle glyphs every couple of frames for a flicker feel.
          return GLYPHS[(frame.current + i * 7) % GLYPHS.length];
        })
        .join("");

      setOutput(next);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setOutput(text);
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration, reduce]);

  return (
    <Tag
      className={className}
      data-decoding={!done}
      aria-label={text}
      style={{ fontVariantLigatures: "none" }}
    >
      <span aria-hidden style={{ whiteSpace: "pre-line" }}>
        {output}
      </span>
    </Tag>
  );
}
