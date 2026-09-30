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
export default async function Categories() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="grain-overlay relative bg-pava-green-dark py-20 sm:py-24 lg:py-28">
      <div className="relative z-[2] mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          index="02 — Categorías"
          title="Comprá por categoría"
          href="/catalogo"
          linkLabel="Ver catálogo"
          tone="dark"
        />
        <div className="lp-stagger grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] sm:gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/catalogo?cat=${cat.slug}`}
              className={`group relative block overflow-hidden rounded-2xl bg-pava-green ${tileSpan(i, categories.length)}`}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
                  sizes={
                    i === 0
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 1024px) 50vw, 25vw"
                  }
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <span
                  className={`font-display font-semibold leading-none text-white ${
                    i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
                  }`}
                >
                  {cat.name}
                </span>
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:-rotate-45 group-hover:bg-pava-cream group-hover:text-pava-green"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
