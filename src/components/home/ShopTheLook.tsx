"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/catalog/AddToCartButton";
import CutText from "@/components/ui/CutText";

// ponytail: look fijo en código (foto + posición de cada producto en %).
// Si los dueños quieren cambiarlo seguido, moverlo a landing_content.
const LOOK = {
  image: "/hero_background_1786545961305.png",
  alt: "Mesa matera con termo, mate, bombilla y yerba",
  spots: [
    { productId: "12", x: 77, y: 34 },
    { productId: "10", x: 59, y: 38 },
    { productId: "5", x: 49, y: 56 },
    { productId: "1", x: 12, y: 57 },
  ],
};

const isAvailable = (p: Product) => p.status !== "out_of_stock" && p.stock > 0;

export default function ShopTheLook({ products }: { products: Product[] }) {
  const { addItem, setDrawer } = useCart();
  const spots = LOOK.spots
    .map((s) => ({ ...s, product: products.find((p) => p.id === s.productId) }))
    .filter((s): s is typeof s & { product: Product } => Boolean(s.product));
  const [activeId, setActiveId] = useState<string | null>(
    spots[0]?.productId ?? null,
  );

  if (spots.length === 0) return null;

  const available = spots.map((s) => s.product).filter(isAvailable);
  const total = available.reduce((sum, p) => sum + p.price, 0);

  const addAll = () => {
    available.forEach((p) => addItem(p, 1));
    setDrawer(true);
  };

  return (
    <section
      className="paper-cream relative py-16 sm:py-20 lg:py-24"
      aria-labelledby="look-title"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lp-reveal relative -rotate-1 bg-[#fbf8f1] p-2.5 shadow-[4px_6px_0_rgba(31,58,43,0.3)] sm:p-3 lg:col-span-7">
          <span aria-hidden className="tape -top-3 left-8 -rotate-6" />
          <span aria-hidden className="tape -top-3 right-8 rotate-[5deg]" />
          <div className="relative aspect-square overflow-hidden bg-pava-green-dark">
          <Image
            src={LOOK.image}
            alt={LOOK.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          {spots.map(({ productId, x, y, product }) => {
            const active = activeId === productId;
            return (
              <button
                key={productId}
                type="button"
                onClick={() => setActiveId(productId)}
                aria-label={`Ver ${product.name}`}
                aria-pressed={active}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-pava-ink shadow-[2px_2px_0_#1f3a2b] transition-all duration-200 ${
                  active
                    ? "scale-110 bg-pava-leaf text-pava-paper"
                    : "lp-ping bg-pava-gold text-pava-ink hover:scale-110"
                }`}
              >
                <Plus
                  size={16}
                  strokeWidth={3}
                  className={`transition-transform ${active ? "rotate-45" : ""}`}
                />
              </button>
            );
          })}
          </div>
        </div>

        <div className="flex flex-col self-center rounded-[6px] border-2 border-pava-ink/85 bg-[#fbf8f1] p-5 shadow-[4px_5px_0_rgba(31,58,43,0.85)] sm:p-7 lg:col-span-5 lg:rotate-[0.6deg]">
          <span className="font-script -rotate-2 self-start text-xl text-pava-leaf">
            shop the look ↓
          </span>
          <h2
            id="look-title"
            className="font-display mt-1 text-4xl uppercase leading-[0.92] text-pava-ink sm:text-5xl"
          >
            <CutText text="La mesa del domingo" seed={3} />
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-pava-ink/70">
            Tocá los puntos de la foto para ver cada pieza.
          </p>

          <ul className="mt-5 border-t-2 border-dashed border-pava-ink/20">
            {spots.map(({ productId, product }) => {
              const active = activeId === productId;
              return (
                <li
                  key={productId}
                  onMouseEnter={() => setActiveId(productId)}
                  className={`-mx-2 flex items-center gap-4 border-b-2 border-dashed border-pava-ink/20 px-2 py-3 transition-colors ${
                    active ? "bg-pava-gold/20" : ""
                  }`}
                >
                  <Link
                    href={`/producto/${product.id}`}
                    className="relative h-16 w-14 shrink-0 overflow-hidden rounded-[3px] border border-pava-ink/20 bg-pava-cream-dark"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/producto/${product.id}`}
                      className="line-clamp-1 text-sm font-semibold text-pava-ink hover:text-pava-leaf"
                    >
                      {product.name}
                    </Link>
                    <span className="font-display block text-[19px] leading-tight text-pava-leaf-dark">
                      {isAvailable(product)
                        ? formatPrice(product.price)
                        : "Agotado"}
                    </span>
                  </div>
                  {isAvailable(product) && (
                    <AddToCartButton product={product} compact />
                  )}
                </li>
              );
            })}
          </ul>

          {available.length > 1 && (
            <button
              type="button"
              onClick={addAll}
              className="btn-paper btn-paper--leaf mt-6 w-full justify-between"
            >
              <span>Llevate el look ({available.length})</span>
              <span>{formatPrice(total)}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
