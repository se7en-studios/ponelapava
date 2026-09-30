import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import AboutSection from "@/components/home/AboutSection";
import GoogleReviews from "@/components/home/GoogleReviews";
import LocalSection from "@/components/home/LocalSection";
import InstagramSection from "@/components/home/InstagramSection";
import ShopTheLook from "@/components/home/ShopTheLook";
import ProductSpread from "@/components/home/ProductSpread";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import { getLandingContent } from "@/lib/landing";
import { getProducts } from "@/lib/products";

// Widget cliente bajo el pliegue — code-split para no competir con el Hero.
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));

// Products and landing content come from Supabase and are editable from /admin — revalidate
// periodically instead of baking them in at build time.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Poné La Pava — Yerbas, Mates y Accesorios Premium",
  description:
    "Especialistas en la cultura del mate. Yerbas seleccionadas, mates artesanales, termos, bombillas y todo lo que necesitás para el mate perfecto. Local físico y envíos.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [landing, products] = await Promise.all([getLandingContent(), getProducts()]);

  return (
    <>
      <div aria-hidden className="lp-progress" />
      <Hero content={landing.hero} />
      <TrustBar announcements={landing.announcements} />
      <FeaturedProducts />
      <Categories />
      <ProductSpread />
      <ShopTheLook products={products} />
      <AboutSection content={landing.about} />
      <GoogleReviews reviews={landing.reviews} />
      <LocalSection content={landing.local} />
      <InstagramSection posts={landing.galleryPosts} />
      <RecentlyViewed products={products} />
      <FAQSection faqs={landing.faqs} />
    </>
  );
}
