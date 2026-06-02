import { skills } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section className="border-t border-line bg-surface/20 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading index="04 / stack" title="Toolkit" />
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.label} delay={(i % 3) * 0.06} className="bg-surface">
              <div className="h-full p-6">
                <h3 className="mono-label mb-4 text-faint">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-line bg-base/50 px-2.5 py-1 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
