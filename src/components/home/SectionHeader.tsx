import Link from "next/link";

// Encabezado de sección tipo tienda: título a la izquierda, "Ver todo" a la
// derecha. Mismo patrón en todas las secciones de la home.
export default function SectionHeader({
  title,
  description,
  href,
  linkLabel = "Ver todo",
  external = false,
  tone = "light",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const linkClass = `inline-flex shrink-0 items-center rounded-control border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
    dark
      ? "border-pava-cream/30 text-pava-cream hover:bg-pava-cream hover:text-pava-green"
      : "border-pava-brown/20 text-pava-brown hover:bg-pava-brown hover:text-pava-cream"
  }`;

  return (
    <div className="lp-reveal mb-8 flex items-end justify-between gap-6 sm:mb-10">
      <div className="max-w-xl">
        <h2
          className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${
            dark ? "text-pava-cream" : "text-pava-brown"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-2 text-sm leading-relaxed ${
              dark ? "text-pava-cream/70" : "text-pava-brown-mid/75"
            }`}
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
          </a>
        ) : (
          <Link href={href} className={linkClass}>
            {linkLabel}
          </Link>
        ))}
    </div>
  );
}
