import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Articles du blog : un fichier Markdown par article, avec un en-tête « clé: valeur »
// (valeurs au format JSON). Le français est dans src/content/blog, l'anglais dans
// src/content/blog/en ; un article anglais pointe vers sa version française par `fr`.
export type Lang = "fr" | "en";

const DIRS: Record<Lang, string> = {
  fr: path.join(process.cwd(), "src/content/blog"),
  en: path.join(process.cwd(), "src/content/blog/en"),
};

export type Post = {
  slug: string;
  lang: Lang;
  title: string;
  date: string;
  tags: string[];
  cover?: string;
  excerpt: string;
  body: string;
  /** Slug of the same article in the other language, if it exists. */
  alt?: string;
};

function parse(file: string, lang: Lang): Post & { fr?: string } {
  const raw = fs.readFileSync(path.join(DIRS[lang], file), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`En-tête manquant dans ${file}`);
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = JSON.parse(line.slice(i + 1).trim());
  }
  return {
    slug: file.replace(/\.md$/, ""),
    lang,
    title: String(meta.title),
    date: String(meta.date),
    tags: (meta.tags as string[]) ?? [],
    cover: meta.cover as string | undefined,
    excerpt: String(meta.excerpt ?? ""),
    body: match[2],
    fr: meta.fr as string | undefined,
  };
}

function read(lang: Lang) {
  if (!fs.existsSync(DIRS[lang])) return [];
  return fs
    .readdirSync(DIRS[lang])
    .filter((f) => f.endsWith(".md"))
    .map((f) => parse(f, lang));
}

export function getPosts(lang: Lang = "fr"): Post[] {
  const posts = read(lang);
  if (lang === "fr") {
    const en = read("en");
    for (const p of posts) p.alt = en.find((e) => e.fr === p.slug)?.slug;
  } else {
    for (const p of posts) p.alt = p.fr;
  }
  return posts
    .map(({ fr: _fr, ...p }) => p)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, lang: Lang = "fr"): Post | null {
  return getPosts(lang).find((p) => p.slug === slug) ?? null;
}

export function blogPath(lang: Lang, slug?: string): string {
  const base = lang === "fr" ? "/blog" : "/en/blog";
  return slug ? `${base}/${slug}` : base;
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}

export function formatDate(date: string, lang: Lang = "fr"): string {
  return new Date(date + "T12:00:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function readingTime(md: string): number {
  return Math.max(1, Math.round(md.split(/\s+/).length / 220));
}

// Version audio ElevenLabs d'un article (générée par scripts/tts.mjs), si elle existe.
export function getAudio(slug: string, lang: Lang = "fr"): { src: string; duration: number; starts: number[]; words?: number[][] } | null {
  const dir = lang === "fr" ? "audio" : "audio/en";
  const meta = path.join(process.cwd(), "public", dir, `${slug}.json`);
  if (!fs.existsSync(meta)) return null;
  const { duration, starts, words } = JSON.parse(fs.readFileSync(meta, "utf8"));
  return { src: `/${dir}/${slug}.mp3`, duration, starts, words };
}
