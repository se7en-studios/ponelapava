import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/catalog/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";

// Agotados solo para completar la grilla mientras se carga stock.
const MIN_CARDS = 4;
const MAX_CARDS = 8;

export default async function FeaturedProducts() {
  // En stock primero, así un agotado no le saca el lugar a uno disponible.
  const featured = await getFeaturedProducts();
  const inStock = featured.filter((p) => p.stock > 0);
  const soldOut = featured.filter((p) => p.stock <= 0);
  const displayed = [
    ...inStock,
    ...soldOut.slice(0, Math.max(0, MIN_CARDS - inStock.length)),
  ].slice(0, MAX_CARDS);

  if (displayed.length === 0) return null;

  return (
    <section
      id="productos-destacados"
      className="paper-cream relative pb-20 pt-14 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          index="01 — Destacados"
          title="Lo más elegido"
          description="Yerbas, mates y accesorios elegidos para usar todos los días."
          href="/catalogo"
        />
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 pt-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-y-12">
          {displayed.map((product, i) => (
            <div
              key={product.id}
              className="w-[48vw] max-w-[15rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
              style={{ transform: `rotate(${["-0.8deg", "0.6deg", "-0.4deg", "0.9deg"][i % 4]})` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
