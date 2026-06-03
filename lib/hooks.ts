"use client";

import { useEffect, useState } from "react";

/**
 * State mirrored to localStorage. SSR-safe: starts from `initial` on both
 * server and first client render (no hydration mismatch), then loads the stored
 * value after mount. The third tuple element reports whether hydration is done.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): readonly [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore unavailable/corrupt storage */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore quota/unavailable storage */
    }
  }, [key, state, hydrated]);

  return [state, setState, hydrated] as const;
}

/**
 * Tracks a CSS media query. SSR-safe: returns `false` until mounted, then the
 * real value. Re-subscribes if the query string changes.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True only on devices with a precise pointer (mouse / trackpad). */
export function usePointerFine(): boolean {
  return useMediaQuery("(pointer: fine)");
}

/** Mirrors the user's reduced-motion preference outside of Framer Motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * True when high-effort motion is appropriate: a fine pointer, no
 * reduced-motion request, and a viewport wide enough to be a desktop.
 */
export function useRichMotion(): boolean {
  const fine = usePointerFine();
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  return fine && wide && !reduce;
}
