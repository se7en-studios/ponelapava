import CutText from "@/components/ui/CutText";

// Logo de Poné La Pava redibujado en vector: el círculo verde con las letras
// recortadas, igual que el logo original y el cartel del local, pero nítido
// a cualquier tamaño.
export function BrandCircle({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Poné La Pava"
      className={className}
    >
      <circle cx="50" cy="50" r="49" fill="#4b8056" />
      <g
        fill="#f6f0e2"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-londrina), 'Londrina Solid', sans-serif" }}
      >
        <text x="50" y="46" fontSize="25" letterSpacing="0.5">
          <tspan rotate="-4 3 -2 4">PONÉ</tspan>
        </text>
        <text x="50" y="72" fontSize="25" letterSpacing="0.5">
          <tspan rotate="3 -3 0 2 -4 3 -2">LA PAVA</tspan>
        </text>
      </g>
    </svg>
  );
}

// Versión horizontal: las letras sueltas del cartel, para el header.
export function BrandWordmark({
  className = "",
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="font-display text-[1.65em] uppercase leading-[0.9] tracking-[0.02em]">
        <CutText text="Poné La Pava" />
      </span>
      {tagline && (
        <span className="font-script mt-0.5 text-[0.72em] leading-none opacity-80">
          yerbas &amp; accesorios
        </span>
      )}
    </span>
  );
}
