import Link from "next/link";
import CutText from "@/components/ui/CutText";

// Encabezado artesanal: anotación a mano arriba, título con letras recortadas
// y botón de papel. `index` llega como "02 — Categorías": se usa la parte de
// texto como nota manuscrita.
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
  const note = index?.split(/—|-/).pop()?.trim().toLowerCase();
  const linkClass = `btn-paper shrink-0 ${dark ? "btn-paper--mustard" : "btn-paper--cream"}`;
  const arrow = <span aria-hidden>→</span>;

  return (
    <div className="lp-reveal mb-10 flex flex-col items-start gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {note && (
          <span
            className={`font-script mb-2 inline-block -rotate-2 text-xl ${dark ? "text-pava-gold" : "text-pava-leaf"}`}
          >
            {note} ↓
          </span>
        )}
        <h2
          className={`font-display text-[2.8rem] uppercase leading-[0.92] sm:text-6xl lg:text-7xl ${
            dark ? "text-pava-paper" : "text-pava-ink"
          }`}
        >
          <CutText text={title} seed={title.length} />
        </h2>
        {description && (
          <p className={`mt-4 max-w-lg text-[16px] leading-relaxed ${dark ? "text-pava-paper/75" : "text-pava-ink/70"}`}>
            {description}
          </p>
        )}
      </div>
      {href &&
        (external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
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
