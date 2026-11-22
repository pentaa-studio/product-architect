import Link from "next/link";
import type { Lang } from "@/lib/blog";
import { blogPath } from "@/lib/blog";
import { BLOG_TEXT } from "@/lib/blog-i18n";

// Habillage des pages du blog : la clarté de l'os, faite pour lire.
// `altHref` mène à la même page dans l'autre langue, quand elle existe.
export default function BlogShell({
  children,
  lang = "fr",
  altHref,
}: {
  children: React.ReactNode;
  lang?: Lang;
  altHref?: string;
}) {
  const t = BLOG_TEXT[lang];
  return (
    <div lang={lang} className="min-h-screen bg-bone text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-[6vw] md:px-6">
          <Link href="/" className="font-bold tracking-tight">
            Benjamin Arthuys
          </Link>
          <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em] sm:gap-6">
            <Link href={blogPath(lang)} className="hover:text-morpho">
              {t.reflections}
            </Link>
            {altHref && (
              <Link href={altHref} hrefLang={lang === "fr" ? "en" : "fr"} aria-label={t.otherLanguageLabel} className="text-mist hover:text-morpho">
                {t.otherLanguage}
              </Link>
            )}
            <Link href="/#candidater" className="rounded-full border border-ink px-4 py-2 hover:bg-ink hover:text-bone">
              {t.apply}
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1100px] justify-between gap-4 px-[6vw] py-10 font-mono text-xs uppercase tracking-[0.2em] text-mist md:px-6">
          <p>Benjamin Arthuys · Product Architect</p>
          <Link href="/" className="hover:text-morpho">
            {t.home}
          </Link>
        </div>
      </footer>
    </div>
  );
}
