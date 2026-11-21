"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hero : des milliers de cellules imaginales flottent dans la nuit du cocon,
// puis se rassemblent en papillon à mesure qu'on descend.

const COLORS = ["#ece8f4", "#ece8f4", "#ece8f4", "#3b5bff", "#8b5cf6", "#c8f542"];

// Courbe papillon de Temple Fay.
function butterflyPoint(t: number) {
  const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5);
  return { x: Math.sin(t) * r, y: -Math.cos(t) * r };
}

const smooth = (a: number, b: number, v: number) => {
  const x = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export default function Imaginals() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const maybeCtx = canvas?.getContext("2d");
    if (!section || !canvas || !maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const COUNT = small ? 1100 : 2400;

    type P = {
      sx: number; sy: number; // position libre (0..1)
      bx: number; by: number; // position dans le papillon
      wing: number; // -1 aile gauche, 1 aile droite
      size: number; color: string; delay: number; phase: number; speed: number;
      x: number; y: number;
    };

    const particles: P[] = Array.from({ length: COUNT }, (_, i) => {
      const t = Math.random() * Math.PI * 12;
      const edge = butterflyPoint(t);
      const fill = i % 5 === 0 ? 1 : Math.sqrt(Math.random()) * 0.92 + 0.08;
      return {
        sx: Math.random(),
        sy: Math.random(),
        bx: edge.x * fill,
        by: edge.y * fill,
        wing: Math.sign(edge.x) || 1,
        size: Math.random() < 0.08 ? 2.6 : 0.9 + Math.random() * 1.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        x: 0,
        y: 0,
      };
    });

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let progress = 0;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => (progress = self.progress),
    });

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(section);

    function frame(now: number) {
      const t = reduce ? 0 : now / 1000;
      const p = reduce ? 0.8 : progress;
      const gather = smooth(0.08, 0.62, p);
      const flap = smooth(0.5, 0.75, p);
      const scale = Math.min(w, h) * (small ? 0.13 : 0.12);
      const cx = w / 2;
      const cy = h * 0.5 + scale * 0.6 - smooth(0.82, 1, p) * h * 0.25;
      // Battement d'ailes : les ailes se replient en perspective.
      const beat = 0.55 + 0.45 * Math.cos(t * 2.6);
      const wingFold = 1 - flap * (1 - beat) * 0.4;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const pt of particles) {
        // Dérive libre, comme en suspension.
        const fx = (pt.sx + Math.sin(t * 0.05 * pt.speed + pt.phase) * 0.03) * w;
        const fy = (pt.sy + Math.cos(t * 0.07 * pt.speed + pt.phase) * 0.04) * h;
        const k = smooth(pt.delay * 0.45, pt.delay * 0.45 + 0.55, gather);
        const bx = cx + pt.bx * scale * wingFold + Math.sin(t * 1.3 + pt.phase) * 1.5;
        const by = cy + pt.by * scale + Math.cos(t * 1.1 + pt.phase) * 1.5 - flap * Math.abs(pt.bx) * (1 - beat) * 6;
        let x = fx + (bx - fx) * k;
        let y = fy + (by - fy) * k;

        // Le curseur écarte les cellules.
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const f = (1 - Math.sqrt(d2) / 120) * 28;
          const d = Math.sqrt(d2) || 1;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
        pt.x += (x - pt.x) * 0.2;
        pt.y += (y - pt.y) * 0.2;

        ctx.globalAlpha = 0.3 + 0.6 * k;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (titleRef.current) {
        const o = 1 - smooth(0.12, 0.32, p);
        titleRef.current.style.opacity = String(o);
        titleRef.current.style.transform = `translateY(${-smooth(0.1, 0.35, p) * 80}px) scale(${1 + smooth(0.1, 0.35, p) * 0.08})`;
        titleRef.current.style.filter = `blur(${smooth(0.12, 0.32, p) * 12}px)`;
      }
      if (subtitleRef.current) {
        const o = smooth(0.62, 0.78, p) * (1 - smooth(0.92, 1, p));
        subtitleRef.current.style.opacity = String(o);
        subtitleRef.current.style.transform = `translateY(${(1 - smooth(0.62, 0.8, p)) * 40}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(0.02, 0.1, p));

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      st.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} data-bg="night" className="relative h-[320vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />

        <div ref={titleRef} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center will-change-transform">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-mist">Benjamin Arthuys · Product Architect</p>
          <h1 className="mt-6 max-w-[14ch] text-[clamp(2.75rem,8.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-tight">
            L’IA redéfinit les règles de la <span className="iridescent">créativité</span>.
          </h1>
        </div>

        <div ref={subtitleRef} className="pointer-events-none absolute inset-x-0 bottom-[9vh] px-4 text-center opacity-0">
          <p className="text-[clamp(1.5rem,3.4vw,3rem)] font-bold leading-tight">
            Je vous forme à l’<span className="iridescent">intelligence créative</span>.
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-mist">Des imaginaux au papillon</p>
        </div>

        <div ref={hintRef} className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
          Descends
          <span className="relative block h-12 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-imago" />
          </span>
        </div>
      </div>
    </section>
  );
}
