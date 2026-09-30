"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingHero } from "@/types/landing";
import { DEFAULT_LANDING_CONTENT } from "@/lib/landing";

export interface HeroSpotlight {
  id: string;
  name: string;
  price: string;
  image: string;
}

// Hero editorial: foto a sangre a pantalla completa, título gigante línea por
// línea (la última en itálica dorada) y un producto real flotando a la derecha.
// El H1 es el elemento LCP: animación CSS pura, se pinta sin esperar hidratación.
export default function Hero({
  content,
  spotlight,
}: {
  content?: LandingHero;
  spotlight?: HeroSpotlight | null;
}) {
  const hero = content || DEFAULT_LANDING_CONTENT.hero;
  const [allowVideo, setAllowVideo] = useState(false);

  // Video solo desde tablet, sin Save-Data y después del load: en celu eran
  // 2 MB compitiendo con el primer render.
  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 768px)").matches &&
      !conn?.saveData;
    if (!ok) return;
    const start = () => setAllowVideo(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  const lines = [hero.titleLine1, hero.titleLine2, hero.titleLine3].filter(
    Boolean,
  );
  const titleLines =
    lines.length > 0 ? lines : ["El ritual", "del mate", "es tuyo."];

  return (
    <section
      id="inicio"
      className="focus-ring-gold relative flex min-h-[100svh] flex-col overflow-hidden bg-pava-green-dark"
      aria-label="Bienvenida a Poné La Pava"
    >
      <div className="lp-hero-img-out absolute inset-0">
        {/* Imagen siempre montada debajo del video (ver CLAUDE.md: nunca poster) */}
        <Image
          src={hero.backgroundImage || "/hero_background_1786545961305.png"}
          alt=""
          fill
          priority
          quality={92}
          className="lp-kenburns object-cover object-center"
          sizes="100vw"
        />
        {allowVideo && hero.videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src={hero.videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="lp-hero-out relative z-10 mt-auto w-full px-5 pb-14 pt-40 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-10">
          <div className="max-w-4xl">
            <a
              href="#resenas"
              className="lp-rise mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/35"
            >
              <span aria-hidden className="tracking-[0.1em] text-pava-gold">
                ★★★★★
              </span>
              5,0 en Google · Local en Catriel
            </a>
            <h1 className="font-display text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.02em] text-white sm:text-7xl lg:text-[7.5rem]">
              {titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <span
                    className={`hero-line-in block ${i === titleLines.length - 1 && titleLines.length > 1 ? "italic text-pava-gold" : ""}`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p
              style={{ animationDelay: "380ms" }}
              className="lp-rise mt-6 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg"
            >
              {hero.subtitle ||
                "Yerbas seleccionadas, mates artesanales y accesorios para acompañar cada ronda."}
            </p>
            <div
              style={{ animationDelay: "500ms" }}
              className="lp-rise mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href={hero.ctaPrimaryLink || "/catalogo"}
                id="hero-cta-catalogo"
                className="group inline-flex items-center gap-3 rounded-full bg-pava-cream py-2 pl-7 pr-2 text-xs font-semibold uppercase tracking-[0.14em] text-pava-green transition-colors hover:bg-white"
              >
                {hero.ctaPrimaryText || "Comprar ahora"}
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full bg-pava-green text-pava-cream transition-transform duration-300 group-hover:-rotate-45"
                >
                  →
                </span>
              </Link>
              {hero.ctaSecondaryText && (
                <Link
                  href={hero.ctaSecondaryLink || "/#el-local"}
                  id="hero-cta-secundario"
                  className="inline-flex items-center rounded-full border border-white/35 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  {hero.ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>

          {spotlight && (
            <Link
              href={`/producto/${spotlight.id}`}
              style={{ animationDelay: "650ms" }}
              className="lp-rise group hidden w-64 shrink-0 rounded-2xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur-xl transition-colors hover:bg-white/15 lg:block"
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-pava-cream-dark">
                <Image
                  src={spotlight.image}
                  alt={spotlight.name}
                  fill
                  sizes="256px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </span>
              <span className="mt-3 flex items-end justify-between gap-3 px-1 pb-1">
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-pava-gold">
                    Elegido de la semana
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium">
                    {spotlight.name}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold">
                  {spotlight.price}
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="lp-hero-out absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60 sm:flex"
      >
        Scroll
        <span className="block h-10 w-px overflow-hidden bg-white/20">
          <span className="lp-scroll-cue block h-1/2 w-full bg-white/80" />
        </span>
      </div>
    </section>
  );
}
