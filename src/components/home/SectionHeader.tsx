import Link from "next/link";

// Encabezado editorial: eyebrow numerado, título grande, botón píldora con flecha.
export default function SectionHeader({
  title,
  description,
  href,
  linkLabel = "Ver todo",
  external = false,
  tone = "light",
  index,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
  tone?: "light" | "dark";
  index?: string;
}) {
  const dark = tone === "dark";
  const linkClass = `group inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
    dark
      ? "border-pava-cream/30 text-pava-cream hover:bg-pava-cream hover:text-pava-green"
      : "border-pava-brown/20 text-pava-brown hover:bg-pava-brown hover:text-pava-cream"
  }`;
  const arrow = (
    <span
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );

  return (
    <div className="lp-reveal mb-8 flex flex-col items-start gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="max-w-2xl">
        {index && (
          <span
            className={`mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${
              dark ? "text-pava-gold" : "text-pava-gold-deep"
            }`}
          >
            {index}
            <span
              aria-hidden
              className={`lp-accent block h-px w-12 ${dark ? "bg-pava-gold" : "bg-pava-gold-deep"}`}
            />
          </span>
        )}
        <h2
          className={`font-display text-4xl font-semibold leading-[0.95] tracking-[-0.02em] sm:text-5xl lg:text-6xl ${
            dark ? "text-pava-cream" : "text-pava-brown"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-lg text-[15px] leading-relaxed ${dark ? "text-pava-cream/70" : "text-pava-brown-mid/75"}`}
          >
            {description}
          </p>
        )}
      </div>
      {href &&
        (external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {linkLabel}
            {arrow}
          </a>
        ) : (
          <Link href={href} className={linkClass}>
            {linkLabel}
            {arrow}
          </Link>
        ))}
    </div>
  );
}
