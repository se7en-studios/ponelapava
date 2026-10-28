"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Truck, Clock, MapPin } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { getOpenDaysLabel, formatScheduleSummary } from "@/lib/hours";

interface Announcement {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
  text: string;
  link?: string;
}

export default function TopAnnouncementBar() {
  const settings = useSiteSettings();
  // La dirección y el horario salen de settings, no escritos acá
  const ANNOUNCEMENTS: Announcement[] = useMemo(
    () => {
      const openDaysBadge = getOpenDaysLabel(settings.openingHours);
      const scheduleLines = formatScheduleSummary(settings).filter((s) => !s.endsWith("Cerrado"));
      const scheduleSummaryText = scheduleLines.length > 0 ? scheduleLines.join(" · ") : `${settings.hoursWeekday} hs`;

      return [
        {
          id: "horario",
          icon: Clock,
          badge: openDaysBadge,
          text: `Te atendemos en ${settings.addressLine} · ${scheduleSummaryText}`,
          link: "/#el-local",
        },
      {
        id: "envios",
        icon: Truck,
        badge: "ENVÍOS A TODO EL PAÍS",
        text: "Despacho rápido a Río Negro, Neuquén y toda la Argentina",
        link: "/catalogo",
      },
      {
        id: "local",
        icon: MapPin,
        badge: "LOCAL EN CATRIEL",
        text: `Retiro GRATIS en ${settings.addressLine} (${settings.addressCity})`,
        link: "/#el-local",
      },
      {
        id: "artesanal",
        icon: Sparkles,
        badge: "100% ARTESANAL",
        text: "Mates seleccionados de calabaza, alpaca y yerbas premium",
        link: "/catalogo",
      },
    ];
  }, [settings]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, ANNOUNCEMENTS.length]);

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 40) {
      setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    } else if (deltaX < -40) {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }
    setTouchStartX(null);
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="focus-ring-gold paper-leaf relative z-50 text-pava-paper border-b-2 border-pava-ink/40 px-2 py-1 text-xs font-medium sm:px-3 sm:py-1.5 select-none transition-colors"
      role="region"
      aria-label="Anuncios destacados"
    >
      {/* min-h por rango = la variante más alta de los 4 anuncios en ese
          rango (medido: <480 llega a 53 de contenido, 480–639 a 40, 640–767
          a 42 porque a partir de sm el texto sube a 12px, ≥768 todos en una
          línea). Sin esto la barra cambiaba de altura en cada rotación de
          4,5 s y el navbar saltaba 13,7 px en mobile. */}
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 min-h-[34px] sm:min-h-[42px] md:min-h-0">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="tap-44 flex items-center justify-center w-7 h-7 rounded-full text-pava-paper/80 hover:text-pava-gold hover:bg-pava-ink/20 transition-colors shrink-0"
          aria-label="Anuncio anterior"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Dynamic announcement item */}
        <div className="flex-1 flex items-center justify-center min-w-0 overflow-hidden">
          <Link
            href={current.link || "/catalogo"}
            className="focus-ring-inset group flex items-center justify-center gap-2 text-center transition-all duration-300 max-w-full hover:opacity-95"
          >
            <span className="hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-pava-paper/15 text-pava-gold shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Icon size={12} />
            </span>
            <div className="flex min-w-0 items-center gap-2 justify-center text-[12px] sm:flex-wrap sm:text-[13px] leading-tight">
              {/* .paper-chip fija display sin @layer y le gana a `hidden`: el
                  wrapper es el que se oculta en celular. */}
              <span className="hidden shrink-0 sm:inline-block">
                <span className="paper-chip font-display -rotate-2 whitespace-nowrap bg-pava-gold px-2 py-0 text-pava-ink uppercase text-[14px] leading-tight tracking-[0.03em]">
                  {current.badge}
                </span>
              </span>
              <span className="truncate text-pava-paper font-medium">
                {current.text}
              </span>
            </div>
          </Link>
        </div>

        {/* Next button + indicators */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="hidden md:flex items-center gap-1 mr-1">
            {ANNOUNCEMENTS.map((item, idx) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-4 bg-pava-gold"
                    : "w-1.5 bg-pava-paper/35 hover:bg-pava-paper/60"
                }`}
                aria-label={`Ir al anuncio ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="tap-44 flex items-center justify-center w-7 h-7 rounded-full text-pava-paper/80 hover:text-pava-gold hover:bg-pava-ink/20 transition-colors shrink-0"
            aria-label="Siguiente anuncio"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
