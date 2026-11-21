import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import { blogPath, formatDate, getPosts, readingTime, type Lang } from "@/lib/blog";
import { BLOG_TEXT } from "@/lib/blog-i18n";

export function blogIndexMetadata(lang: Lang): Metadata {
  const t = BLOG_TEXT[lang];
  return {
    title: t.indexTitleMeta,
    description: t.indexDescription,
    alternates: { canonical: blogPath(lang), languages: { fr: blogPath("fr"), en: blogPath("en") } },
  };
}

// Liste des articles, dans une langue.
export default function BlogIndexView({ lang }: { lang: Lang }) {
  const t = BLOG_TEXT[lang];
  const posts = getPosts(lang);
  if (posts.length === 0) notFound();
  const other: Lang = lang === "fr" ? "en" : "fr";
  const hasOther = getPosts(other).length > 0;
  const [first, ...rest] = posts;

  return (
    <BlogShell lang={lang} altHref={hasOther ? blogPath(other) : undefined}>
      <main className="mx-auto max-w-[1100px] px-[6vw] pt-20 pb-28 md:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">{t.indexKicker}</p>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-tight">
          {t.indexTitle}
          <span className="text-morpho">{t.indexTitleAccent}</span>
        </h1>

        {first && (
          <Link
            href={blogPath(lang, first.slug)}
            className={`group mt-16 grid gap-8 md:items-center ${first.cover ? "md:grid-cols-[1.2fr_1fr]" : "hairline max-w-[860px] rounded-3xl border p-10 transition-colors hover:border-morpho"}`}
          >
            {first.cover && (
              <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-paper">
                <img src={first.cover} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
            )}
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist">
                {formatDate(first.date, lang)} · {readingTime(first.body)} {t.min}
              </p>
              <h2 className="mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)] font-extrabold leading-tight tracking-tight group-hover:text-morpho">
                {first.title}
              </h2>
              <p className="mt-4 text-lg">{first.excerpt}</p>
            </div>
          </Link>
        )}

        <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {rest.map((post) => (
            <Link key={post.slug} href={blogPath(lang, post.slug)} className="group flex flex-col">
              {post.cover && (
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-paper">
                  <img src={post.cover} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              )}
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-mist">
                {formatDate(post.date, lang)} · {readingTime(post.body)} {t.min}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight group-hover:text-morpho">{post.title}</h2>
              <p className="mt-3">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </BlogShell>
  );
}
