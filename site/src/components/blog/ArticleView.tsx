import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import ListenArticle from "@/components/ListenArticle";
import { blogPath, formatDate, getAudio, getPost, getPosts, readingTime, renderMarkdown, type Lang } from "@/lib/blog";
import { BLOG_TEXT } from "@/lib/blog-i18n";

const other = (lang: Lang): Lang => (lang === "fr" ? "en" : "fr");

export function articleMetadata(slug: string, lang: Lang): Metadata {
  const post = getPost(slug, lang);
  if (!post) return {};
  const languages: Record<string, string> = { [lang]: blogPath(lang, post.slug) };
  if (post.alt) languages[other(lang)] = blogPath(other(lang), post.alt);
  return {
    title: `${post.title} · Benjamin Arthuys`,
    description: post.excerpt,
    alternates: { canonical: blogPath(lang, post.slug), languages },
    openGraph: { title: post.title, description: post.excerpt, images: post.cover ? [post.cover] : [] },
  };
}

// Page d'un article, dans une langue.
export default function ArticleView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = BLOG_TEXT[lang];
  const post = getPost(slug, lang);
  if (!post) notFound();
  const others = getPosts(lang).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <BlogShell lang={lang} altHref={post.alt ? blogPath(other(lang), post.alt) : undefined}>
      <article className="pt-16 pb-24">
        <header className="mx-auto max-w-[760px] px-[6vw] md:px-0">
          <Link href={blogPath(lang)} className="font-mono text-xs uppercase tracking-[0.2em] text-mist hover:text-morpho">
            {t.allPosts}
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em]">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight">{post.title}</h1>
          {post.excerpt && <p className="mt-5 font-display text-2xl italic text-mist">{post.excerpt}</p>}
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-mist">
            {formatDate(post.date, lang)} · {readingTime(post.body)} {t.minRead}
          </p>
          <ListenArticle title={post.title} targetId="article-body" audio={getAudio(post.slug, lang)} lang={lang} />
        </header>

        {post.cover && (
          <div className="mx-auto mt-12 max-w-[1100px] px-[6vw] md:px-6">
            <img src={post.cover} alt="" className="aspect-[21/9] w-full rounded-3xl object-cover" />
          </div>
        )}

        <div
          id="article-body"
          className="prose-ba mx-auto mt-14 max-w-[760px] px-[6vw] md:px-0"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
        />
      </article>

      {others.length > 0 && (
        <section className="border-t border-line bg-paper">
          <div className="mx-auto max-w-[1100px] px-[6vw] py-20 md:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">{t.readNext}</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} href={blogPath(lang, p.slug)} className="group rounded-3xl border border-line p-8 transition hover:border-morpho">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist">{formatDate(p.date, lang)}</p>
                  <h2 className="mt-3 text-2xl font-extrabold leading-tight group-hover:text-morpho">{p.title}</h2>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </BlogShell>
  );
}
