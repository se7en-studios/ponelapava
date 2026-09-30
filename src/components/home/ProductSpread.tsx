import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import PanoramicSpread, { type SpreadItem } from "@/components/ui/PanoramicSpread";

const MAX_CARDS = 8;
const MIN_CARDS = 5;

export default async function ProductSpread() {
  const products = await getProducts();
  // En stock primero; una foto por card (varios productos comparten imagen).
  const seen = new Set<string>();
  const items: SpreadItem[] = [...products]
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
    .filter((p) => {
      const src = p.images?.[0];
      if (!src || seen.has(src)) return false;
      seen.add(src);
      return true;
    })
    .slice(0, MAX_CARDS)
    .map((p) => ({
      src: p.images[0],
      alt: p.name,
      href: `/producto/${p.id}`,
      label: p.name,
      price: formatPrice(p.price),
    }));

  if (items.length < MIN_CARDS) return null;

  return (
    <PanoramicSpread
      items={items}
      eyebrow="La colección"
      title="Todo para tu ronda."
      description="Mates, yerbas, termos y bombillas elegidos uno por uno en el local."
      ctaHref="/catalogo"
      ctaLabel="Ver catálogo"
    />
  );
}
