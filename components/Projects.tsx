import { projects, type Project } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { ArrowUpRight } from "./icons";

export default function Projects() {
  const feature = projects.find((p) => p.proprietary) ?? projects[0];
  const rest = projects.filter((p) => p !== feature);

  return (
    <section id="systems" className="shell scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        index="03 / systems"
        title="Systems & projects"
        kicker="Production trading infrastructure and low-latency engineering, from microsecond matching to multi-agent reasoning."
      />

      <Reveal>
        <FeatureCard project={feature} />
      </Reveal>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded border border-line bg-base/60 px-2 py-0.5 font-mono text-[11px] text-muted"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function LinkChip({ project }: { project: Project }) {
  if (project.proprietary) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
        Proprietary
      </span>
    );
  }
  if (!project.href) return null;
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
    >
      View source
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

function FeatureCard({ project }: { project: Project }) {
  return (
    <TiltCard
      as="article"
      tilt={4}
      className="panel group relative overflow-hidden p-6 transition-colors hover:border-accent/40 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/[0.06] blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Flagship
            </span>
            <LinkChip project={project} />
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {project.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-faint">{project.kind}</p>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{project.blurb}</p>
          <div className="mt-6">
            <Tags tags={project.tags} />
          </div>
        </div>

        <ul className="grid content-center gap-3 rounded-lg border border-line bg-base/40 p-5">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-bid" aria-hidden />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard
      as="article"
      className="panel group relative flex h-full flex-col p-5 transition-colors hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-accent">
            {project.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-faint">{project.kind}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.blurb}</p>

      <ul className="mt-4 space-y-2">
        {project.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2.5 text-[13px] leading-snug text-faint">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-bid/70" aria-hidden />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <Tags tags={project.tags.slice(0, 3)} />
        <LinkChip project={project} />
      </div>
    </TiltCard>
  );
}
