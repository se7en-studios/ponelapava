import { ReactNode } from "react";
import CutText from "@/components/ui/CutText";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

// Encabezado de páginas internas: banda de papel verde del logo, título con
// letras recortadas y borde rasgado hacia el papel crema de abajo.
export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="paper-leaf relative pb-20 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="font-script mb-2 inline-block -rotate-2 text-xl lowercase text-pava-gold-light">
          {eyebrow} ↓
        </span>
        <h1 className="font-display text-6xl uppercase leading-[0.9] text-pava-paper lg:text-7xl">
          <CutText text={title} animate seed={title.length} />
        </h1>
        {description && (
          <p className="mt-4 max-w-lg text-[17px] text-pava-paper/80">{description}</p>
        )}
      </div>
      <span aria-hidden className="torn-edge paper-cream absolute inset-x-0 bottom-0" />
    </div>
  );
}
