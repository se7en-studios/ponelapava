import { Star } from "lucide-react";
import SectionHeader from "@/components/home/SectionHeader";
import { LandingReviewItem } from "@/types/landing";

const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/place/Pon%C3%A9+la+pava/@-37.8839523,-67.8090713,14.62z/data=!4m8!3m7!1s0x960acb005520266d:0x9a1a68896ad3d5a9!8m2!3d-37.8827105!4d-67.7981453!9m1!1b1!16s%2Fg%2F11mlfl_28d";

// Reseñas escritas reales de Google Maps (fallback si /admin no cargó ninguna).
const DEFAULT_REVIEWS = [
  {
    id: "cc",
    name: "Cristian Casagrande",
    time: "Hace 8 meses",
    text: "Productos de calidad, excelente atención.",
    rating: 5,
  },
  {
    id: "vr",
    name: "Victoria Ruiz",
    time: "Hace 3 meses",
    text: "Sitio impecable, atención esmerada de Pilar; todo lo que se necesita para un buen Mate; excelente!!!",
    rating: 5,
  },
];

export default function GoogleReviews({
  reviews,
}: {
  reviews?: LandingReviewItem[];
}) {
  const items = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <section className="bg-pava-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          title="5,0 en Google"
          description="Lo que dicen quienes ya compraron en el local."
          href={GOOGLE_PLACE_URL}
          linkLabel="Ver reseñas"
          external
        />
        <div className="lp-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((r) => (
            <figure
              key={r.id}
              className="rounded-control bg-pava-cream-dark p-6"
            >
              <div
                className="flex gap-0.5 text-pava-gold-deep"
                aria-label={`${r.rating || 5} de 5 estrellas`}
              >
                {Array.from({ length: r.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="font-display mt-4 text-lg leading-snug text-pava-brown">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-pava-brown-mid/70">
                {r.name}
                {r.time && ` · ${r.time}`}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
