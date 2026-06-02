import { experience, education } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-line bg-surface/20 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="02 / work"
          title="Experience"
          kicker="Building and leading order management infrastructure at a proprietary trading firm."
        />

        <ol className="relative space-y-12 border-l border-line pl-6 sm:pl-10">
          {experience.map((job, i) => (
            <Reveal as="li" key={`${job.role}-${i}`} delay={i * 0.05} className="relative">
              <span
                className="absolute -left-[1.875rem] top-1.5 flex h-3 w-3 items-center justify-center sm:-left-[2.875rem]"
                aria-hidden
              >
                <span
                  className={`absolute inline-flex h-3 w-3 rounded-full animate-ping-soft ${
                    job.current ? "bg-bid/60" : "bg-accent/40"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full border-2 bg-base ${
                    job.current ? "border-bid shadow-glow-bid" : "border-line-strong"
                  }`}
                />
              </span>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-ink">{job.role}</h3>
                  <p className="text-sm text-muted">
                    {job.company} · {job.location}
                  </p>
                </div>
                <span className="font-mono text-xs text-faint">{job.period}</span>
              </div>

              <ul className="mt-4 space-y-2.5">
                {job.points.map((p, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1} className="mt-12">
          <div className="panel flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">{education.school}</h3>
              <p className="text-sm text-muted">{education.degree}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-mono text-xs text-faint">{education.period}</p>
              <p className="text-sm text-muted">{education.detail}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
