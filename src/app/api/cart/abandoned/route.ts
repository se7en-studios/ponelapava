import { NextRequest, NextResponse } from "next/server";
import { upsertAbandonedCart, getAbandonedCartById } from "@/lib/abandonedCarts";
import { isRateLimited, tooManyRequests } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabase";
import { computeOrderTotals } from "@/lib/pricing";
import { CartItem } from "@/types";

const MAX_CART_LINES = 50;
const MAX_QUANTITY_PER_ITEM = 100;

// El total que manda el navegador no se guarda: se recalcula con los precios
// de la tabla products (misma regla que /api/orders vía computeOrderTotals).
// Las líneas con productos inexistentes o cantidades inválidas se descartan.
async function priceCartItems(
  raw: unknown[],
): Promise<{ items: CartItem[]; total: number }> {
  const candidates = raw.filter(
    (item): item is CartItem =>
      typeof (item as CartItem)?.product?.id === "string" &&
      Number.isInteger((item as CartItem).quantity) &&
      (item as CartItem).quantity > 0 &&
      (item as CartItem).quantity <= MAX_QUANTITY_PER_ITEM,
  );
  if (candidates.length === 0) return { items: [], total: 0 };

  const ids = [...new Set(candidates.map((item) => item.product.id))];
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("id, price")
    .in("id", ids);
  if (error) throw error;

  const priceById = new Map(
    (data as { id: string; price: number }[]).map((p) => [p.id, p.price]),
  );
  const items = candidates
    .filter((item) => priceById.has(item.product.id))
    .map((item) => ({
      ...item,
      product: { ...item.product, price: priceById.get(item.product.id)! },
    }));
  const { total } = computeOrderTotals({
    lines: items.map((item) => ({
      price: item.product.price,
      quantity: item.quantity,
    })),
  });
  return { items, total };
}

export async function POST(request: NextRequest) {
  try {
    if (await isRateLimited(request, "cart")) return tooManyRequests();

    const body = await request.json().catch(() => null);
    if (!body || !body.phone) {
      return NextResponse.json(
        { error: "El teléfono es requerido para registrar el carrito" },
        { status: 400 }
      );
    }
    const rawItems: unknown[] = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length > MAX_CART_LINES) {
      return NextResponse.json(
        { error: "El carrito tiene demasiados productos" },
        { status: 400 }
      );
    }

    const { items, total } = await priceCartItems(rawItems);
    const cart = await upsertAbandonedCart({
      id: typeof body.id === "string" ? body.id : undefined,
      phone: String(body.phone).slice(0, 30),
      customerName:
        typeof body.customerName === "string"
          ? body.customerName.slice(0, 100)
          : undefined,
      items,
      total,
      step: ["contact", "delivery", "payment"].includes(body.step)
        ? body.step
        : "contact",
    });

    // /carrito lee data.cart (autosave y ?recover=). Devolver el carrito
    // suelto hacía que cada autosave creara una fila nueva y que el link de
    // recuperación no restaurara nada.
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api] POST /api/cart/abandoned error:", error);
    return NextResponse.json(
      { error: "Error al guardar carrito abandonado" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID de carrito requerido" }, { status: 400 });
    }

    const cart = await getAbandonedCartById(id);
    if (!cart) {
      return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api] GET /api/cart/abandoned error:", error);
    return NextResponse.json(
      { error: "Error al recuperar carrito" },
      { status: 500 }
    );
  }
}
