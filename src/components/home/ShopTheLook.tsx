"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/catalog/AddToCartButton";

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
      className="bg-pava-cream-dark py-16 sm:py-20 lg:py-24"
      aria-labelledby="look-title"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lp-reveal relative aspect-square overflow-hidden rounded-control bg-pava-green-dark lg:col-span-7">
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
                className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200 ${
                  active
                    ? "scale-110 border-pava-cream bg-pava-cream text-pava-green"
                    : "lp-ping border-white/70 bg-black/25 text-white backdrop-blur-sm hover:bg-pava-cream hover:text-pava-green"
                }`}
              >
                <Plus
                  size={15}
                  className={`transition-transform ${active ? "rotate-45" : ""}`}
                />
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:col-span-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pava-gold-deep">
            03 — Shop the look
          </span>
          <h2
            id="look-title"
            className="font-display mt-3 text-3xl font-semibold tracking-tight text-pava-brown sm:text-4xl"
          >
            La mesa del domingo
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-pava-brown-mid/75">
            Tocá los puntos de la foto para ver cada pieza.
          </p>

          <ul className="mt-6 border-t border-pava-brown/15">
            {spots.map(({ productId, product }) => {
              const active = activeId === productId;
              return (
                <li
                  key={productId}
                  onMouseEnter={() => setActiveId(productId)}
                  className={`flex items-center gap-4 border-b border-pava-brown/15 py-3 transition-colors ${
                    active ? "bg-pava-cream-dark/60" : ""
                  }`}
                >
                  <Link
                    href={`/producto/${product.id}`}
                    className="relative h-16 w-14 shrink-0 overflow-hidden rounded-chip bg-pava-cream-dark"
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
                      className="line-clamp-1 text-sm font-medium text-pava-brown hover:text-pava-green"
                    >
                      {product.name}
                    </Link>
                    <span className="text-[13px] font-semibold text-pava-green">
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
              className="mt-6 flex w-full items-center justify-between rounded-control bg-pava-green px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-pava-cream transition-colors hover:bg-pava-green-light"
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
