"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/content/butterfly";

gsap.registerPlugin(ScrollTrigger);


// Stade de la métamorphose pour chaque chapitre : œuf, cocon, papillon.
const stage = (i: number) => (i <= 1 ? 0 : i <= 5 ? 1 : 2);

function Glyph({ s }: { s: number }) {
  if (s === 0)
    return (
      <svg viewBox="0 0 60 80" className="h-16 w-12" aria-hidden>
        <ellipse cx="30" cy="44" rx="20" ry="27" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 4" />
      </svg>
    );
  if (s === 1)
    return (
      <svg viewBox="0 0 60 80" className="h-16 w-12" aria-hidden>
        <path d="M30 6 C48 20 48 62 30 76 C12 62 12 20 30 6 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M22 26 Q30 30 38 26 M20 40 Q30 45 40 40 M22 54 Q30 58 38 54" fill="none" stroke="currentColor" strokeWidth="1" opacity=".6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden>
      <path d="M40 40 C30 10 4 8 8 30 C10 44 28 44 40 40 Z M40 40 C50 10 76 8 72 30 C70 44 52 44 40 40 Z M40 40 C30 50 14 66 24 72 C32 76 38 58 40 40 Z M40 40 C50 50 66 66 56 72 C48 76 42 58 40 40 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Chapters({ bookUrl }: { bookUrl: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    // Sur mobile, les chapitres s'empilent simplement.
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Chaque panneau se révèle quand il traverse l'écran.
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll("[data-rise]"),
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="methode" data-bg="night" className="relative overflow-hidden">
      <div className="flex min-h-svh flex-col justify-center py-16">
        <div ref={trackRef} className="flex w-max items-stretch gap-6 px-[6vw] max-md:flex-col max-md:w-full">
          <div className="flex w-[min(80vw,560px)] shrink-0 flex-col justify-center max-md:w-full">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-mist">Ma méthode</p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-extrabold leading-[0.9]">
              Le <span className="iridescent">Butterfly</span> Process
            </h2>
            <p className="mt-6 max-w-[42ch] text-lg text-mist">
              Treize chapitres que j’ai façonnés en près de quinze ans de startups, de Barcelone à Biarritz. C’est le
              fil de tout ce que j’enseigne.
            </p>
            <p className="mt-6 font-display text-2xl italic">« Un process qui ne bouge pas est déjà mort. »</p>
          </div>

          {CHAPTERS.map((title, i) => (
            <article
              key={title}
              data-panel
              className="hairline relative flex w-[min(72vw,380px)] shrink-0 flex-col justify-between rounded-2xl border p-7 max-md:w-full max-md:min-h-[220px] md:min-h-[min(62vh,520px)]"
            >
              <div data-rise className={stage(i) === 2 ? "text-imago" : stage(i) === 1 ? "text-violet" : "text-mist"}>
                <Glyph s={stage(i)} />
              </div>
              <div>
                <span data-rise className="text-outline block font-mono text-[clamp(5rem,10vw,9rem)] font-bold leading-none">
                  {String(i).padStart(2, "0")}
                </span>
                <h3 data-rise className="mt-4 text-2xl font-bold leading-tight">
                  {title}
                </h3>
              </div>
            </article>
          ))}

          <a
            href={bookUrl}
            data-panel
            className="group flex w-[min(72vw,380px)] shrink-0 flex-col items-start justify-end rounded-2xl bg-imago p-7 text-night max-md:w-full max-md:min-h-[220px] md:min-h-[min(62vh,520px)]"
          >
            <span data-rise className="font-mono text-xs uppercase tracking-[0.3em]">
              Le livre, en accès libre
            </span>
            <span data-rise className="mt-3 text-4xl font-extrabold leading-tight">
              À toi de voler →
            </span>
          </a>
        </div>
      </div>
      <div className="absolute inset-x-[6vw] bottom-8 h-px bg-white/10 max-md:hidden">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-morpho via-violet to-imago" />
      </div>
    </section>
  );
}
