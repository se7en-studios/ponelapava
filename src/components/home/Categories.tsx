import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/categories";
import SectionHeader from "@/components/home/SectionHeader";

// Bento sobre verde: la primera categoría ocupa 2×2, el resto en tarjetas chicas.
// Si la última queda sola en su fila, se estira para que no quede un hueco.
function tileSpan(i: number, n: number): string {
  if (i === 0) return "col-span-2 row-span-2";
  if (i !== n - 1) return "";
  const rest = n - 1;
  const mobile = rest % 2 === 1 ? "col-span-2" : "";
  const desktop = rest % 4 === 1 ? "lg:col-span-4" : rest % 4 === 3 ? "lg:col-span-2" : "lg:col-span-1";
  return `${mobile} ${desktop}`;
}
// Fotos de categoría del rediseño (Google Flow, misma mesa de papel que el
// hero). Si una categoría nueva no está acá, usa la imagen cargada en /admin.
const ART: Record<string, string> = {
  yerbas: "/redesign/cat-yerbas.jpg",
  mates: "/redesign/cat-mates.jpg",
  bombillas: "/redesign/cat-bombillas.jpg",
  termos: "/redesign/cat-termos.jpg",
  accesorios: "/redesign/cat-accesorios.jpg",
  combos: "/redesign/cat-combos.jpg",
};
const TILT = ["-1.2deg", "1.4deg", "-0.8deg", "1deg", "-1.5deg", "0.7deg", "-0.6deg"];

export default async function Categories() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="paper-green relative pb-20 pt-24 sm:pb-24 lg:pb-28 lg:pt-28">
      <span aria-hidden className="torn-edge paper-cream absolute inset-x-0 top-0 torn-edge--down" />
      <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          index="02 — Categorías"
          title="Comprá por categoría"
          href="/catalogo"
          linkLabel="Ver catálogo"
          tone="dark"
        />
        <div className="lp-stagger grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[14rem] sm:gap-5 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const img = ART[cat.slug?.toLowerCase()] || cat.image;
            return (
              <Link
                key={cat.id}
                href={`/catalogo?cat=${cat.slug}`}
                style={{ transform: `rotate(${TILT[i % TILT.length]})` }}
                className={`group relative block bg-[#fbf8f1] p-1.5 shadow-[3px_5px_0_rgba(0,0,0,0.35)] transition-transform duration-300 hover:!rotate-0 hover:-translate-y-1 sm:p-2 ${tileSpan(i, categories.length)}`}
              >
                <span className="relative block h-full w-full overflow-hidden bg-pava-cream-dark">
                  {img && (
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    />
                  )}
                </span>
                <span
                  className={`paper-chip font-display absolute bottom-3 left-3 bg-pava-paper uppercase leading-none text-pava-ink sm:bottom-4 sm:left-4 ${
                    i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
                  }`}
                  style={{ transform: `rotate(${i % 2 ? "2deg" : "-2deg"})` }}
                >
                  {cat.name}
                </span>
                <span
                  aria-hidden
                  className="font-display absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-pava-gold text-xl text-pava-ink shadow-[2px_2px_0_#1f3a2b] transition-transform duration-300 group-hover:rotate-[-20deg] sm:right-4 sm:top-4"
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
