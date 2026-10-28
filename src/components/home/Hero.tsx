import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingHero } from "@/types/landing";
import { DEFAULT_LANDING_CONTENT } from "@/lib/landing";
import CutText from "@/components/ui/CutText";

export interface HeroSpotlight {
  id: string;
  name: string;
  price: string;
  image: string;
}

// Hero artesanal: mesa de kraft con mate, pava y yerba (foto generada en
// Google Flow) y el título armado con letras recortadas, como el logo.
// En celular la foto va arriba y el texto abajo, para que no se pisen.
// El H1 es el elemento LCP: animación CSS pura y corta, sin esperar hidratación.
export default function Hero({
  content,
  spotlight,
}: {
  content?: LandingHero;
  spotlight?: HeroSpotlight | null;
}) {
  const hero = content || DEFAULT_LANDING_CONTENT.hero;
  const lines = [hero.titleLine1, hero.titleLine2, hero.titleLine3].filter(Boolean);
  const titleLines = lines.length > 0 ? lines : ["El ritual", "del mate", "es tuyo."];
  const last = titleLines.length - 1;
  let letterOffset = 0;

  return (
    <section
      id="inicio"
      className="paper-kraft paper-kraft--cover relative flex flex-col overflow-hidden lg:min-h-[100svh]"
      aria-label="Bienvenida a Poné La Pava"
    >
      <div className="relative mt-[108px] h-[74vw] max-h-[460px] w-full lg:absolute lg:mt-0 lg:inset-0 lg:h-auto lg:max-h-none">
        <Image
          src="/redesign/hero-kraft.jpg"
          alt="Mate de cuero con bombilla, pava de aluminio y yerba suelta sobre papel kraft"
          fill
          priority
          quality={82}
          className="object-cover object-[82%_50%] lg:object-[70%_50%]"
          sizes="100vw"
        />
        {/* En celular la foto termina en un borde de papel rasgado, como un
            recorte pegado sobre el kraft, en vez de un corte recto. */}
        <span aria-hidden className="torn-edge paper-kraft absolute inset-x-0 -bottom-px z-10 lg:hidden" />
      </div>

      <div className="relative z-10 w-full px-5 pb-16 pt-2 sm:px-8 lg:mt-auto lg:px-10 lg:pb-24 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-[40rem]">
            <a
              href="#resenas"
              style={{ "--r": "-3deg", "--d": "80ms" } as CSSProperties}
              className="sticker-in cutout font-script relative z-20 -mt-4 mb-5 inline-flex lg:mt-0 items-center gap-2 rounded-[4px] bg-pava-paper px-3 py-1.5 text-[15px] text-pava-ink"
            >
              <span aria-hidden className="tracking-[0.08em] text-pava-gold">
                ★★★★★
              </span>
              5,0 en Google · local en Catriel
            </a>

            <h1 className="font-display text-[4.25rem] uppercase leading-[0.88] text-pava-ink min-[400px]:text-[4.6rem] sm:text-[5.2rem] lg:text-[6.6rem] xl:text-[7.4rem]">
              {titleLines.map((line, i) => {
                const start = letterOffset;
                letterOffset += line.length;
                const isLast = i === last && titleLines.length > 1;
                return (
                  <span key={i} className="block">
                    {isLast ? (
                      <span
                        className="paper-chip mt-2 bg-pava-leaf text-pava-paper"
                        style={{ transform: "rotate(-2.5deg)" }}
                      >
                        <CutText text={line} animate seed={start} delayMs={start * 28} />
                      </span>
                    ) : (
                      <CutText text={line} animate seed={start} delayMs={start * 28} />
                    )}
                  </span>
                );
              })}
            </h1>

            <p className="font-script mt-4 hidden items-center gap-2 text-2xl text-pava-ink/85 lg:inline-flex">
              y de toda la ronda
              <svg width="88" height="34" viewBox="0 0 88 34" fill="none" aria-hidden>
                <path
                  d="M2 22c18-14 40-19 66-9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M60 5l10 8-11 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>

            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-pava-ink/85 lg:mt-3 lg:text-lg">
              {hero.subtitle ||
                "Yerbas seleccionadas, mates artesanales y accesorios para acompañar cada ronda."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href={hero.ctaPrimaryLink || "/catalogo"}
                id="hero-cta-catalogo"
                className="btn-paper btn-paper--leaf justify-center sm:justify-start"
              >
                {hero.ctaPrimaryText || "Comprar ahora"}
                <span aria-hidden>→</span>
              </Link>
              {hero.ctaSecondaryText && (
                <Link
                  href={hero.ctaSecondaryLink || "/#el-local"}
                  id="hero-cta-secundario"
                  className="btn-paper btn-paper--cream justify-center sm:justify-start"
                >
                  {hero.ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {spotlight && (
        <Link
          href={`/producto/${spotlight.id}`}
          style={{ "--r": "4deg", "--d": "700ms" } as CSSProperties}
          className="sticker-in group absolute bottom-[9%] left-[50%] z-10 hidden w-52 bg-[#fbf8f1] p-2.5 pb-3 shadow-[3px_6px_0_rgba(31,58,43,0.28)] transition-transform hover:-translate-y-1 lg:block xl:left-[48%]"
        >
          <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
          <span className="relative block aspect-square overflow-hidden bg-pava-cream-dark">
            <Image
              src={spotlight.image}
              alt={spotlight.name}
              fill
              sizes="208px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </span>
          <span className="font-script mt-2 block text-[15px] leading-tight text-pava-leaf-dark">
            elegido de la semana
          </span>
          <span className="mt-0.5 flex items-end justify-between gap-2 text-pava-ink">
            <span className="truncate text-[13px] font-medium">{spotlight.name}</span>
            <span className="font-display shrink-0 text-lg leading-none">{spotlight.price}</span>
          </span>
        </Link>
      )}

      <span aria-hidden className="torn-edge paper-cream absolute inset-x-0 bottom-0 z-20" />
    </section>
  );
}
