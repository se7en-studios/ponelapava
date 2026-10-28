"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import CutText from "@/components/ui/CutText";

// Cierre de la home: la compra real pasa por WhatsApp, así que el último CTA va ahí.
// Banda verde del logo con el sticker de la charla matera pegado al costado.
export default function WhatsAppCTA() {
  const settings = useSiteSettings();

  return (
    <section className="paper-leaf relative text-pava-paper">
      <span aria-hidden className="torn-edge paper-leaf absolute inset-x-0 -top-[21px] z-10" />
      <div className="lp-reveal relative mx-auto flex max-w-7xl flex-col items-start gap-10 px-5 pb-28 pt-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:pb-32 lg:pt-20">
        <div className="flex items-center gap-6">
          <span className="relative hidden size-32 shrink-0 rotate-[-8deg] sm:block lg:size-40">
            <Image
              src="/redesign/sticker-whatsapp.png"
              alt=""
              fill
              sizes="160px"
              className="object-contain drop-shadow-[3px_4px_0_rgba(0,0,0,0.25)]"
            />
          </span>
          <div className="max-w-xl">
            <span className="font-script inline-block -rotate-2 text-2xl text-pava-gold">
              asesoramiento sin cargo
            </span>
            <h2 className="font-display mt-1 text-[2.6rem] uppercase leading-[0.92] sm:text-6xl">
              <CutText text="¿No sabés cuál elegir?" seed={11} />
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-pava-paper/85 sm:text-lg">
              Contanos cómo tomás mate y te armamos la combinación de yerba, mate y bombilla.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={whatsappChatUrl(settings.whatsappNumber, "¡Hola Poné La Pava! Quiero que me asesoren para elegir.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-paper btn-paper--cream"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Escribinos
            <span aria-hidden>→</span>
          </a>
          <Link href="/catalogo" className="btn-paper btn-paper--mustard">
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
