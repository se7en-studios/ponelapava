"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  size?: "sm" | "md";
  overlay?: boolean;
  /** Botón redondo solo-ícono (cards en pantallas táctiles). */
  compact?: boolean;
}

export default function AddToCartButton({
  product,
  disabled = false,
  size = "sm",
  overlay = false,
  compact = false,
}: AddToCartButtonProps) {
  const { addItem, setDrawer } = useCart();
  const [added, setAdded] = useState(false);

  // Red de contención propia: aunque quien lo monta se olvide de pasar
  // `disabled`, un producto sin stock nunca puede agregarse.
  const unavailable =
    disabled || product.status === "out_of_stock" || product.stock <= 0;

  const handleAdd = () => {
    if (unavailable || added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setDrawer(true);
    }, 1000);
  };

  if (unavailable) {
    return (
      <button
        disabled
        className={`font-display flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-pava-ink/30 py-2.5 text-[15px] uppercase tracking-[0.04em] text-pava-ink/45 cursor-not-allowed ${
          overlay ? "bg-pava-paper/90" : "bg-pava-cream-dark"
        }`}
      >
        Sin stock
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`flex h-10 w-10 items-center justify-center rounded-[6px] border-2 border-pava-ink shadow-[2px_2px_0_#1f3a2b] transition-colors active:translate-x-px active:translate-y-px active:shadow-none ${
          added
            ? "bg-pava-leaf text-pava-paper"
            : "bg-pava-gold text-pava-ink"
        }`}
        aria-label={
          added
            ? "Producto agregado al carrito"
            : `Agregar ${product.name} al carrito`
        }
      >
        {added ? <Check size={15} /> : <ShoppingBag size={15} />}
      </button>
    );
  }

  if (overlay) {
    return (
      <button
        onClick={handleAdd}
        className={`font-display flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-pava-ink py-2 text-[16px] uppercase tracking-[0.04em] shadow-[2px_3px_0_#1f3a2b] transition-all duration-200 active:translate-x-px active:translate-y-px active:shadow-none ${
          added
            ? "bg-pava-leaf text-pava-paper"
            : "bg-pava-gold text-pava-ink hover:bg-pava-leaf hover:text-pava-paper"
        }`}
        aria-label={
          added
            ? "Producto agregado al carrito"
            : `Agregar ${product.name} al carrito`
        }
      >
        {added ? (
          <>
            <Check size={13} />
            Agregado
          </>
        ) : (
          <>
            <ShoppingBag size={13} />
            Agregar al carrito
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`font-display w-full flex items-center justify-center gap-2 rounded-[6px] ${
        size === "sm" ? "py-2.5 text-[16px]" : "py-3 text-[18px]"
      } border-2 border-pava-ink uppercase tracking-[0.04em] shadow-[3px_3px_0_#1f3a2b] transition-all duration-200 ${
        added
          ? "bg-pava-leaf text-pava-paper"
          : "bg-pava-paper text-pava-ink hover:bg-pava-leaf hover:text-pava-paper"
      } active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`}
      aria-label={
        added
          ? "Producto agregado al carrito"
          : `Agregar ${product.name} al carrito`
      }
    >
      {added ? (
        <>
          <Check size={14} />
          Agregado
        </>
      ) : (
        <>
          <ShoppingBag size={14} />
          Agregar
        </>
      )}
    </button>
  );
}
