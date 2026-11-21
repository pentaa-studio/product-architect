"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Un texte dont les mots s'allument un à un au fil du scroll.
export default function ScrubText({
  text,
  highlight = [],
  className = "",
}: {
  text: string;
  highlight?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLSpanElement>("[data-word]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    const tween = gsap.fromTo(
      words,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 35%", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          data-word
          className={highlight.some((h) => word.toLowerCase().includes(h)) ? "iridescent" : undefined}
          style={{ opacity: 0.12 }}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
