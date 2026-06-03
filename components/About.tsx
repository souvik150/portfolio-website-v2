import { profile } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const focus = [
  {
    title: "Order lifecycle",
    body: "State-machine-driven flows, parent-child workflows, and execution algos, from gRPC ingestion to exchange acknowledgement.",
  },
  {
    title: "Real-time risk",
    body: "Pluggable pre-trade compliance over deep-cloned portfolio snapshots, MTM accounting, and crash-safe recovery.",
  },
  {
    title: "Low latency",
    body: "Branchless hot paths, lock-free queues, cache-line layouts, and NUMA-aware pinning down to the sub-100 ns regime.",
  },
];

export default function About() {
  return (
    <section id="about" className="shell scroll-mt-24 py-24 sm:py-32">
      <SectionHeading index="01 / about" title="Engineering the order, end to end." />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            {profile.summary}
          </p>
          <p className="mt-6 leading-relaxed text-faint">
            I care about systems that stay correct under pressure, where a missed
            response or a stale risk check has real consequences. That bias toward
            determinism, observability, and graceful recovery shows up in everything
            I build, from production trading infrastructure to side projects in C++.
          </p>
        </Reveal>

        <div className="grid gap-4">
          {focus.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="panel group p-5 transition-colors hover:border-line-strong">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold text-ink">{f.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
