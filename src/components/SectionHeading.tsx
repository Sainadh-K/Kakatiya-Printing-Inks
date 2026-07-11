interface SectionHeadingProps {
  eyebrow: string;
  titlePre: string;
  titleHighlight: string;
  body?: string;
  centered?: boolean;
  /** Use light-on-dark colours (for the dark corrugated section). */
  onDark?: boolean;
}

export function SectionHeading({
  eyebrow,
  titlePre,
  titleHighlight,
  body,
  centered = false,
  onDark = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`text-xs uppercase tracking-[0.25em] ${
          onDark ? "text-white/60" : "text-muted-foreground"
        }`}
      >
        {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        {titlePre}
        <span className="rainbow-text">{titleHighlight}</span>
      </h2>
      {body && (
        <p className={`mt-4 ${onDark ? "text-white/70" : "text-muted-foreground"}`}>{body}</p>
      )}
    </div>
  );
}
