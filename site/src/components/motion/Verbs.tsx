"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// « Écoute. Clarifie. Expérimente. Ajuste. Incarne. » — les derniers mots du livre, un par un.
const VERBS = ["Écoute.", "Clarifie.", "Expérimente.", "Ajuste.", "Incarne."];

export default function Verbs() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-verb]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.6 },
      });
      words.forEach((w, i) => {
        tl.fromTo(
          w,
          { yPercent: 110, rotate: 4, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1, ease: "power3.out" },
          i * 0.8,
        );
        if (i < words.length - 1) tl.to(w, { opacity: 0.18, duration: 0.6 }, i * 0.8 + 0.9);
      });
      tl.to("[data-verb-last]", { scale: 1.06, color: "var(--color-imago)", duration: 0.8 }, ">-0.2");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} data-bg="night" className="flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div className="flex flex-col items-center text-center">
        {VERBS.map((verb, i) => (
          <span key={verb} className="block overflow-hidden py-[0.04em]">
            <span
              data-verb
              {...(i === VERBS.length - 1 ? { "data-verb-last": true } : {})}
              className="block text-[clamp(3rem,10vw,9.5rem)] font-extrabold leading-[0.95] tracking-tight"
            >
              {verb}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
