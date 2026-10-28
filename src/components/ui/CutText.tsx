import type { CSSProperties } from "react";

// Letras recortadas: cada letra gira y se corre un poco, como las letras del
// logo y del cartel del local. El desvío es determinístico (mismo texto, mismo
// "recorte") para que no cambie entre servidor y cliente.
// Con `animate`, las letras entran "pegándose" una tras otra (artesanal.css).
export default function CutText({
  text,
  animate = false,
  delayMs = 0,
  seed = 0,
  className = "",
}: {
  text: string;
  animate?: boolean;
  delayMs?: number;
  seed?: number;
  className?: string;
}) {
  let i = 0;
  const words = text.split(" ");

  return (
    <span className={`${animate ? "cut-in" : ""} ${className}`} aria-label={text} role="text">
      {words.map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch) => {
            const k = i + seed;
            const style = {
              "--r": `${(((k * 37) % 7) - 3) * 1.15}deg`,
              "--y": `${(((k * 53) % 5) - 2) * 0.014}em`,
              "--i": i,
              "--d": `${delayMs}ms`,
            } as CSSProperties;
            i += 1;
            return (
              <span key={k} className="cut-letter" style={style}>
                {ch}
              </span>
            );
          })}
          {w < words.length - 1 && <span className="inline-block w-[0.26em]" />}
        </span>
      ))}
    </span>
  );
}
