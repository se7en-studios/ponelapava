import type React from "react";
import { Star } from "lucide-react";
import SectionHeader from "@/components/home/SectionHeader";
import { Marquee } from "@/components/ui/Marquee";
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

type Review = Pick<LandingReviewItem, "id" | "name" | "time" | "text" | "rating">;

// Duraciones distintas por columna para que no se muevan en bloque.
const COLUMNS = [{ duration: "38s" }, { duration: "46s" }, { duration: "42s" }, { duration: "50s" }];

// Cada columna arranca en otra reseña, así con pocas no se ven filas idénticas.
function rotate<T>(list: T[], by: number): T[] {
  const n = by % list.length;
  return [...list.slice(n), ...list.slice(0, n)];
}

function ReviewCard({ review }: { review: Review }) {
  const rating = review.rating || 5;
  return (
    <figure className="w-56 rounded-control border border-pava-brown/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pava-green font-display text-sm font-semibold text-pava-cream"
        >
          {review.name.trim()[0]}
        </span>
        <div className="min-w-0">
          <figcaption className="truncate text-sm font-medium text-pava-brown">
            {review.name}
          </figcaption>
          <div
            className="flex items-center gap-0.5 text-pava-gold-deep"
            aria-label={`${rating} de 5 estrellas`}
          >
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            ))}
            {review.time && (
              <span className="ml-1 text-[10px] text-pava-brown-mid/60">{review.time}</span>
            )}
          </div>
        </div>
      </div>
      <blockquote className="mt-3 text-sm leading-snug text-pava-brown-mid">
        &ldquo;{review.text}&rdquo;
      </blockquote>
    </figure>
  );
}

export default function GoogleReviews({
  reviews,
}: {
  reviews?: LandingReviewItem[];
}) {
  const items: Review[] = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

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
        <div
          className="relative flex h-[30rem] w-full items-center justify-center overflow-hidden rounded-control [perspective:300px] sm:h-[34rem]"
          aria-label="Reseñas de clientes en Google"
        >
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-60px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            {COLUMNS.map((col, c) => (
              <Marquee
                key={c}
                vertical
                pauseOnHover
                reverse={c % 2 === 1}
                repeat={3}
                style={{ "--duration": col.duration } as React.CSSProperties}
                className={c > 1 ? "hidden sm:flex" : undefined}
              >
                {rotate(items, c).map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </Marquee>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-pava-cream" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-pava-cream" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-pava-cream" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-pava-cream" />
        </div>
      </div>
    </section>
  );
}
