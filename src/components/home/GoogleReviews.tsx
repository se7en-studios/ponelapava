import type React from "react";
import { Star } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { LandingReviewItem } from "@/types/landing";
import CutText from "@/components/ui/CutText";

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

const NOTE_COLORS = ["bg-[#fbf8f1]", "bg-[#f4e9c8]", "bg-[#e3ead9]"];
const NOTE_TILT = ["-2deg", "1.5deg", "-1deg", "2.5deg"];

// Reseña como nota de papel pegada con cinta sobre el kraft.
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const rating = review.rating || 5;
  return (
    <figure
      className={`relative w-52 px-4 pb-4 pt-5 text-pava-ink shadow-[3px_4px_0_rgba(31,58,43,0.28)] ${NOTE_COLORS[index % NOTE_COLORS.length]}`}
      style={{ transform: `rotate(${NOTE_TILT[index % NOTE_TILT.length]})` }}
    >
      <span aria-hidden className="tape -top-3 left-1/2 w-16 -translate-x-1/2 rotate-[-4deg]" />
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="font-display flex size-9 shrink-0 items-center justify-center rounded-full bg-pava-gold text-lg uppercase text-pava-ink shadow-[1px_2px_0_#1f3a2b]"
        >
          {review.name.trim()[0]}
        </span>
        <div className="min-w-0">
          <figcaption className="truncate text-sm font-semibold">{review.name}</figcaption>
          <div className="flex items-center gap-0.5 text-pava-gold-deep" aria-label={`${rating} de 5 estrellas`}>
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            ))}
            {review.time && <span className="ml-1 text-[10px] text-pava-ink/55">{review.time}</span>}
          </div>
        </div>
      </div>
      <blockquote className="font-script mt-3 text-[17px] leading-snug text-pava-ink/90">
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
    <section id="resenas" className="paper-kraft paper-kraft--cover relative scroll-mt-24 overflow-x-clip py-16 sm:py-24 lg:py-28">
      <span aria-hidden className="torn-edge paper-kraft absolute inset-x-0 -top-[21px] z-10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lp-reveal min-w-0 lg:col-span-5">
            <span className="font-script inline-block -rotate-2 text-2xl text-pava-ink/80">reseñas ↓</span>
            <p className="font-display flex items-start leading-none text-pava-ink">
              <span className="text-[8rem] sm:text-[11rem]">
                <CutText text="5,0" seed={2} />
              </span>
              <span className="ml-3 mt-7 flex flex-col gap-2 sm:mt-10">
                <span className="flex gap-1 text-pava-gold [filter:drop-shadow(1px_2px_0_#1f3a2b)]" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={26} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </span>
                <span className="font-script text-2xl text-pava-ink/80">en Google</span>
              </span>
            </p>
            <p
              className="cutout mt-6 inline-block max-w-sm bg-pava-paper px-4 py-3 text-lg leading-snug text-pava-ink sm:text-xl"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              &ldquo;Lo que dicen quienes ya compraron en el local.&rdquo;
            </p>
            <div className="mt-9">
              <a href={GOOGLE_PLACE_URL} target="_blank" rel="noopener noreferrer" className="btn-paper btn-paper--cream">
                Ver reseñas en Google <span aria-hidden>→</span>
              </a>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7">
            {/* Celular: una tira horizontal a todo el ancho. La columna
                vertical quedaba angosta y con mucho kraft vacío alrededor. */}
            <div className="-mx-5 sm:hidden" aria-label="Reseñas de clientes en Google">
              <Marquee
                pauseOnHover
                repeat={3}
                style={{ "--duration": "40s", "--gap": "1.25rem" } as React.CSSProperties}
                className="py-6"
              >
                {items.map((r, i) => (
                  <ReviewCard key={r.id} review={r} index={i} />
                ))}
              </Marquee>
            </div>
            <div
              className="relative hidden h-[24rem] w-full justify-center sm:flex gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] sm:h-[34rem]"
              aria-label="Reseñas de clientes en Google"
            >
              {COLUMNS.map((col, c) => (
                <div key={c} aria-hidden={c > 0 || undefined} className={c === 0 ? "flex" : c === 1 ? "hidden min-[460px]:flex" : c === 2 ? "hidden lg:flex" : "hidden"}>
                  <Marquee
                    vertical
                    pauseOnHover
                    reverse={c % 2 === 1}
                    repeat={3}
                    style={{ "--duration": col.duration, "--gap": "1.6rem" } as React.CSSProperties}
                    className="px-2 py-4"
                  >
                    {rotate(items, c).map((r, i) => (
                      <ReviewCard key={r.id} review={r} index={i + c} />
                    ))}
                  </Marquee>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
