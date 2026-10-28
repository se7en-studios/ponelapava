import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Logo redibujado (círculo verde con las letras recortadas), generado a
// 512 px desde Londrina Solid para que se lea nítido en la pestaña.
const logoBase64 = readFileSync(
  join(process.cwd(), "public", "redesign", "logo-circle-512.png"),
).toString("base64");

export default function Icon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`data:image/png;base64,${logoBase64}`} width={32} height={32} alt="" />,
    size,
  );
}
