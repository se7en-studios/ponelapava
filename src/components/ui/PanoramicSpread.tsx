"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Reduced-motion leído así hidrata con el valor del server (false) y después
// se actualiza; useReducedMotion de motion lo lee en el primer render y rompe
// la hidratación.
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeRM,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

// Galería "panorámica": las fotos arrancan apiladas y al scrollear se abren en
// un arco 3D. Adaptado de 21st.dev (panoramic-spread-hero) a fotos de producto.

export interface SpreadItem {
  src: string;
  alt: string;
  href: string;
  label: string;
  price: string;
}

interface Pose {
  x: number;
  y: number;
  rotateZ: number;
  rotateY: number;
  scale: number;
}

interface Layout {
  stacked: Pose;
  panoramic: Pose;
  size: { w: string; h: string; ml: string; mt: string };
}

function layoutFor(i: number, total: number) {
  const offset = i - (total - 1) / 2;
  const abs = Math.abs(offset);
  const desktop: Layout = {
    stacked: {
      x: offset * 2,
      y: offset * -2,
      rotateZ: offset * 2.5,
      rotateY: 0,
      scale: 1,
    },
    panoramic: {
      x: offset * 12,
      y: abs * 3,
      rotateZ: offset * 1.5,
      rotateY: offset * -12,
      scale: 1 - abs * 0.05,
    },
    size: { w: "15vw", h: "22vw", ml: "-7.5vw", mt: "-11vw" },
  };
  const mobile: Layout = {
    stacked: {
      x: offset * 1.5,
      y: offset * -1.5,
      rotateZ: offset * 3,
      rotateY: 0,
      scale: 1,
    },
    panoramic: {
      x: offset * 16,
      y: abs * 4,
      rotateZ: offset * 2,
      rotateY: offset * -15,
      scale: 1 - abs * 0.04,
    },
    size: { w: "40vw", h: "56vw", ml: "-20vw", mt: "-28vw" },
  };
  return { z: Math.round(10 - abs), desktop, mobile };
}

const PROGRESS_SPRING = {
  stiffness: 80,
  damping: 25,
  mass: 0.5,
  restDelta: 0.001,
};
const TILT_SPRING = { stiffness: 50, damping: 25, mass: 0.5 };
const MOBILE_BREAKPOINT = 768;

function usePointerTilt(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, TILT_SPRING);
  const tiltY = useSpring(rawY, TILT_SPRING);

  useEffect(() => {
    rawX.set(0);
    rawY.set(0);
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientY / window.innerHeight - 0.5) * -8);
      rawY.set((e.clientX / window.innerWidth - 0.5) * 8);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { tiltX, tiltY };
}

const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

function SpreadCard({
  item,
  layout,
  z,
  progress,
  load,
}: {
  item: SpreadItem;
  layout: Layout;
  z: number;
  progress: MotionValue<number>;
  load: boolean;
}) {
  const { stacked, panoramic, size } = layout;
  const ease = useTransform(progress, easeInOutCubic);
  const x = useTransform(ease, [0, 1], [`${stacked.x}vw`, `${panoramic.x}vw`]);
  const y = useTransform(ease, [0, 1], [`${stacked.y}vh`, `${panoramic.y}vh`]);
  const rotateZ = useTransform(
    ease,
    [0, 1],
    [stacked.rotateZ, panoramic.rotateZ],
  );
  const rotateY = useTransform(
    ease,
    [0, 1],
    [stacked.rotateY, panoramic.rotateY],
  );
  const scale = useTransform(ease, [0, 1], [0.75, panoramic.scale]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ zIndex: z }}
    >
      <motion.div
        className="pointer-events-auto will-change-transform"
        style={{
          width: size.w,
          height: size.h,
          marginLeft: size.ml,
          marginTop: size.mt,
          x,
          y,
          rotateZ,
          rotateY,
          scale,
          transformOrigin: "center center -50px",
        }}
      >
        <Link
          href={item.href}
          className="group flex h-full w-full flex-col rounded-md bg-white p-2 pb-0 shadow-2xl shadow-pava-brown/20 ring-1 ring-pava-brown/10 transition-shadow duration-500 hover:shadow-pava-brown/35 max-md:p-1.5 max-md:pb-0"
        >
          <span className="relative block flex-1 overflow-hidden rounded-sm bg-pava-cream-dark">
            {load && (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              draggable={false}
              // El lazy nativo no detecta la intersección con rotateY/perspective;
              // se montan cuando la sección está cerca (ver `near`) y cargan ya.
              loading="eager"
              sizes="(max-width: 768px) 40vw, 15vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            )}
          </span>
          <span className="flex items-baseline justify-between gap-2 px-1 py-2 max-md:py-1.5">
            <span className="truncate text-[11px] font-medium text-pava-brown md:text-xs">
              {item.label}
            </span>
            <span className="shrink-0 text-[11px] font-semibold text-pava-green md:text-xs">
              {item.price}
            </span>
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

export default function PanoramicSpread({
  items,
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  items: SpreadItem[];
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, PROGRESS_SPRING);
  const scrolled = useTransform(smooth, [0.1, 0.75], [0, 1]);
  // Reduced motion: galería ya abierta, sin scroll-jacking.
  const open = useMotionValue(1);
  const progress = reduce ? open : scrolled;

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setSpread(p > 0.95));
  const { tiltX, tiltY } = usePointerTilt(spread && !reduce && !isMobile);

  const textY = useTransform(
    progress,
    [0.2, 1],
    ["8vh", isMobile ? "-26vh" : "-29vh"],
  );
  const textScale = useTransform(progress, [0.2, 1], [0.85, 1]);
  const textOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  return (
    <section
      ref={wrapRef}
      aria-label={title}
      className={`relative w-full bg-pava-cream text-pava-brown ${reduce ? "h-[100svh]" : "h-[220vh] md:h-[300vh]"}`}
    >
      <div
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const { z, desktop, mobile } = layoutFor(i, items.length);
            return (
              <SpreadCard
                key={item.href}
                item={item}
                layout={isMobile ? mobile : desktop}
                z={z}
                progress={progress}
                load={near}
              />
            );
          })}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute z-[5] flex flex-col items-center px-6 text-center"
          style={{ y: textY, scale: textScale, opacity: textOpacity }}
        >
          <span className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-pava-gold-deep">
            {eyebrow}
          </span>
          <h2 className="font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-pava-brown-mid/80 sm:text-base">
            {description}
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-10 z-20 sm:bottom-14"
          style={{ opacity: textOpacity }}
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-control bg-pava-green px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-pava-cream transition-colors hover:bg-pava-green-light"
          >
            {ctaLabel}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
