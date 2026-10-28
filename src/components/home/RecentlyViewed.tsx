"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/catalog/ProductCard";
import CutText from "@/components/ui/CutText";

const KEY = "plp:recently-viewed";
const MAX = 8;
const EVENT = "plp:recently-viewed-change";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

function record(id: string) {
  try {
    const ids = read()
      .split(",")
      .filter((x) => x && x !== id);
    localStorage.setItem(KEY, [id, ...ids].slice(0, MAX).join(","));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // almacenamiento bloqueado: la sección simplemente no aparece
  }
}

// Muestra los últimos productos vistos por este visitante. En la página de
// producto se pasa `currentId`: lo registra y lo excluye de la lista.
export default function RecentlyViewed({
  products,
  currentId,
}: {
  products: Product[];
  currentId?: string;
}) {
  const raw = useSyncExternalStore(subscribe, read, () => "");

  useEffect(() => {
    if (currentId) record(currentId);
  }, [currentId]);

  const items = useMemo(
    () =>
      raw
        .split(",")
        .filter((id) => id && id !== currentId)
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    [raw, products, currentId],
  );

  if (items.length === 0) return null;

  return (
    <section
      className="paper-cream py-16 sm:py-20"
      aria-labelledby="recent-title"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <span className="font-script mb-1 inline-block -rotate-2 text-xl text-pava-leaf">
          lo que estuviste mirando ↓
        </span>
        <h2
          id="recent-title"
          className="font-display mb-8 text-4xl uppercase leading-[0.92] text-pava-ink sm:text-5xl"
        >
          <CutText text="Vistos recientemente" seed={4} />
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
