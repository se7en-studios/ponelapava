"use client";

import { useMemo } from "react";
import { whatsappChatUrl } from "@/lib/whatsapp";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface FAQItem {
  category: "pagos" | "envios" | "curado" | "garantia";
  question: string;
  answer: string;
}

function buildFaqs(settings: { paymentMethods?: string[] }): FAQItem[] {
  const methods = settings.paymentMethods && settings.paymentMethods.length > 0
    ? settings.paymentMethods
    : ["transfer", "cash", "card"];

  const paymentDescriptions: string[] = [];
  if (methods.includes("transfer")) paymentDescriptions.push("transferencia bancaria");
  if (methods.includes("cash")) paymentDescriptions.push("efectivo al retirar en nuestro local de Catriel");
  if (methods.includes("card")) paymentDescriptions.push("Mercado Pago");

  const summary = paymentDescriptions.length > 1
    ? `${paymentDescriptions.slice(0, -1).join(", ")} y ${paymentDescriptions[paymentDescriptions.length - 1]}`
    : paymentDescriptions[0] || "transferencia bancaria";

  const paymentAnswer = methods.includes("card")
    ? `Aceptamos ${summary}. Cuando confirmás el pedido por WhatsApp te pasamos los datos para transferir o el link de pago.`
    : `Aceptamos ${summary}. Cuando confirmás el pedido por WhatsApp te pasamos los datos para transferir y coordinar tu pedido.`;

  return [
    {
      category: "pagos",
      question: "¿Qué medios de pago aceptan?",
      answer: paymentAnswer,
    },
  {
    category: "pagos",
    question: "¿Cómo es el proceso de compra directa por WhatsApp?",
    answer:
      "Armás tu carrito en la web con los productos que desees y hacés clic en 'Pedir por WhatsApp'. El sistema genera automáticamente el detalle de tu compra y te atiende una persona del local para confirmar stock, pasarte los datos de pago y despacharlo en el día.",
  },
  {
    category: "envios",
    question: "¿Hacen envíos a todo el país y cuánto tardan?",
    answer:
      "Despachamos a todo el país. El costo del envío lo coordinamos por WhatsApp al confirmar tu pedido, según tu localidad. También podés retirar sin cargo en nuestro local de Catriel.",
  },
  {
    category: "envios",
    question: "¿Puedo retirar mi compra sin cargo en el local de Catriel?",
    answer:
      "¡Claro que sí! Podés seleccionar 'Retiro en el local' y buscar tu pedido por nuestra dirección de Catriel (Río Negro). Tu pedido queda preparado para retirar en nuestro horario de atención.",
  },
  {
    category: "curado",
    question: "¿Cómo se cura un mate nuevo de calabaza o algarrobo?",
    answer:
      "Llená el mate con yerba húmeda usada y un chorrito de agua tibia (a 75°C). Dejalo reposar 24 hs, vacialo y raspá suavemente las paredes interiores con una cuchara para desprender el hollejo suelto. Repetí este paso 2 veces. ¡Listo para cebar!",
  },
  {
    category: "curado",
    question: "¿Los mates de acero inoxidable o cerámica necesitan curado?",
    answer:
      "No, los mates de acero inoxidable, cerámica o vidrio no requieren curado previo. Solo necesitan un lavado inicial con agua tibia y ya están listos para disfrutar de la primera ronda.",
  },
  {
    category: "garantia",
    question: "¿Qué garantía tienen los termos y mates artesanales?",
    answer:
      "Todos nuestros mates de calabaza y cuero cuentan con garantía artesanal sobre costuras y virolas de alpaca. Los termos Stanley y Lumilagro cuentan con garantía oficial de rendimiento térmico. Te asesoramos siempre ante cualquier consulta.",
  },
  ];
}

import { LandingFAQItem } from "@/types/landing";
import CutText from "@/components/ui/CutText";

const STRIP_TILT = ["-0.5deg", "0.4deg", "-0.3deg", "0.6deg"];

export default function FAQSection({ faqs: customFaqs }: { faqs?: LandingFAQItem[] }) {
  const settings = useSiteSettings();
  const defaultFaqs = useMemo(() => buildFaqs(settings), [settings]);
  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section id="preguntas-frecuentes" className="paper-cream relative py-20 sm:py-24 lg:py-28">
      <span aria-hidden className="torn-edge paper-cream absolute inset-x-0 -top-[21px] z-10" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <span className="font-script inline-block -rotate-2 text-2xl text-pava-leaf">dudas ↓</span>
          <h2 className="font-display mt-1 text-[2.8rem] uppercase leading-[0.92] text-pava-ink sm:text-6xl">
            <CutText text="Preguntas frecuentes" seed={7} />
          </h2>
          <p className="mt-4 max-w-xs text-[16px] leading-relaxed text-pava-ink/70">
            Pagos, envíos y cuidado de tus mates. ¿Otra duda?
          </p>
          <a
            href={whatsappChatUrl(settings.whatsappNumber, "¡Hola Poné La Pava! Tengo una consulta sobre sus productos")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-paper btn-paper--leaf mt-8"
          >
            Escribinos por WhatsApp <span aria-hidden>→</span>
          </a>
        </div>
        {/* <details> nativo: accesible y sin estado */}
        <div className="space-y-3.5 lg:col-span-8">
          {faqs.map((faq, i) => (
            <details
              key={faq.question}
              className="group bg-[#fbf8f1] shadow-[3px_4px_0_rgba(31,58,43,0.22)] transition-transform duration-200 open:shadow-[4px_5px_0_rgba(31,58,43,0.3)]"
              style={{ transform: `rotate(${STRIP_TILT[i % STRIP_TILT.length]})` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden sm:px-6">
                <span className="font-display text-[1.3rem] uppercase leading-tight text-pava-ink transition-colors group-hover:text-pava-leaf sm:text-[1.45rem]">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="font-display flex size-10 shrink-0 items-center justify-center rounded-full bg-pava-gold pb-0.5 text-[2rem] leading-none text-pava-ink shadow-[2px_2px_0_#1f3a2b] transition-transform duration-200 group-open:rotate-[135deg]"
                >
                  +
                </span>
              </summary>
              <p className="border-t-2 border-dashed border-pava-ink/15 px-5 pb-5 pt-4 text-[15px] leading-relaxed text-pava-ink/80 sm:px-6">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
