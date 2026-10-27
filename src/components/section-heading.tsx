export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
  id?: string;
}) {
  const eyebrowClass = tone === "light" ? "text-bronze" : "text-gold";
  const titleClass = tone === "light" ? "text-ink" : "text-ivory";
  const introClass = tone === "light" ? "text-ink-soft" : "text-mist";

  return (
    <div className="max-w-2xl">
      <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${eyebrowClass}`}>
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-4 text-balance text-[clamp(2.05rem,4vw,3.35rem)] font-medium leading-[1.05] tracking-[-0.035em] ${titleClass}`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 max-w-xl text-pretty text-base leading-relaxed ${introClass}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
