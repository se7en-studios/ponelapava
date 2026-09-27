"use client";

import { useSiteSettings } from "@/context/SiteSettingsContext";
import { LandingAnnouncementItem } from "@/types/landing";

function defaultItems(
  paymentMethods: string[] = ["transfer", "cash", "card"],
): string[] {
  const payment =
    paymentMethods.includes("transfer") && paymentMethods.includes("card")
      ? "Transferencia o Mercado Pago"
      : paymentMethods.includes("transfer")
        ? "Transferencia bancaria"
        : paymentMethods.includes("card")
          ? "Mercado Pago"
          : "Pago al retirar";
  return [
    payment,
    ...(paymentMethods.includes("cash") ? ["Efectivo en el local"] : []),
    "Envíos a todo el país",
    "Retiro en el local de Catriel",
    "5,0 en Google",
    "Garantía artesanal",
  ];
}

// Cinta de texto corrido, sin íconos ni badges.
export default function TrustBar({
  announcements,
}: {
  announcements?: LandingAnnouncementItem[];
}) {
  const settings = useSiteSettings();
  const items =
    announcements && announcements.length > 0
      ? announcements.map((a) =>
          [a.highlight, a.text].filter(Boolean).join(" — "),
        )
      : defaultItems(settings.paymentMethods);

  const row = (hidden: boolean) =>
    items.map((text, i) => (
      <span
        key={`${hidden ? "d" : "o"}-${i}`}
        aria-hidden={hidden || undefined}
        className="flex shrink-0 items-center gap-8 pr-8 text-[11px] font-medium uppercase tracking-[0.16em] text-pava-cream/90"
      >
        {text}
        <span className="text-pava-gold" aria-hidden="true">
          ✦
        </span>
      </span>
    ));

  return (
    <section
      className="overflow-hidden bg-pava-green py-3"
      aria-label="Beneficios"
    >
      <div className="marquee-track items-center hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
