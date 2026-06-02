"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/data";
import OrderBook from "./OrderBook";
import { ArrowUpRight, Download, Github, Linkedin } from "./icons";

export default function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.09, delayChildren: 0.05 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="top" className="relative pt-28 sm:pt-32 lg:pt-40">
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left: copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-bid shadow-glow-bid" />
              <span className="font-mono text-[11px] tracking-wide text-muted">
                {profile.title} · {profile.company}
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Souvik
            <br />
            Mukherjee<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap gap-2">
            {profile.stackline.map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-surface/60 px-2.5 py-1 font-mono text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-base transition-transform hover:-translate-y-0.5"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Download className="h-4 w-4" />
              Résumé
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <Github className="h-[18px] w-[18px]" />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <Linkedin className="h-[18px] w-[18px]" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: live order book */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <OrderBook />
          <p className="mt-3 text-center font-mono text-[11px] text-faint">
            simulated depth — the kind of feed Sentinel OMS &amp; my matching engine drive
          </p>
        </motion.div>
      </div>
    </section>
  );
}
