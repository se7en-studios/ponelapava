import Image from "next/image";
import Link from "next/link";
import { LandingAbout } from "@/types/landing";

// Banda de color de marca, foto + texto. Mismos campos editables desde /admin.
export default function AboutSection({ content }: { content?: LandingAbout }) {
  const eyebrow = content?.eyebrow || "Nosotros";
  const title = content?.title || "Más que una yerba.";
  const titleHighlight = content?.titleHighlight || "Una forma de compartir.";
  const paragraph1 =
    content?.paragraph1 ||
    "En Poné La Pava creemos que el mate no es solo una bebida: es un ritual, un pretexto para estar juntos, para bajar el ritmo y conectar.";
  const paragraph2 =
    content?.paragraph2 ||
    "Reunimos todo lo que necesitás para vivir ese ritual como se merece: desde la yerba mejor seleccionada hasta el mate que se vuelve tuyo con el tiempo.";
  const image = content?.image || "/local/local-1.jpg";

  return (
    <section id="nosotros" className="bg-pava-green text-pava-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-control bg-pava-green-dark sm:aspect-[4/3] lg:aspect-[4/5]">
          <Image
            src={image}
            alt="Local Poné La Pava en Catriel, Río Negro"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="max-w-lg">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pava-gold">
            {eyebrow}
          </span>
          <h2 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title} {titleHighlight}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-pava-cream/80">
            <p>{paragraph1}</p>
            {paragraph2 && <p>{paragraph2}</p>}
          </div>
          <Link
            href="/#el-local"
            className="mt-8 inline-flex items-center rounded-control border border-pava-cream/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-pava-cream hover:text-pava-green"
          >
            Conocé el local
          </Link>
        </div>
      </div>
    </section>
  );
}
