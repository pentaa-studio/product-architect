"use client";

import { useEffect, useRef, useState } from "react";

// Parcours — la vie monte, descend, ondule. Coordonnées en unités de la maquette Figma (frame 1440px).
const DESIGN_WIDTH = 1440;
const HEIGHT = 224;
const BASELINE = 102;
const STEP = 3;
const HEAD_END = 1404; // "aujourd'hui"
const INTRO_MS = 5600;

// La vie au-dessus de la vague, la carrière en dessous (sur deux rangées pour respirer).
const LIFE_Y = 6;
const CAREER_Y = [152, 188];

type Step = {
  kind: "life" | "career";
  title: string;
  year?: string;
  place?: string;
  x: number;
  y: number;
};

const life = (title: string, x: number, year?: string, place?: string): Step => ({
  kind: "life",
  title,
  year,
  place,
  x,
  y: LIFE_Y,
});

const career = (title: string, x: number, row: 0 | 1, year?: string, place?: string): Step => ({
  kind: "career",
  title,
  year,
  place,
  x,
  y: CAREER_Y[row],
});

const steps: Step[] = [
  life("Né à Toulouse", 14, "1986"),
  career("Fondateur", 60, 0, "2008", "Marque PEE"),
  life("San Francisco", 128, "2009", "Vendre PEE"),
  career("Product Designer", 190, 1, "2012", "Mediaswapp"),
  life("Barcelone", 268, "2012 – 2015"),
  career("Dev Front", 320, 0, "2015", "Mobintouch"),
  career("Rédac chef", 440, 1, "Blog tech"),
  life("Van life", 500, "Camion fait de A à Z"),
  career("Développeur logiciel", 600, 0, "Certification gouv"),
  life("Pays Basque", 690, "Les vagues"),
  career("Product Manager", 740, 1, "2018", "Syment"),
  career("Head of Product", 850, 0, "Certification Thiga"),
  career("Head of Product", 960, 1, "2020", "Syment"),
  career("CPO", 1060, 0, "2021", "Ternoa"),
  career("Product Architect", 1160, 1, "since 2023", "Pentaa Studio"),
  career("Formateur IA", 1250, 0, "CCI · Maria School"),
];

type Icon = { src: string; x: number; size: number };

const icons: Icon[] = [
  { src: "/figma/bridge.svg", x: 168, size: 24 },
  { src: "/figma/sagrada-familia.png", x: 300, size: 17 },
  { src: "/figma/surfer-van.svg", x: 540, size: 22 },
  { src: "/figma/moonwave.svg", x: 722, size: 21 },
  { src: "/figma/mountain-road.svg", x: 1144, size: 17 },
];

const LABEL_HEIGHT = 30;
const isAbove = (s: Step) => s.y < BASELINE - 40;

// La vague : une enveloppe lente (les hauts et les bas de la vie), des oscillations plus rapides
// qui respirent dans le temps, et une tendance qui monte doucement vers aujourd'hui.
function lifeWave(x: number, t: number) {
  const envelope = 17 + 8 * Math.sin(x * 0.0023 + 1.3) + 6 * Math.sin(x * 0.0061 + 0.4);
  const swell =
    0.5 * Math.sin(x * 0.155 + t * 1.1) +
    0.35 * Math.sin(x * 0.097 - t * 0.7 + 1.7) +
    0.25 * Math.sin(x * 0.041 + t * 0.4) +
    0.2 * Math.sin(x * 0.27 - t * 1.6 + 0.6);
  const trend = 6 - (x / DESIGN_WIDTH) * 12;
  return BASELINE + trend - envelope * swell;
}

const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function pathFor(ys: Float32Array, sx: number, until = DESIGN_WIDTH, yAtUntil?: number) {
  let d = "";
  for (let i = 0; i < ys.length; i++) {
    const x = i * STEP;
    if (x > until) break;
    d += `${i === 0 ? "M" : "L"}${(x * sx).toFixed(1)} ${ys[i].toFixed(1)}`;
  }
  if (yAtUntil !== undefined && until < DESIGN_WIDTH) d += `L${(until * sx).toFixed(1)} ${yAtUntil.toFixed(1)}`;
  return d;
}

export default function Timeline() {
  const [active, setActive] = useState<number | null>(null);
  const [explored, setExplored] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const rippleRef = useRef<SVGCircleElement>(null);
  const todayRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const linkRefs = useRef<(SVGLineElement | null)[]>([]);
  const iconRefs = useRef<(SVGGElement | null)[]>([]);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    const svg = svgRef.current;
    if (!section || !scroller || !svg) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ys = new Float32Array(Math.floor(DESIGN_WIDTH / STEP) + 1);

    let width = scroller.scrollWidth;
    let sx = width / DESIGN_WIDTH;
    let introStart: number | null = reduceMotion ? -Infinity : null;
    let visible = false;
    let raf = 0;
    let userPanned = false;
    // Pendant l'intro, chaque étape se dévoile un instant au passage du point.
    const flashUntil = new Float64Array(steps.length);
    const wasReached = steps.map(() => false);

    // Ondulation locale sous le curseur ou l'étape survolée.
    const pointer = { x: -1000, targetX: -1000, amp: 0, targetAmp: 0 };

    const yAt = (x: number, t: number) => {
      const dx = x - pointer.x;
      const ripple = pointer.amp * Math.exp(-(dx * dx) / (2 * 70 * 70)) * Math.sin(dx * 0.12 - t * 5);
      return lifeWave(x, t) + ripple;
    };

    const frame = (now: number) => {
      const t = reduceMotion ? 0 : now / 1000;

      const hovered = activeRef.current;
      if (hovered !== null) {
        pointer.targetX = steps[hovered].x;
        pointer.targetAmp = 16;
      }
      pointer.x += (pointer.targetX - pointer.x) * 0.15;
      pointer.amp += (pointer.targetAmp - pointer.amp) * 0.08;

      const p = introStart === null ? 0 : Math.min(1, (now - introStart) / INTRO_MS);
      const progress = reduceMotion ? 1 : easeInOutCubic(p);
      const headX = progress * HEAD_END;

      for (let i = 0; i < ys.length; i++) ys[i] = yAt(i * STEP, t);
      const headY = yAt(headX, t);

      basePathRef.current?.setAttribute("d", pathFor(ys, sx));
      progressPathRef.current?.setAttribute("d", progress > 0 ? pathFor(ys, sx, headX, headY) : "");
      gradientRef.current?.setAttribute("x2", String(Math.max(1, headX * sx)));

      if (headRef.current) {
        headRef.current.setAttribute("transform", `translate(${(headX * sx).toFixed(1)} ${headY.toFixed(1)})`);
        headRef.current.style.opacity = progress > 0 ? "1" : "0";
      }
      if (rippleRef.current) {
        const phase = reduceMotion ? 0.4 : (t * 0.7) % 1;
        rippleRef.current.setAttribute("r", (4 + phase * 16).toFixed(1));
        rippleRef.current.style.opacity = ((1 - phase) * 0.45).toFixed(2);
      }
      if (todayRef.current) {
        todayRef.current.style.left = `${(headX * sx).toFixed(1)}px`;
        todayRef.current.style.top = `${(headY - 26).toFixed(1)}px`;
        todayRef.current.dataset.reached = String(progress >= 1);
      }

      steps.forEach((step, i) => {
        const cy = yAt(step.x, t);
        const reached = headX >= step.x;
        const dot = dotRefs.current[i];
        if (dot) {
          dot.setAttribute("cx", (step.x * sx).toFixed(1));
          dot.setAttribute("cy", cy.toFixed(1));
          dot.dataset.reached = String(reached);
        }
        const link = linkRefs.current[i];
        if (link) {
          const labelEdge = isAbove(step) ? step.y + LABEL_HEIGHT : step.y - 4;
          link.setAttribute("x1", (step.x * sx).toFixed(1));
          link.setAttribute("x2", (step.x * sx).toFixed(1));
          link.setAttribute("y1", cy.toFixed(1));
          link.setAttribute("y2", labelEdge.toFixed(1));
        }
        if (reached && !wasReached[i] && !reduceMotion && progress < 1) flashUntil[i] = now + 1700;
        wasReached[i] = reached;
        const show = String(hovered !== null ? hovered === i : now < flashUntil[i]);
        if (link && link.dataset.show !== show) link.dataset.show = show;
        const label = labelRefs.current[i];
        if (label && label.dataset.show !== show) label.dataset.show = show;
      });

      // Les icônes surfent sur la vague et suivent sa pente.
      icons.forEach((icon, i) => {
        const g = iconRefs.current[i];
        if (!g) return;
        const y = yAt(icon.x, t);
        const slope = (yAt(icon.x + 14, t) - yAt(icon.x - 14, t)) / 28;
        const angle = Math.max(-30, Math.min(30, (Math.atan(slope) * 180) / Math.PI));
        g.setAttribute(
          "transform",
          `translate(${(icon.x * sx).toFixed(1)} ${(y - 3).toFixed(1)}) rotate(${angle.toFixed(1)})`,
        );
        g.dataset.reached = String(headX >= icon.x - 10);
      });

      // Sur petit écran, la frise suit le point pendant qu'il raconte l'histoire.
      if (!userPanned && progress > 0 && progress < 1 && scroller.scrollWidth > scroller.clientWidth) {
        scroller.scrollLeft = headX * sx - scroller.clientWidth * 0.6;
      }

      if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = scroller.scrollWidth;
      sx = width / DESIGN_WIDTH;
      svg.setAttribute("viewBox", `0 0 ${width} ${HEIGHT}`);
      if (reduceMotion || !visible) frame(performance.now());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scroller);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && introStart === null && entry.intersectionRatio >= 0.35) introStart = performance.now();
        cancelAnimationFrame(raf);
        if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(section);

    // L'étape la plus proche du curseur s'allume.
    const onMove = (e: PointerEvent) => {
      const rect = scroller.getBoundingClientRect();
      const x = (e.clientX - rect.left + scroller.scrollLeft) / sx;
      let nearest: number | null = null;
      let best = 45;
      steps.forEach((step, i) => {
        const d = Math.abs(step.x - x);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActive(nearest);
        if (nearest !== null) setExplored(true);
      }
      if (nearest === null) {
        pointer.targetX = x;
        pointer.targetAmp = 12;
      }
    };
    const onLeave = () => {
      activeRef.current = null;
      setActive(null);
      pointer.targetAmp = 0;
    };
    const stopAutoPan = () => {
      userPanned = true;
    };
    scroller.addEventListener("pointermove", onMove);
    scroller.addEventListener("pointerdown", onMove);
    scroller.addEventListener("pointerleave", onLeave);
    scroller.addEventListener("touchstart", stopAutoPan, { passive: true });
    scroller.addEventListener("wheel", stopAutoPan, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerdown", onMove);
      scroller.removeEventListener("pointerleave", onLeave);
      scroller.removeEventListener("touchstart", stopAutoPan);
      scroller.removeEventListener("wheel", stopAutoPan);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="Parcours">
      <div
        ref={scrollerRef}
        className={`overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          active !== null ? "cursor-pointer" : ""
        }`}
      >
        <div className="relative min-w-[1200px]" style={{ height: HEIGHT }}>
          <svg ref={svgRef} aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="life-progress" ref={gradientRef} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--color-line)" />
                <stop offset="0.55" stopColor="var(--color-ink)" />
                <stop offset="1" stopColor="var(--color-morpho)" />
              </linearGradient>
            </defs>

            <path ref={basePathRef} fill="none" stroke="var(--color-line)" strokeWidth={1} />
            <path
              ref={progressPathRef}
              fill="none"
              stroke="url(#life-progress)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {steps.map((step, i) => (
              <line
                key={`link-${i}`}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                stroke="var(--color-ink)"
                strokeWidth={0.75}
                strokeDasharray="2 3"
                className="opacity-0 transition-opacity duration-300 data-[show=true]:opacity-30"
              />
            ))}

            {icons.map((icon, i) => (
              <g
                key={icon.src}
                ref={(el) => {
                  iconRefs.current[i] = el;
                }}
                className="opacity-0 transition-opacity duration-700 data-[reached=true]:opacity-100"
              >
                <image href={icon.src} x={-icon.size / 2} y={-icon.size} width={icon.size} height={icon.size} />
              </g>
            ))}

            {steps.map((step, i) => (
              <circle
                key={`dot-${i}`}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                r={active === i ? 4.5 : step.kind === "life" ? 3 : 2.5}
                fill={
                  active === i ? "var(--color-morpho)" : step.kind === "life" ? "var(--color-bone)" : "var(--color-ink)"
                }
                stroke={step.kind === "life" ? "var(--color-ink)" : "none"}
                strokeWidth={1.2}
                className="opacity-0 transition-[opacity,r,fill] duration-500 data-[reached=true]:opacity-100"
              />
            ))}

            <g ref={headRef} style={{ opacity: 0 }}>
              <circle ref={rippleRef} r={4} fill="none" stroke="var(--color-morpho)" strokeWidth={1} />
              <circle r={7} fill="var(--color-morpho)" opacity={0.18} />
              <circle r={3.5} fill="var(--color-morpho)" />
            </g>
          </svg>

          <span
            ref={todayRef}
            className="pointer-events-none absolute -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-wider text-morpho opacity-0 transition-opacity duration-700 data-[reached=true]:opacity-100"
          >
            aujourd’hui
          </span>

          <ol>
            {steps.map((step, i) => (
              <li
                key={`${step.title}-${step.x}`}
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                tabIndex={0}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`pointer-events-none absolute flex flex-col gap-px whitespace-nowrap text-xs opacity-0 outline-none transition-[opacity,transform] duration-300 ease-out data-[show=true]:translate-y-0 data-[show=true]:opacity-100 ${
                  isAbove(step) ? "translate-y-2" : "-translate-y-2"
                }`}
                style={{ left: `${(step.x / DESIGN_WIDTH) * 100}%`, top: step.y }}
              >
                <span
                  className={`font-mono font-bold uppercase transition-colors duration-300 ${
                    active === i ? "text-morpho" : ""
                  }`}
                >
                  {step.title}
                </span>
                {(step.year || step.place) && (
                  <span className="flex gap-[9px] font-display">
                    {step.year && <span>{step.year}</span>}
                    {step.place && <span>{step.place}</span>}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p
        aria-hidden
        className={`mt-1 text-center font-mono text-[10px] uppercase tracking-widest transition-opacity duration-700 ${
          explored ? "opacity-0" : "opacity-50"
        }`}
      >
        <span className="[@media(hover:none)]:hidden">Survolez la vague pour découvrir mon parcours</span>
        <span className="hidden [@media(hover:none)]:inline">Touchez la vague pour découvrir mon parcours</span>
      </p>
    </section>
  );
}
