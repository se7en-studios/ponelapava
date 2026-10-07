import { NextRequest, NextResponse } from "next/server";
import { checkCoupon } from "@/lib/coupons";
import { isRateLimited, tooManyRequests } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// Storefront coupon check. Shares checkCoupon with /api/orders so the discount
// shown in the cart is the same one the order is priced with.
export async function POST(req: NextRequest) {
  try {
    if (await isRateLimited(req, "coupons")) {
      return tooManyRequests({ valid: false });
    }
    const body = (await req.json().catch(() => null)) as {
      code?: unknown;
    } | null;
    if (typeof body?.code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Código de cupón requerido" },
        { status: 400 },
      );
    }

    const result = await checkCoupon(body.code);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({ valid: true, coupon: result.coupon });
  } catch (err) {
    console.error("Error validating coupon:", err);
    return NextResponse.json(
      { valid: false, error: "Error al validar el cupón" },
      { status: 500 },
    );
  }
}
