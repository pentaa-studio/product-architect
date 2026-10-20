"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Scroll fluide (Lenis) synchronisé avec GSAP, et changement de couleur de page par section.
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!;
      const target = id === "#" ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.6 });
      else if (target === 0) window.scrollTo(0, 0);
      else target.scrollIntoView();
    };
    document.addEventListener("click", onClick);

    // Créés après les sections épinglées, pour tenir compte de leur hauteur réelle.
    let triggers: ScrollTrigger[] = [];
    const setupBg = requestAnimationFrame(() => {
      triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-bg]")).map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) document.documentElement.dataset.bg = section.dataset.bg;
          },
        }),
      );
      ScrollTrigger.refresh();
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(setupBg);
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return <div aria-hidden className="grain" />;
}
