import Image from "next/image";
import Link from "next/link";
import { LandingAbout } from "@/types/landing";
import CutText from "@/components/ui/CutText";

const STAT_TILT = ["-3deg", "2deg", "-1.5deg"];

// Banda verde del logo: la foto real del local como copia impresa pegada con
// cinta, y el texto con el título en letras recortadas. Mismos campos
// editables desde /admin.
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
    <section id="nosotros" className="paper-leaf relative overflow-x-clip text-pava-paper">
      <span aria-hidden className="torn-edge paper-leaf absolute inset-x-0 -top-[21px] z-10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
        <div className="lp-reveal relative mx-auto w-full max-w-md lg:max-w-[30rem]">
          {/* Hoja de papel salvia detrás de la copia, apenas corrida */}
          <span
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-3 rotate-[4deg] bg-pava-sage shadow-[3px_4px_0_rgba(0,0,0,0.18)]"
          />
          <figure className="relative -rotate-[2.5deg] bg-[#fbf8f1] p-3 pb-14 shadow-[5px_7px_0_rgba(0,0,0,0.28)] sm:p-4 sm:pb-16">
            <span aria-hidden className="tape -top-3 left-6 -rotate-6" />
            <span aria-hidden className="tape -top-3 right-6 rotate-[7deg]" />
            <span className="relative block aspect-[4/5] overflow-hidden bg-pava-cream-dark">
              <Image
                src={image}
                alt="Local Poné La Pava en Catriel, Río Negro"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
            </span>
            <figcaption className="font-script absolute bottom-3 left-4 text-xl text-pava-ink sm:bottom-4 sm:text-2xl">
              nuestro local · Catriel
            </figcaption>
          </figure>
        </div>

        <div className="lp-reveal max-w-xl">
          <span className="font-script inline-block -rotate-2 text-2xl text-pava-gold">
            {eyebrow.toLowerCase()} ↓
          </span>
          <h2 className="font-display mt-2 text-[2.8rem] uppercase leading-[0.92] sm:text-6xl lg:text-[4.2rem]">
            <CutText text={title} seed={3} />{" "}
            <span
              className="paper-chip mt-3 bg-pava-paper text-pava-ink"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              <CutText text={titleHighlight} seed={title.length + 3} />
            </span>
          </h2>
          <div className="mt-7 space-y-4 text-[16px] leading-relaxed text-pava-paper/85">
            <p>{paragraph1}</p>
            {paragraph2 && <p>{paragraph2}</p>}
          </div>
          {content?.stats && content.stats.length > 0 && (
            <dl className="mt-9 grid grid-cols-3 gap-3 sm:gap-4">
              {content.stats.slice(0, 3).map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center rounded-[6px] bg-pava-paper px-2 py-3 text-center text-pava-ink shadow-[3px_4px_0_#1f3a2b] sm:py-4"
                  style={{ transform: `rotate(${STAT_TILT[i % STAT_TILT.length]})` }}
                >
                  <dt className="font-script order-2 mt-1 text-[15px] leading-none text-pava-leaf-dark sm:text-lg">
                    {s.label.toLowerCase()}
                  </dt>
                  <dd className="font-display text-[1.6rem] uppercase leading-none sm:text-[2rem]">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link href="/#el-local" className="btn-paper btn-paper--mustard mt-10">
            Conocé el local <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
