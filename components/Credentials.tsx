import { credentials, type Credential } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { ArrowUpRight } from "./icons";

const tagColor: Record<string, string> = {
  SEBI: "text-accent border-accent/30",
  AWS: "text-amber border-amber/30",
  Research: "text-bid border-bid/30",
  Award: "text-amber border-amber/30",
};

export default function Credentials() {
  return (
    <section className="shell py-24 sm:py-32">
      <SectionHeading
        index="05 / credentials"
        title="Certifications & recognition"
        kicker="SEBI NISM derivatives certifications grounding the domain modeling, plus cloud, research, and awards."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {credentials.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.07}>
            <Card c={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Card({ c }: { c: Credential }) {
  const head = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex w-fit items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            tagColor[c.tag] ?? "text-muted border-line"
          }`}
        >
          {c.tag}
        </span>
        {c.href ? (
          <ArrowUpRight className="h-4 w-4 text-faint transition-colors group-hover:text-accent" />
        ) : null}
      </div>
      <h3 className="mt-3 text-base font-semibold text-ink transition-colors group-hover:text-accent">
        {c.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{c.detail}</p>
      {c.href ? (
        <span className="mt-3 font-mono text-[11px] uppercase tracking-wider text-faint">
          View credential
        </span>
      ) : null}
    </>
  );

  if (c.href) {
    return (
      <a
        href={c.href}
        target="_blank"
        rel="noreferrer noopener"
        className="panel group flex h-full flex-col p-5 transition-all hover:-translate-y-1 hover:border-accent/50"
      >
        {head}
      </a>
    );
  }

  return (
    <div className="panel group flex h-full flex-col p-5 transition-colors hover:border-line-strong">
      {head}
    </div>
  );
}
