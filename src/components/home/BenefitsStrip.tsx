import { CreditCard, MessageCircle, Store, Truck } from "lucide-react";

// Beneficios de compra — mismos datos que las FAQ (envíos, retiro, pagos).
const BENEFITS = [
  { icon: Truck, title: "Envíos a todo el país", text: "Coordinamos el costo según tu localidad." },
  { icon: Store, title: "Retiro sin cargo", text: "En Av. San Martín 475, Catriel." },
  { icon: CreditCard, title: "Pagá como quieras", text: "Transferencia, Mercado Pago o efectivo." },
  { icon: MessageCircle, title: "Compra asistida", text: "Te asesoramos por WhatsApp." },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="Beneficios de compra" className="border-b border-pava-brown/10 bg-pava-cream">
      <ul className="lp-stagger mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-5 py-8 sm:px-8 lg:grid-cols-4 lg:px-10 lg:py-10">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="group flex items-center gap-3 sm:items-start">
            <span className="flex size-9 shrink-0 sm:size-10 items-center justify-center rounded-full bg-pava-green/8 text-pava-green transition-colors duration-300 group-hover:bg-pava-green group-hover:text-pava-cream">
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[13px] font-semibold leading-snug text-pava-brown sm:text-sm">{title}</span>
              <span className="mt-0.5 hidden text-xs leading-relaxed sm:block text-pava-brown-mid/75">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
