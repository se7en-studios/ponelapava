// Cinta de papel kraft en loop, levemente torcida, con las palabras de la
// tienda en letras recortadas. Separador entre secciones.
const WORDS = ["Yerba", "Mate", "Bombilla", "Termo", "Ronda", "Ritual"];

function Leaf() {
  return (
    <svg width="26" height="26" viewBox="0 0 20 30" aria-hidden className="shrink-0 text-pava-leaf">
      <path d="M3 29 C-2 19 3 6 18 0 C20 13 15 24 3 29 Z" fill="currentColor" />
    </svg>
  );
}

export default function WordBand({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const items = [...WORDS, ...WORDS];
  return (
    <div aria-hidden className="relative overflow-hidden py-6 sm:py-8">
      <div
        className={`relative -mx-4 -rotate-[1.4deg] py-3 shadow-[0_4px_0_rgba(31,58,43,0.18)] sm:py-4 ${
          dark ? "paper-green text-pava-paper" : "paper-kraft paper-kraft--cover text-pava-ink"
        }`}
      >
        <span className="torn-edge torn-edge--down absolute inset-x-0 -top-[10px] h-[12px] bg-inherit" />
        <div className="marquee-track items-center" style={{ animationDuration: "45s" }}>
          {items.map((w, i) => (
            <span key={i} className="flex items-center">
              <span
                className="font-display inline-block px-5 text-5xl uppercase leading-none sm:px-8 sm:text-7xl"
                style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
              >
                {w}
              </span>
              {i % 2 ? (
                <Leaf />
              ) : (
                <span className="text-2xl text-pava-paper sm:text-3xl" style={{ textShadow: "1px 1px 0 #1f3a2b" }}>
                  ✦
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
