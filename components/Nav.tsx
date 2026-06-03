"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/data";
import { Download } from "./icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={`shell flex items-center justify-between rounded-xl border px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-line bg-base/80 shadow-panel backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
        aria-label="Primary"
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-bid" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-bid shadow-glow-bid" />
          </span>
          <span className="font-mono text-sm font-medium tracking-tight text-ink">
            souvik<span className="text-faint">.mukherjee</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/play"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Play
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
          <a
            href={profile.resume}
            download
            className="group inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Download className="h-4 w-4" />
            Résumé
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`shell mt-2 overflow-hidden rounded-xl border border-line bg-base/95 backdrop-blur-md transition-all duration-300 md:hidden ${
          open ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col p-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/play"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-3 text-sm font-medium text-accent"
          >
            Play the market game
            <span aria-hidden>↗</span>
          </a>
          <a
            href={profile.resume}
            download
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-2 px-3 py-3 text-sm font-medium text-ink"
          >
            <Download className="h-4 w-4" />
            Download Résumé
          </a>
        </div>
      </div>
    </header>
  );
}
