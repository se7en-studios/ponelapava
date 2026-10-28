import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Clock, LogIn } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { NAV_LINKS, UTILITY_LINKS } from "@/lib/nav";
import { INSTAGRAM_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { formatScheduleSummary } from "@/lib/hours";
import { BrandCircle, BrandWordmark } from "@/components/ui/BrandMark";

const categories = [
  { href: "/catalogo?cat=yerbas", label: "Yerbas" },
  { href: "/catalogo?cat=mates", label: "Mates" },
  { href: "/catalogo?cat=bombillas", label: "Bombillas" },
  { href: "/catalogo?cat=termos", label: "Termos" },
  { href: "/catalogo?cat=accesorios", label: "Accesorios" },
  { href: "/catalogo?cat=combos", label: "Combos" },
];

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <footer id="contacto" className="focus-ring-gold paper-green on-dark relative text-pava-paper/80">
      <span aria-hidden className="torn-edge paper-green absolute inset-x-0 -top-[21px] z-10" />
      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="group mb-5 flex items-center gap-3" aria-label="Poné La Pava — Inicio">
              <BrandCircle size={64} className="shrink-0 -rotate-6 shadow-[3px_4px_0_rgba(0,0,0,0.35)] [border-radius:50%] transition-transform duration-300 group-hover:rotate-0" />
              <BrandWordmark className="text-[17px] text-pava-paper" />
            </Link>
            <p className="max-w-xs text-[15px] leading-relaxed text-pava-paper/70">
              Especialistas en la cultura del mate. Yerbas seleccionadas, mates
              artesanales y todo lo que necesitás para el mate perfecto.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-pava-paper text-pava-ink shadow-[2px_3px_0_rgba(0,0,0,0.4)] transition-transform duration-200 hover:-rotate-12"
                aria-label="Instagram de Poné La Pava"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={whatsappChatUrl(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-pava-gold text-pava-ink shadow-[2px_3px_0_rgba(0,0,0,0.4)] transition-transform duration-200 hover:rotate-12"
                aria-label="WhatsApp de Poné La Pava"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display mb-4 text-2xl uppercase leading-none text-pava-gold">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/catalogo"
                  className="inline-block text-[15px] text-pava-paper/75 transition-all duration-200 hover:translate-x-1 hover:-rotate-1 hover:text-pava-paper"
                >
                  Catálogo Completo
                </Link>
              </li>
              {UTILITY_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-block text-[15px] text-pava-paper/75 transition-all duration-200 hover:translate-x-1 hover:-rotate-1 hover:text-pava-paper"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display mb-4 text-2xl uppercase leading-none text-pava-gold">
              Categorías
            </h3>
            <ul className="flex flex-col gap-3">
              {categories.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-block text-[15px] text-pava-paper/75 transition-all duration-200 hover:translate-x-1 hover:-rotate-1 hover:text-pava-paper"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-display mb-4 text-2xl uppercase leading-none text-pava-gold">
              El local
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-[15px] text-pava-paper/75">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-pava-gold"
                />
                <span>
                  {settings.addressLine}
                  <br />
                  {settings.addressCity}
                </span>
              </div>
              <div className="flex items-start gap-3 text-[15px] text-pava-paper/75">
                <Clock
                  size={15}
                  className="mt-0.5 shrink-0 text-pava-gold"
                />
                <span>
                  {formatScheduleSummary(settings)
                    .filter((line) => !line.endsWith("Cerrado"))
                    .map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                </span>
              </div>
              <a
                href={whatsappChatUrl(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper btn-paper--cream mt-1 self-start !px-4 !py-3 !text-base"
              >
                <MessageCircle size={15} />
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Shipping trust bar */}
      <div className="relative border-t-2 border-dashed border-pava-paper/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-pava-paper/75 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-script mr-1 text-lg text-pava-paper">Medios de pago:</span>
              {(settings.paymentMethods?.includes("transfer") ?? true) && (
                <span className="rounded-[4px] bg-pava-paper px-2.5 py-1 text-[12px] font-medium text-pava-ink shadow-[2px_2px_0_rgba(0,0,0,0.35)]">Transferencia</span>
              )}
              {(settings.paymentMethods?.includes("card") ?? true) && (
                <span className="rounded-[4px] bg-pava-paper px-2.5 py-1 text-[12px] font-medium text-pava-ink shadow-[2px_2px_0_rgba(0,0,0,0.35)]">Mercado Pago</span>
              )}
              {(settings.paymentMethods?.includes("cash") ?? true) && (
                <span className="rounded-[4px] bg-pava-paper px-2.5 py-1 text-[12px] font-medium text-pava-ink shadow-[2px_2px_0_rgba(0,0,0,0.35)]">Efectivo en local</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="font-script mr-1 text-lg text-pava-paper">Entrega:</span>
              <span className="rounded-[4px] bg-pava-paper px-2.5 py-1 text-[12px] font-medium text-pava-ink shadow-[2px_2px_0_rgba(0,0,0,0.35)]">Envíos a todo el país</span>
              <span className="rounded-[4px] bg-pava-paper px-2.5 py-1 text-[12px] font-medium text-pava-ink shadow-[2px_2px_0_rgba(0,0,0,0.35)]">Retiro en Catriel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t-2 border-dashed border-pava-paper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-pava-paper/65 text-center md:text-left">
              © {currentYear} Poné La Pava. Todos los derechos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-pava-paper/65">
              <span>Hecho con mate 🧉 en Río Negro, Argentina</span>
              <span className="text-pava-paper/30 hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1.5 text-pava-paper/75">
                <span>Hecho por</span>
                <a
                  href="https://se7enstudio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-pava-paper hover:text-white transition-all duration-200 group"
                  aria-label="SE7EN Studio (abre en otra pestaña)"
                >
                  <Image
                    src="/se7en-logo.png"
                    alt="SE7EN"
                    width={72}
                    height={20}
                    className="h-4 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </a>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-pava-paper/45 transition-colors duration-200 hover:text-pava-paper/80"
            >
              <LogIn size={12} />
              Acceso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
