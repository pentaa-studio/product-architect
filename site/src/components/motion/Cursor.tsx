"use client";

import { useEffect, useRef } from "react";

// Curseur sur mesure : un point précis et un anneau qui suit avec inertie, et grossit sur les liens.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100, scale: 1, targetScale: 1 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const interactive = (e.target as HTMLElement).closest("a, button, summary, input, select, textarea, [data-cursor]");
      ring.targetScale = interactive ? 2.4 : 1;
    };
    const onDown = () => (ring.targetScale *= 0.75);

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      ring.scale += (ring.targetScale - ring.scale) * 0.15;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) scale(${ring.scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ringRef} className="absolute -left-4 -top-4 size-8 rounded-full border border-morpho mix-blend-difference" />
      <div ref={dotRef} className="absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-morpho" />
    </div>
  );
}
