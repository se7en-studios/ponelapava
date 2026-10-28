/* eslint-disable @next/next/no-img-element -- logos chicos (svg/png) a una tinta; next/image no suma nada */

// "Marcas que trabajamos": logos oficiales de las marcas que vende el local,
// a una sola tinta (.brand-ink) para que la tira se lea pareja, cada uno en una
// etiqueta de papel pegada con cinta. Los logos que son un badge con fondo
// propio van en grises (.brand-gray): a una tinta quedarían como una mancha.
const BRANDS = [
  { name: "Playadito", src: "/brands/playadito.png", h: 50, badge: true },
  { name: "Stanley", src: "/brands/stanley.svg", h: 34 },
  { name: "Amanda", src: "/brands/amanda.png", h: 30 },
  { name: "Taragüí", src: "/brands/taragui.png", h: 30, badge: true },
  { name: "CBSé", src: "/brands/cbse.png", h: 34 },
  { name: "Lumilagro", src: "/brands/lumilagro.svg", h: 44, badge: true },
  { name: "Canarias", src: "/brands/canarias.svg", h: 38 },
  { name: "Sara", src: "/brands/sara.png", h: 40 },
];

const TILT = [-3, 2, -1.5, 3, -2.5, 1.5, -2];

export default function BrandsStrip() {
  return (
    <section aria-labelledby="marcas-title" className="paper-cream relative py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col items-start gap-1 sm:mb-10 sm:flex-row sm:items-end sm:gap-4">
          <h2 id="marcas-title" className="font-display text-4xl uppercase leading-none text-pava-ink sm:text-5xl">
            Las marcas de la ronda
          </h2>
          <span className="font-script -rotate-2 text-xl text-pava-leaf">las que trabajamos en el local ↓</span>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-8 lg:flex-nowrap lg:justify-between lg:gap-x-3">
          {BRANDS.map(({ name, src, h, ...rest }, i) => (
            <li
              key={name}
              className="relative flex h-20 w-[9.5rem] items-center justify-center bg-[#fbf8f1] px-4 shadow-[2px_4px_0_rgba(31,58,43,0.22)] sm:w-[10.5rem] lg:w-[9.6rem]"
              style={{ transform: `rotate(${TILT[i % TILT.length]}deg)` }}
            >
              <span
                aria-hidden
                className="tape -top-3 left-1/2 !h-5 !w-14"
                style={{ transform: `translateX(-50%) rotate(${i % 2 ? 6 : -5}deg)` }}
              />
              <img
                src={src}
                alt={name}
                loading="lazy"
                style={{ height: h }}
                className={`${"badge" in rest ? "brand-gray" : "brand-ink"} w-auto max-w-full object-contain`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
