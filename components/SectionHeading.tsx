import Reveal from "./Reveal";

type Props = {
  index: string;
  title: string;
  kicker?: string;
};

export default function SectionHeading({ index, title, kicker }: Props) {
  return (
    <Reveal className="mb-10 sm:mb-14">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-accent">{index}</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {kicker ? (
        <p className="mt-3 max-w-2xl text-muted">{kicker}</p>
      ) : null}
    </Reveal>
  );
}
