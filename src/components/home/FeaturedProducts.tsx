import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/catalog/ProductCard";
import SectionHeader from "@/components/home/SectionHeader";

export default async function FeaturedProducts() {
  // En stock primero, así un agotado no le saca el lugar a uno disponible.
  const displayed = [...(await getFeaturedProducts())]
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
    .slice(0, 8);

  if (displayed.length === 0) return null;

  return (
    <section
      id="productos-destacados"
      className="bg-pava-cream py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          title="Destacados"
          description="Yerbas, mates y accesorios elegidos para usar todos los días."
          href="/catalogo"
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 lg:gap-y-10">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
