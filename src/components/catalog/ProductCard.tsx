"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, Heart, Scale } from "lucide-react";
import { Product } from "@/types";
import {
  formatPrice,
  getCategoryLabel,
  LOW_STOCK_THRESHOLD,
  truncate,
  unitPrice,
} from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";
import { useComparison } from "@/context/ComparisonContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { whatsappChatUrl } from "@/lib/whatsapp";
import Badge from "@/components/ui/Badge";
import AddToCartButton from "./AddToCartButton";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

export default function ProductCard({
  product,
  view = "grid",
}: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToComparison, isComparing } = useComparison();
  const settings = useSiteSettings();
  const favorite = isFavorite(product.id);
  const comparing = isComparing(product.id);
  // Sin stock es sin stock, lo diga el estado o lo diga el número. Gatear sólo
  // por `status` dejaba el botón habilitado en productos con stock 0, que
  // entraban al carrito con cantidad 0 y no se podían comprar ni sumar.
  const isOutOfStock = product.status === "out_of_stock" || product.stock <= 0;
  const isFeatured = product.status === "featured";
  const isLowStock =
    !isOutOfStock && product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const perUnit = unitPrice(product.price, product.weight);

  if (view === "list") {
    return (
      <article className="group flex gap-4 rounded-card border border-pava-brown/8 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:p-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-control">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="96px"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-pava-brown/50 flex items-center justify-center">
              <span className="text-[10px] text-white font-semibold">
                Agotado
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Badge variant="category">
                  {getCategoryLabel(product.category)}
                </Badge>
                {isFeatured && <Badge variant="featured">Destacado</Badge>}
                {isLowStock && (
                  <Badge variant="low_stock">
                    Últimas {product.stock} unidades
                  </Badge>
                )}
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                aria-label={
                  favorite
                    ? `Quitar ${product.name} de favoritos`
                    : `Agregar ${product.name} a favoritos`
                }
                aria-pressed={favorite}
                className="shrink-0 text-pava-brown/40 hover:text-pava-terracotta transition-colors"
              >
                <Heart
                  size={18}
                  className={
                    favorite ? "fill-pava-terracotta text-pava-terracotta" : ""
                  }
                />
              </button>
            </div>
            <Link href={`/producto/${product.id}`}>
              <h3 className="font-medium text-pava-brown hover:text-pava-green transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-pava-brown-mid/70 mt-1">
              {truncate(product.description, 80)}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span>
              <span className="font-display text-lg font-bold text-pava-green block">
                {formatPrice(product.price)}
              </span>
            </span>
            <div className="w-32">
              <AddToCartButton
                product={product}
                disabled={isOutOfStock}
                size="sm"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view — tarjeta de tienda: foto grande, nombre y precio en texto chico.
  return (
    <article className="product-card group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-control bg-pava-cream-dark transition-shadow duration-500 group-hover:shadow-[0_22px_40px_-24px_rgba(38,64,46,0.55)]">
        <Link
          href={`/producto/${product.id}`}
          aria-label={`Ver ${product.name}`}
          tabIndex={-1}
          className="relative block h-full w-full"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] ${
              isOutOfStock ? "grayscale-[70%] opacity-85" : ""
            } ${product.images[1] ? "[@media(hover:hover)]:group-hover:opacity-0" : ""}`}
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          {/* Segunda foto al pasar el mouse (solo si el producto la tiene) */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              className="hidden object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:hover)]:block"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          )}
        </Link>

        {(isOutOfStock || isLowStock) && (
          <span
            className={`absolute left-2.5 top-2.5 rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm ${isOutOfStock ? "bg-pava-brown/85 text-pava-cream" : "bg-pava-gold text-pava-brown"}`}
          >
            {isOutOfStock ? "Agotado" : `Últimas ${product.stock}`}
          </span>
        )}

        <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-label={
              favorite
                ? `Quitar ${product.name} de favoritos`
                : `Agregar ${product.name} a favoritos`
            }
            aria-pressed={favorite}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-opacity duration-200 ${
              favorite
                ? "text-pava-terracotta opacity-100"
                : // Invisible no puede ser clickeable; con foco de teclado se muestra.
                  "text-pava-brown opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
            }`}
          >
            <Heart
              size={14}
              className={favorite ? "fill-pava-terracotta" : ""}
            />
          </button>
          <button
            onClick={() => addToComparison(product)}
            aria-label={
              comparing
                ? `En comparador: ${product.name}`
                : `Comparar ${product.name}`
            }
            title={comparing ? "En comparador" : "Comparar producto"}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-opacity duration-200 ${
              comparing
                ? "bg-pava-green text-white opacity-100"
                : "bg-white/90 text-pava-brown opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
            }`}
          >
            <Scale size={13} />
          </button>
          <button
            onClick={() => setQuickViewOpen(true)}
            aria-label={`Vista rápida de ${product.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-pava-brown opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto"
          >
            <Eye size={14} />
          </button>
        </div>

        {isOutOfStock && (
          <a
            href={whatsappChatUrl(
              settings.whatsappNumber,
              `¡Hola! ¿Me avisan cuando vuelva a entrar "${product.name}"?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1.5 rounded-full bg-pava-cream/95 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-pava-green shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Bell size={12} aria-hidden="true" />
            Avisame
          </a>
        )}

        {!isOutOfStock && (
          <>
            {/* Desktop: aparece al pasar el mouse */}
            <div className="product-card-btn absolute inset-x-0 bottom-0 hidden p-2.5 [@media(hover:hover)]:block">
              <AddToCartButton product={product} size="sm" overlay />
            </div>
            {/* Táctil: no hay hover, botón chico siempre visible */}
            <div className="absolute bottom-2.5 right-2.5 [@media(hover:hover)]:hidden">
              <AddToCartButton product={product} compact />
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-0.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-pava-brown-mid/60">
          {getCategoryLabel(product.category)}
        </span>
        <Link
          href={`/producto/${product.id}`}
          className="line-clamp-2 text-[13px] font-medium leading-snug text-pava-brown transition-colors hover:text-pava-green sm:text-sm"
        >
          {product.name}
        </Link>
        <span className="mt-0.5 text-[13px] font-semibold text-pava-green sm:text-sm">
          {formatPrice(product.price)}
          {perUnit && (
            <span className="ml-1.5 text-[11px] font-normal text-pava-brown-mid/60">
              {perUnit}
            </span>
          )}
        </span>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </article>
  );
}
