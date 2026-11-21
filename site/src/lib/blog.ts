import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Articles du blog : un fichier Markdown par article dans src/content/blog,
// avec un en-tête « clé: valeur » (valeurs au format JSON).
const DIR = path.join(process.cwd(), "src/content/blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  cover?: string;
  excerpt: string;
  body: string;
};

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`En-tête manquant dans ${file}`);
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = JSON.parse(line.slice(i + 1).trim());
  }
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(meta.title),
    date: String(meta.date),
    tags: (meta.tags as string[]) ?? [],
    cover: meta.cover as string | undefined,
    excerpt: String(meta.excerpt ?? ""),
    body: match[2],
  };
}

export function getPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  return getPosts().find((p) => p.slug === slug) ?? null;
}

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}

export function formatDate(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function readingTime(md: string): number {
  return Math.max(1, Math.round(md.split(/\s+/).length / 220));
}

// Version audio ElevenLabs d'un article (générée par scripts/tts.mjs), si elle existe.
export function getAudio(slug: string): { src: string; duration: number; starts: number[]; words?: number[][] } | null {
  const meta = path.join(process.cwd(), "public/audio", `${slug}.json`);
  if (!fs.existsSync(meta)) return null;
  const { duration, starts, words } = JSON.parse(fs.readFileSync(meta, "utf8"));
  return { src: `/audio/${slug}.mp3`, duration, starts, words };
}
