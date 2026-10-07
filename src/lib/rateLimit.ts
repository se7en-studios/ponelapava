import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Ventana fija por (bucket, sha256(ip)) contada en public.rate_limit_hits.
// Server-only: usa la service-role key.
//
// ponytail: count + insert no es atómico, dos requests simultáneos pueden
// pasar ambos el último cupo. Para frenar enumeración/fuerza bruta alcanza;
// si hace falta exactitud, mover a una función SQL con lock.
const WINDOW_MS = 10 * 60 * 1000;
const CLEANUP_PROBABILITY = 0.02;
const RETENTION_MS = 24 * 60 * 60 * 1000;

export const RATE_LIMITS = {
  tracking: 5,
  coupons: 10,
  orders: 10,
  cart: 30,
} as const;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

export const RATE_LIMIT_MESSAGE =
  "Hiciste demasiados intentos en poco tiempo. Esperá unos minutos y probá de nuevo.";

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

// true = bloquear. Ante cualquier error de la base falla ABIERTO: el límite
// es una protección extra, no puede tumbar el checkout.
export async function isRateLimited(
  request: NextRequest,
  bucket: RateLimitBucket,
): Promise<boolean> {
  try {
    const keyHash = createHash("sha256").update(clientIp(request)).digest("hex");
    const admin = supabaseAdmin();
    const since = new Date(Date.now() - WINDOW_MS).toISOString();

    const { count, error } = await admin
      .from("rate_limit_hits")
      .select("id", { count: "exact", head: true })
      .eq("bucket", bucket)
      .eq("key_hash", keyHash)
      .gte("created_at", since);
    if (error) throw error;
    if ((count ?? 0) >= RATE_LIMITS[bucket]) return true;

    const { error: insertError } = await admin
      .from("rate_limit_hits")
      .insert({ bucket, key_hash: keyHash });
    if (insertError) throw insertError;

    // ponytail: limpieza oportunista en vez de un cron; alcanza para el
    // tráfico de una sola tienda.
    if (Math.random() < CLEANUP_PROBABILITY) {
      const cutoff = new Date(Date.now() - RETENTION_MS).toISOString();
      const { error: cleanupError } = await admin
        .from("rate_limit_hits")
        .delete()
        .lt("created_at", cutoff);
      if (cleanupError) console.error("[rate-limit] cleanup failed:", cleanupError);
    }
    return false;
  } catch (err) {
    console.error(`[rate-limit] ${bucket} check failed, allowing request:`, err);
    return false;
  }
}

export function tooManyRequests(extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json(
    { ...extra, error: RATE_LIMIT_MESSAGE },
    { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } },
  );
}
