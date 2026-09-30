// Olas en capas para fondos oscuros. Cada path es una suma de senos de período
// entero sobre TILE px, así dos copias lado a lado empalman sin corte y el loop
// de translateX(-50%) es invisible.
const TILE = 1600;
const HEIGHT = 320;
const STEP = 16;

interface Layer {
  base: number; // altura media (px desde arriba del viewBox)
  amp: [number, number]; // amplitud de los dos armónicos
  freq: [number, number]; // ciclos por TILE (enteros)
  phase: number;
  duration: string;
  reverse?: boolean;
  opacity: number;
  stroke?: boolean;
}

const LAYERS: Layer[] = [
  { base: 70, amp: [26, 10], freq: [2, 5], phase: 0, duration: "38s", opacity: 0.035 },
  { base: 100, amp: [22, 8], freq: [3, 7], phase: 1.3, duration: "52s", reverse: true, opacity: 0.05 },
  { base: 135, amp: [18, 6], freq: [2, 6], phase: 2.4, duration: "30s", opacity: 0.07 },
  { base: 100, amp: [22, 8], freq: [3, 7], phase: 1.3, duration: "52s", reverse: true, opacity: 0.45, stroke: true },
];

function wavePath({ base, amp, freq, phase }: Layer, closed: boolean): string {
  const pts: string[] = [];
  for (let x = 0; x <= TILE * 2; x += STEP) {
    const t = (x / TILE) * Math.PI * 2;
    const y = base + amp[0] * Math.sin(freq[0] * t + phase) + amp[1] * Math.sin(freq[1] * t + phase * 2);
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  const line = `M${pts.join("L")}`;
  return closed ? `${line}V${HEIGHT}H0Z` : line;
}

export default function Waves({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`} style={{ height: HEIGHT }}>
      {LAYERS.map((layer, i) => (
        <svg
          key={i}
          className="lp-wave absolute left-0 top-0 h-full"
          style={{
            width: TILE * 2,
            ["--wave-dur" as string]: layer.duration,
            animationDirection: layer.reverse ? "reverse" : undefined,
          }}
          viewBox={`0 0 ${TILE * 2} ${HEIGHT}`}
          preserveAspectRatio="none"
        >
          {layer.stroke ? (
            <path d={wavePath(layer, false)} fill="none" stroke="var(--color-pava-gold, #c9a86a)" strokeWidth="1" strokeOpacity={layer.opacity} />
          ) : (
            <>
              {/* Degradé vertical: la ola se desvanece hacia abajo, sin borde duro. */}
              <defs>
                <linearGradient id={`wave-fade-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0.3" stopColor="var(--color-pava-cream, #e9e2d1)" stopOpacity={layer.opacity} />
                  <stop offset="1" stopColor="var(--color-pava-cream, #e9e2d1)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={wavePath(layer, true)} fill={`url(#wave-fade-${i})`} />
            </>
          )}
        </svg>
      ))}
    </div>
  );
}
