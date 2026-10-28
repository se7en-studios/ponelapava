"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { BrandCircle } from "@/components/ui/BrandMark";
import CutText from "@/components/ui/CutText";

// Login del panel con la misma estética de la tienda: la mesa de kraft del
// hero de fondo y el formulario como una nota de papel pegada con cinta.
const inputClass =
  "w-full rounded-[6px] border-2 border-pava-ink/75 bg-[#fffdf7] px-3.5 py-3 text-[15px] text-pava-ink shadow-[2px_3px_0_rgba(31,58,43,0.85)] outline-none transition-[box-shadow,transform] placeholder:text-pava-ink/35 focus:-translate-y-px focus:shadow-[3px_4px_0_#4b8056] focus-visible:outline-none";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const msg = authError.message.toLowerCase();
      setError(
        msg.includes("invalid login") || msg.includes("invalid credentials")
          ? "Email o contraseña incorrectos."
          : "No se pudo iniciar sesión. Probá de nuevo.",
      );
      setLoading(false);
      return;
    }

    // Hard navigation so the server picks up the new session cookie.
    window.location.href = "/admin";
  }

  return (
    <main className="paper-kraft paper-kraft--cover relative flex min-h-[100svh] items-center overflow-hidden px-4 py-10 sm:px-8 lg:px-16">
      <Image
        src="/redesign/hero-kraft.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[78%_22%] opacity-90 lg:object-[70%_50%] lg:opacity-100"
      />
      {/* En celular la mesa queda detrás de la nota: un velo de kraft la calma. */}
      <div aria-hidden className="absolute inset-0 bg-[#c69c6d]/45 lg:hidden" />

      <div className="relative z-10 mx-auto w-full max-w-[25rem] lg:mx-0 lg:ml-[6%]">
        <div
          className="relative bg-[#fbf8f1] px-6 pb-7 pt-10 shadow-[4px_6px_0_rgba(31,58,43,0.35)] sm:px-8"
          style={{ rotate: "-1.2deg" }}
        >
          <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
          <span
            aria-hidden
            className="tape -right-6 bottom-10 hidden rotate-[58deg] sm:block"
          />

          <div className="absolute -left-1 -top-8 sm:-left-8 sm:-top-9">
            <BrandCircle
              size={84}
              className="size-[72px] -rotate-12 drop-shadow-[3px_4px_0_rgba(31,58,43,0.3)] sm:size-[84px]"
            />
          </div>

          <div className="mb-7 text-center">
            <span className="font-script inline-block -rotate-2 text-lg text-pava-leaf">
              solo para el equipo del local
            </span>
            <h1 className="font-display mt-1 text-[2.6rem] uppercase leading-[0.9] text-pava-ink">
              <CutText text="Panel de la pava" animate seed={3} />
            </h1>
            <p className="mt-2 text-sm text-pava-ink/65">
              Ingresá con tu cuenta para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[15px] uppercase tracking-[0.04em] text-pava-ink">
                Email
              </span>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[15px] uppercase tracking-[0.04em] text-pava-ink">
                Contraseña
              </span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-[4px] border-2 border-pava-terracotta bg-[#fbe9e1] px-3 py-2 text-center text-sm font-medium text-pava-terracotta"
                style={{ rotate: "0.6deg" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-paper btn-paper--leaf mt-2 w-full justify-center disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Ingresando..." : "Ingresar"}
              {!loading && <span aria-hidden>→</span>}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="font-script mt-6 inline-flex items-center gap-1.5 text-lg text-pava-ink transition-transform hover:-translate-x-1 lg:ml-2"
        >
          ← volver a la tienda
        </Link>
      </div>
    </main>
  );
}
