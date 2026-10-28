import Image from "next/image";

// Beneficios de compra — mismos datos que las FAQ (envíos, retiro, pagos).
// Los íconos son stickers de papel recortado generados en Google Flow.
const BENEFITS = [
  { img: "/redesign/sticker-envios.png", title: "Envíos a todo el país", text: "Coordinamos el costo según tu localidad.", r: "-4deg" },
  { img: "/redesign/sticker-local.png", title: "Retiro sin cargo", text: "En Av. San Martín 475, Catriel.", r: "3deg" },
  { img: "/redesign/sticker-pagos.png", title: "Pagá como quieras", text: "Transferencia, Mercado Pago o efectivo.", r: "-2deg" },
  { img: "/redesign/sticker-whatsapp.png", title: "Compra asistida", text: "Te asesoramos por WhatsApp.", r: "4deg" },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Beneficios de compra" className="paper-cream relative">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-4 lg:px-10 lg:pb-14 lg:pt-10">
        {BENEFITS.map(({ img, title, text, r }) => (
          <li key={title} className="group flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
            <span
              className="relative block size-20 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-24"
              style={{ rotate: r }}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-contain drop-shadow-[2px_3px_0_rgba(31,58,43,0.18)]" />
            </span>
            <span className="mt-2 sm:mt-0">
              <span className="font-display block text-[19px] uppercase leading-[1.05] text-pava-ink sm:text-[21px]">
                {title}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-pava-ink/70 sm:text-sm">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
