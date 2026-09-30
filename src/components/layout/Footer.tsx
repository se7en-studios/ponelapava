import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Clock, LogIn } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { NAV_LINKS, UTILITY_LINKS } from "@/lib/nav";
import { INSTAGRAM_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { formatScheduleSummary } from "@/lib/hours";

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
    <footer id="contacto" className="focus-ring-gold relative overflow-hidden bg-gradient-to-b from-pava-brown to-pava-green-dark text-pava-cream/80">
      {/* Olas animadas de fondo (adaptado de 21st.dev animated-wave-footer). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] overflow-hidden">
        <svg
          className="lp-wave absolute bottom-0 left-0 h-full w-[3600px] text-pava-cream"
          viewBox="0 0 3600 500"
          preserveAspectRatio="none"
        >
          {[0, 1800].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`}>
              <path d="M0 250C200 150 400 50 600 100C800 150 1000 350 1200 300C1400 250 1600 150 1800 250V500H0V250Z" fill="currentColor" opacity="0.04" />
              <path d="M0 250C200 200 400 100 600 150C800 200 1000 350 1200 300C1400 250 1600 200 1800 250V500H0V250Z" fill="currentColor" opacity="0.06" />
            </g>
          ))}
        </svg>
      </div>
      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/logo.png"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-pava-cream">
                  Poné La Pava
                </span>
                <span className="mt-0.5 block text-[10px] tracking-[0.2em] uppercase text-pava-cream/65">
                  Yerbas & Accesorios
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-pava-cream/65 max-w-xs">
              Especialistas en la cultura del mate. Yerbas seleccionadas, mates
              artesanales y todo lo que necesitás para el mate perfecto.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-pava-cream/20 hover:-translate-y-0.5 hover:border-pava-cream hover:bg-pava-cream hover:text-pava-brown transition-all duration-200"
                aria-label="Instagram de Poné La Pava"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={whatsappChatUrl(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-pava-cream/20 hover:-translate-y-0.5 hover:border-whatsapp hover:bg-whatsapp hover:text-white transition-all duration-200"
                aria-label="WhatsApp de Poné La Pava"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-pava-cream text-sm font-semibold tracking-wider uppercase mb-5">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/catalogo"
                  className="inline-block text-sm text-pava-cream/65 hover:translate-x-1 hover:text-pava-cream transition-all duration-200"
                >
                  Catálogo Completo
                </Link>
              </li>
              {UTILITY_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-block text-sm text-pava-cream/65 hover:translate-x-1 hover:text-pava-cream transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-pava-cream text-sm font-semibold tracking-wider uppercase mb-5">
              Categorías
            </h3>
            <ul className="flex flex-col gap-3">
              {categories.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-block text-sm text-pava-cream/65 hover:translate-x-1 hover:text-pava-cream transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-pava-cream text-sm font-semibold tracking-wider uppercase mb-5">
              El local
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm text-pava-cream/65">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-pava-cream/40"
                />
                <span>
                  {settings.addressLine}
                  <br />
                  {settings.addressCity}
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-pava-cream/65">
                <Clock
                  size={15}
                  className="mt-0.5 shrink-0 text-pava-cream/40"
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
                className="inline-flex items-center gap-2 text-sm text-whatsapp hover:text-whatsapp-dark transition-colors duration-200 font-medium"
              >
                <MessageCircle size={15} />
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Shipping trust bar */}
      <div className="relative border-t border-pava-cream/10 bg-black/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-pava-cream/70 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-semibold text-pava-cream mr-1">Medios de pago:</span>
              {(settings.paymentMethods?.includes("transfer") ?? true) && (
                <span className="rounded-chip bg-pava-cream/10 border border-pava-cream/15 px-2.5 py-1 text-[11px]">Transferencia</span>
              )}
              {(settings.paymentMethods?.includes("card") ?? true) && (
                <span className="rounded-chip bg-pava-cream/10 border border-pava-cream/15 px-2.5 py-1 text-[11px]">Mercado Pago</span>
              )}
              {(settings.paymentMethods?.includes("cash") ?? true) && (
                <span className="rounded-chip bg-pava-cream/10 border border-pava-cream/15 px-2.5 py-1 text-[11px]">Efectivo en local</span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="font-semibold text-pava-cream mr-1">Entrega:</span>
              <span className="rounded-chip bg-pava-cream/10 border border-pava-cream/15 px-2.5 py-1 text-[11px]">Envíos a todo el país</span>
              <span className="rounded-chip bg-pava-cream/10 border border-pava-cream/15 px-2.5 py-1 text-[11px]">Retiro en Catriel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-pava-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-pava-cream/65 text-center md:text-left">
              © {currentYear} Poné La Pava. Todos los derechos reservados.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-pava-cream/65">
              <span>Hecho con mate 🧉 en Río Negro, Argentina</span>
              <span className="text-pava-cream/25 hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1.5 text-pava-cream/75">
                <span>Hecho por</span>
                <a
                  href="https://se7enstudio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-pava-cream hover:text-white transition-all duration-200 group"
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
              className="inline-flex items-center gap-1.5 text-xs text-pava-cream/40 transition-colors duration-200 hover:text-pava-cream/70"
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
