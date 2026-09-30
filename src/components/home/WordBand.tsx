// Banda tipográfica gigante en loop: palabras de la tienda alternando relleno
// y contorno. Separador editorial entre secciones.
const WORDS = ["Yerba", "Mate", "Bombilla", "Termo", "Ronda", "Ritual"];

export default function WordBand({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const items = [...WORDS, ...WORDS];
  return (
    <div
      aria-hidden
      className={`overflow-hidden border-y py-6 sm:py-8 ${
        dark
          ? "border-pava-cream/10 bg-pava-green-dark text-pava-cream"
          : "border-pava-brown/10 bg-pava-cream text-pava-green"
      }`}
    >
      <div
        className="marquee-track items-center"
        style={{ animationDuration: "45s" }}
      >
        {items.map((w, i) => (
          <span key={i} className="flex items-center">
            <span
              style={i % 2 ? { WebkitTextStroke: `1.5px var(${dark ? "--color-pava-cream" : "--color-pava-green"})` } : undefined}
              className={`font-display px-6 text-6xl font-semibold leading-none tracking-tight sm:px-10 sm:text-8xl ${
                i % 2
                  ? "italic text-transparent"
                  : ""
              }`}
            >
              {w}
            </span>
            <span className="text-2xl text-pava-gold sm:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
