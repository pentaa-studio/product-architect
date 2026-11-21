// Génère la version audio des articles du blog avec ElevenLabs.
//
//   node --env-file=.env.local scripts/tts.mjs            → articles sans audio
//   node --env-file=.env.local scripts/tts.mjs <slug>     → un article (régénéré)
//
// Variables : ELEVENLABS_API_KEY (obligatoire), ELEVENLABS_VOICE_ID (optionnelle).
// Sortie : public/audio/<slug>.mp3 et public/audio/<slug>.json (durée et début
// de chaque paragraphe, pour surligner celui qui est lu).

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { marked } from "marked";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID || "hvOlZg8cxKgjKQz7tLn0"; // voix clonée de Benjamin
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_v4";
const FORMAT = "mp3_44100_64"; // 64 kbit/s constant : durée = octets × 8 / 64 000
const MAX_CHARS = 3500;

const BLOG = path.join(process.cwd(), "src/content/blog");
const OUT = path.join(process.cwd(), "public/audio");
// Chaque partie générée est gardée ici : relancer le script ne repaie pas ce qui existe déjà.
const CACHE = path.join(process.cwd(), ".tts-cache");

if (!KEY) {
  console.error("ELEVENLABS_API_KEY manquante (ajoute-la dans site/.env.local).");
  process.exit(1);
}

function readPost(file) {
  const raw = fs.readFileSync(path.join(BLOG, file), "utf8");
  const [, head, body] = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  const title = JSON.parse(/^title:\s*(.*)$/m.exec(head)[1]);
  return { slug: file.replace(/\.md$/, ""), title, body };
}

// Texte lisible d'un bloc Markdown, sans la syntaxe.
const plain = (md) =>
  md
    .replace(/^>\s?/gm, "")
    .replace(/[*_`#]/g, "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/—/g, ", ")
    .trim();

// Mêmes blocs que ceux rendus dans #article-body (le lecteur s'en sert pour surligner).
function blocks(body) {
  return marked
    .lexer(body)
    .filter((t) => !["space", "hr"].includes(t.type))
    .map((t) => ({ text: plain(t.type === "blockquote" ? t.text : t.raw), heading: t.type === "heading" }))
    .filter((b) => b.text);
}

async function speak(text, previous, next) {
  // Clé sur le texte seul : modifier un paragraphe ne fait pas régénérer ses voisins.
  const id = crypto.createHash("sha1").update(JSON.stringify([VOICE, MODEL, FORMAT, text])).digest("hex");
  const cached = path.join(CACHE, `${id}.json`);
  if (fs.existsSync(cached)) {
    const c = JSON.parse(fs.readFileSync(cached, "utf8"));
    return { audio: Buffer.from(c.audio, "base64"), starts: c.starts, cached: true };
  }
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=${FORMAT}`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        language_code: MODEL.includes("v2_5") ? "fr" : undefined, // seuls les modèles v2.5 acceptent la langue forcée
        previous_text: previous || undefined,
        next_text: next || undefined,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} : ${await res.text()}`);
  const json = await res.json();
  const starts = json.alignment.character_start_times_seconds;
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(cached, JSON.stringify({ audio: json.audio_base64, starts }));
  return { audio: Buffer.from(json.audio_base64, "base64"), starts, cached: false };
}

async function generate(post) {
  // Le titre d'abord, puis les blocs, regroupés en requêtes d'au plus MAX_CHARS caractères.
  // Chaque titre de section ouvre une nouvelle requête : une correction ne décale que sa section.
  const items = [{ block: -1, text: post.title + ".", heading: true }, ...blocks(post.body).map((b, block) => ({ block, ...b }))];
  const groups = [];
  for (const item of items) {
    const g = groups.at(-1);
    if (g && !item.heading && g.reduce((n, i) => n + i.text.length + 2, 0) + item.text.length <= MAX_CHARS) g.push(item);
    else groups.push([item]);
  }

  const parts = [];
  const starts = [];
  const words = []; // words[bloc] = début (s) de chaque mot, pour l'effet de texte qui s'écrit
  let offset = 0;
  for (let gi = 0; gi < groups.length; gi++) {
    const text = groups[gi].map((i) => i.text).join("\n\n");
    const prev = groups[gi - 1]?.map((i) => i.text).join("\n\n").slice(-600);
    const next = groups[gi + 1]?.map((i) => i.text).join("\n\n").slice(0, 600);
    const { audio, starts: charStarts, cached } = await speak(text, prev, next);
    process.stdout.write(`  ${post.slug} : partie ${gi + 1}/${groups.length}${cached ? " (cache)" : ""}\n`);
    let pos = 0;
    for (const item of groups[gi]) {
      const at = (i) => +(offset + (charStarts[Math.min(pos + i, charStarts.length - 1)] ?? 0)).toFixed(2);
      if (item.block >= 0) {
        starts[item.block] = at(0);
        words[item.block] = [...item.text.matchAll(/\S+/g)].map((m) => at(m.index));
      }
      pos += item.text.length + 2;
    }
    parts.push(audio);
    offset += (audio.length * 8) / 64000;
  }

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${post.slug}.mp3`), Buffer.concat(parts));
  fs.writeFileSync(path.join(OUT, `${post.slug}.json`), JSON.stringify({ duration: +offset.toFixed(2), starts, words }));
  console.log(`✓ ${post.slug} : ${Math.round(offset / 60)} min`);
}

const only = process.argv[2];
const posts = fs
  .readdirSync(BLOG)
  .filter((f) => f.endsWith(".md"))
  .map(readPost)
  .filter((p) => (only ? p.slug === only : !fs.existsSync(path.join(OUT, `${p.slug}.mp3`))));

if (posts.length === 0) console.log("Rien à générer.");
for (const post of posts) await generate(post);
