"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
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
    <section id="preguntas-frecuentes" className="bg-pava-cream-dark py-16 sm:py-20 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-pava-brown sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-pava-brown-mid/75">
            Pagos, envíos y cuidado de tus mates. ¿Otra duda?
          </p>
          <a
            href={whatsappChatUrl(settings.whatsappNumber, "¡Hola Poné La Pava! Tengo una consulta sobre sus productos")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center rounded-control border border-pava-brown/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-pava-brown transition-colors hover:bg-pava-brown hover:text-pava-cream"
          >
            Escribinos por WhatsApp
          </a>
        </div>
        {/* <details> nativo: accesible y sin estado */}
        <div className="border-t border-pava-brown/15 lg:col-span-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-pava-brown/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-pava-brown transition-colors hover:text-pava-green group-open:text-pava-green [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown size={16} className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-pava-brown-mid/85">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
