import { metrics } from "@/lib/data";
import Counter from "./Counter";
import Reveal from "./Reveal";

export default function MetricsStrip() {
  return (
    <section aria-label="Key metrics" className="border-y border-line bg-surface/40">
      <div className="shell grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
        {metrics.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className={`px-2 py-8 sm:px-6 ${i % 2 === 0 ? "border-r border-line md:border-r-0" : ""} ${
              i < 2 ? "border-b border-line md:border-b-0" : ""
            }`}
          >
            <div className="font-mono text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              <Counter
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals ?? 0}
              />
            </div>
            <div className="mt-2 text-sm font-medium text-ink">{m.label}</div>
            <div className="mt-0.5 text-xs text-faint">{m.sub}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
