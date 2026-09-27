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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
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
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white sm:bottom-4 sm:left-4 sm:text-base">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
