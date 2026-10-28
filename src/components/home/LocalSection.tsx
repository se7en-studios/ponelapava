import Image from "next/image";
import { MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import StoreLivePill from "@/components/ui/StoreLivePill";
import LocalMapEmbed from "@/components/home/LocalMapEmbed";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { formatScheduleSummary } from "@/lib/hours";
import {
  getSiteSettings,
  buildMapsUrl,
  buildMapsEmbedUrl,
} from "@/lib/settings";

// Real photos of the store. Deliberately NOT pulled from the Google Maps
// listing: its cover photo (and at least one other) turned out to be a
// neighboring hotel's reception, not this store — bad data on Google's
// end, not something to propagate onto the site. Worth reporting/fixing
// on the real listing.
// Fotos reales del local en Catriel. La dirección no se escribe acá: sale de
// site_settings (settings.addressLine), que es lo que editan los dueños.
const LOCAL_PHOTOS = [
  {
    src: "/local/local-1.jpg",
    alt: "Fachada y vidriera del local Poné La Pava",
  },
  { src: "/local/local-2.jpg", alt: "Estantería de termos Stanley y yerbas" },
  { src: "/local/local-3.jpg", alt: "Sector de mates artesanales y cuero" },
  {
    src: "/local/local-4.jpg",
    alt: "Exhibición de bombillas de alpaca y bolsos",
  },
  {
    src: "/local/local-5.jpg",
    alt: "Mates camioneros e imperiales en el local",
  },
  { src: "/local/local-6.jpg", alt: "Vista interior del salón matero" },
];

import { LandingLocal } from "@/types/landing";
import CutText from "@/components/ui/CutText";

const PHOTO_TILT = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

export default async function LocalSection({
  content,
}: {
  content?: LandingLocal;
}) {
  const settings = await getSiteSettings();
  const mapsUrl = buildMapsUrl();
  const mapsEmbedUrl = buildMapsEmbedUrl();
  const photos =
    content?.photos && content.photos.length > 0
      ? content.photos
      : LOCAL_PHOTOS;
  const eyebrow = content?.eyebrow || "El local";
  const title = content?.title || "Vení, elegí";
  const titleHighlight = content?.titleHighlight || "y quedate un rato.";
  const description =
    content?.description ||
    "Nuestro local físico es el punto de encuentro de los mateadores. Venís, tocás los productos, los olés y encontrás ese detalle que hace propio a tu ritual.";

  const infoCard =
    "flex gap-4 bg-pava-paper p-4 text-pava-ink shadow-[3px_4px_0_rgba(0,0,0,0.35)] sm:p-5";
  const infoIcon =
    "flex size-11 shrink-0 items-center justify-center rounded-full bg-pava-gold text-pava-ink shadow-[1px_2px_0_#1f3a2b]";

  return (
    <section id="el-local" className="paper-green on-dark relative py-20 text-pava-paper sm:py-24 lg:py-32">
      <span aria-hidden className="torn-edge paper-green absolute inset-x-0 -top-[21px] z-10" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lp-reveal relative lg:col-span-7">
            <div className="grid grid-cols-3 gap-4 sm:gap-5">
              {/* Mapa en vivo como una copia pegada con cinta */}
              <div className="relative col-span-3 -rotate-[1deg] bg-[#fbf8f1] p-2 shadow-[4px_6px_0_rgba(0,0,0,0.35)] sm:p-2.5">
                <span aria-hidden className="tape -top-3 left-10 -rotate-6" />
                <span aria-hidden className="tape -top-3 right-10 rotate-[5deg]" />
                <div className="local-map-frame group relative aspect-[16/10] overflow-hidden bg-pava-cream-dark sm:aspect-[16/9]">
                  <LocalMapEmbed src={mapsEmbedUrl} title="Ubicación de Poné La Pava en el mapa" />
                  <div className="local-map-tint pointer-events-none absolute inset-0" aria-hidden="true" />
                  {/* Pin de marca decorativo; el pin real de Google marca el punto exacto. */}
                  <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
                    <span className="local-map-pin relative flex flex-col items-center">
                      <span className="paper-chip font-display whitespace-nowrap bg-pava-leaf px-3 py-1 text-base uppercase text-pava-paper">
                        Poné La Pava
                      </span>
                      <span className="-mt-[2px] h-3 w-3 rotate-45 bg-pava-leaf" />
                    </span>
                  </div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-[5px] bg-pava-paper px-3 py-2 text-[15px] uppercase leading-none text-pava-ink shadow-[2px_3px_0_#1f3a2b] transition-transform hover:-rotate-2"
                  >
                    Ver en Google Maps <ExternalLink size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Fotos reales del local, como copias sueltas */}
              {photos.map((photo, i) => (
                <a
                  key={photo.src}
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ transform: `rotate(${PHOTO_TILT[i % PHOTO_TILT.length]})` }}
                  className={`group relative block bg-[#fbf8f1] p-1.5 shadow-[3px_4px_0_rgba(0,0,0,0.35)] transition-transform duration-300 hover:!rotate-0 hover:-translate-y-1 ${i >= 3 ? "hidden sm:block" : ""}`}
                  aria-label={`${photo.alt} — ver más fotos en Google Maps`}
                >
                  <span className="relative block aspect-square overflow-hidden bg-pava-cream-dark">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 33vw, 19vw"
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lp-reveal order-first lg:order-none lg:col-span-5 lg:pl-6">
            <span className="font-script inline-block -rotate-2 text-2xl text-pava-gold">
              {eyebrow.toLowerCase()} ↓
            </span>
            <h2 className="font-display mt-2 text-[2.8rem] uppercase leading-[0.92] text-pava-paper sm:text-6xl lg:text-[4.2rem]">
              <CutText text={title} seed={5} />{" "}
              <span className="paper-chip mt-2 bg-pava-gold text-pava-ink" style={{ transform: "rotate(-2deg)" }}>
                <CutText text={titleHighlight} seed={title.length + 5} />
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-pava-paper/80">{description}</p>

            <div className="mt-9 space-y-4">
              <div className={infoCard} style={{ transform: "rotate(-0.8deg)" }}>
                <span className={infoIcon}>
                  <MapPin size={19} aria-hidden="true" />
                </span>
                <div>
                  <span className="font-script text-lg leading-none text-pava-leaf-dark">dirección</span>
                  <p className="font-display mt-1 text-xl uppercase leading-tight">{settings.addressLine}</p>
                  <p className="text-sm text-pava-ink/70">{settings.addressCity}</p>
                </div>
              </div>
              <div className={infoCard} style={{ transform: "rotate(0.7deg)" }}>
                <span className={infoIcon}>
                  <Clock size={19} aria-hidden="true" />
                </span>
                <div>
                  <span className="font-script text-lg leading-none text-pava-leaf-dark">horarios</span>
                  <div className="mt-1 space-y-0.5">
                    {formatScheduleSummary(settings)
                      .filter((line) => !line.endsWith("Cerrado"))
                      .map((line, idx) => (
                        <p
                          key={line}
                          className={idx === 0 ? "font-display text-xl uppercase leading-tight" : "text-sm text-pava-ink/70"}
                        >
                          {line}
                        </p>
                      ))}
                  </div>
                  {/* El pill está pensado para fondo oscuro: va sobre un chip de tinta. */}
                  <span className="mt-1 inline-block rounded-full bg-pava-ink px-1 pb-1">
                    <StoreLivePill settings={settings} />
                  </span>
                </div>
              </div>
              <div className={infoCard} style={{ transform: "rotate(-0.5deg)" }}>
                <span className={infoIcon}>
                  <MessageCircle size={19} aria-hidden="true" />
                </span>
                <div>
                  <span className="font-script text-lg leading-none text-pava-leaf-dark">whatsapp</span>
                  <a
                    href={whatsappChatUrl(settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display mt-1 block text-xl uppercase leading-tight transition-colors hover:text-pava-leaf"
                  >
                    {settings.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-paper btn-paper--mustard justify-center">
                <ExternalLink size={16} aria-hidden="true" /> Cómo llegar
              </a>
              <a
                href={whatsappChatUrl(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper btn-paper--cream justify-center"
              >
                <MessageCircle size={16} aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
