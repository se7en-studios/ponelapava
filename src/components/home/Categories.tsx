import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/categories";
import SectionHeader from "@/components/home/SectionHeader";

export default async function Categories() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="bg-pava-cream pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          title="Comprá por categoría"
          href="/catalogo"
          linkLabel="Ver catálogo"
        />
        <div className="lp-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?cat=${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-control bg-pava-green"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-black/40 sm:bottom-4 sm:left-4 sm:text-sm">
                {cat.name}
                <span aria-hidden className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
