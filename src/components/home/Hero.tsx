"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingHero } from "@/types/landing";
import { DEFAULT_LANDING_CONTENT } from "@/lib/landing";

// Hero de tienda: foto a sangre, texto chico abajo a la izquierda, un CTA.
// El H1 es el elemento LCP: se pinta sin esperar hidratación.
export default function Hero({ content }: { content?: LandingHero }) {
  const hero = content || DEFAULT_LANDING_CONTENT.hero;
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    setAllowVideo(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const title = [hero.titleLine1, hero.titleLine2, hero.titleLine3]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="inicio"
      className="focus-ring-gold relative flex min-h-[88svh] flex-col overflow-hidden bg-pava-green-dark"
      aria-label="Bienvenida a Poné La Pava"
    >
      {/* Imagen siempre montada debajo del video (ver CLAUDE.md: nunca `poster`) */}
      <div className="lp-hero-img-out absolute inset-0">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

      <div className="lp-hero-out relative z-10 mt-auto w-full px-5 pb-12 pt-40 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="lp-rise font-display max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title || "El ritual del mate es tuyo."}
          </h1>
          <p style={{ animationDelay: "150ms" }} className="lp-rise mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {hero.subtitle ||
              "Yerbas seleccionadas, mates artesanales y accesorios para acompañar cada ronda."}
          </p>
          <div style={{ animationDelay: "300ms" }} className="lp-rise mt-7 flex flex-wrap items-center gap-5">
            <Link
              href={hero.ctaPrimaryLink || "/catalogo"}
              id="hero-cta-catalogo"
              className="group inline-flex items-center gap-2 rounded-control bg-pava-cream px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-pava-green transition-colors hover:bg-white"
            >
              {hero.ctaPrimaryText || "Comprar ahora"}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            {hero.ctaSecondaryText && (
              <Link
                href={hero.ctaSecondaryLink || "/#el-local"}
                id="hero-cta-secundario"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-white underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white"
              >
                {hero.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
