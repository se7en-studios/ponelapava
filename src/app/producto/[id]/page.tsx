import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, getProducts, getRelatedProducts } from "@/lib/products";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import ProductDetail from "@/components/product/ProductDetail";
import { SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/producto/${product.id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0], alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [related, products] = await Promise.all([getRelatedProducts(product, 4), getProducts()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/producto/${product.id}`,
      priceCurrency: "ARS",
      price: product.price,
      availability:
        product.status === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetail product={product} related={related} />
      <RecentlyViewed products={products} currentId={product.id} />
    </>
  );
}
