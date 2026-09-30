"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { useSiteSettings } from "@/context/SiteSettingsContext";

// Cierre de la home: la compra real pasa por WhatsApp, así que el último CTA va ahí.
export default function WhatsAppCTA() {
  const settings = useSiteSettings();

  return (
    <section className="bg-pava-green-dark text-pava-cream">
      <div className="lp-reveal mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
        <div className="max-w-xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pava-gold">
            Asesoramiento sin cargo
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            ¿No sabés cuál elegir?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-pava-cream/75 sm:text-base">
            Contanos cómo tomás mate y te armamos la combinación de yerba, mate y bombilla.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={whatsappChatUrl(settings.whatsappNumber, "¡Hola Poné La Pava! Quiero que me asesoren para elegir.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-control bg-pava-cream px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-pava-green transition-colors hover:bg-white"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Escribinos
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <Link
            href="/catalogo"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-pava-cream underline decoration-pava-cream/40 underline-offset-[6px] transition-colors hover:decoration-pava-cream"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
