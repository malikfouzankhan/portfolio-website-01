import Reveal from "./Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  /** First line renders solid, second line renders as an outline. */
  title: string;
  titleOutline?: string;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  titleOutline,
  className = "",
}: SectionHeaderProps) {
  return (
    <Reveal as="header" className={`mb-10 md:mb-16 ${className}`}>
      <div className="mb-4 flex items-center gap-6">
        <span aria-hidden className="h-px w-15 shrink-0 bg-accent-ink" />
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent-ink">{eyebrow}</span>
      </div>
      <h2 className="font-display text-[clamp(2.5rem,10vw,6rem)] leading-[0.95] text-text">
        {title}
        {titleOutline && (
          <>
            <br />
            <span className="text-outline">{titleOutline}</span>
          </>
        )}
      </h2>
    </Reveal>
  );
}
