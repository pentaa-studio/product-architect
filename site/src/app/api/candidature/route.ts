import { NextResponse } from "next/server";
import { NIVEAUX, PROFILS } from "@/content/candidature";

const NOTION_VERSION = "2022-06-28";

type Candidature = { prenom: string; email: string; profil: string; niveau: string; projet: string };

function parse(body: Record<string, unknown> | null): Candidature | string {
  if (!body) return "Requête invalide";
  const out: Record<string, string> = {};
  for (const field of ["prenom", "email", "profil", "niveau", "projet"]) {
    const value = body[field];
    const max = field === "projet" ? 2000 : 200;
    if (typeof value !== "string" || !value.trim() || value.length > max) return `Champ invalide : ${field}`;
    out[field] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return "Email invalide";
  if (!(PROFILS as readonly string[]).includes(out.profil)) return "Profil invalide";
  if (!(NIVEAUX as readonly string[]).includes(out.niveau)) return "Niveau invalide";
  return out as Candidature;
}

const text = (content: string) => [{ type: "text", text: { content } }];

export async function POST(request: Request) {
  const candidature = parse((await request.json().catch(() => null)) as Record<string, unknown> | null);
  if (typeof candidature === "string") return NextResponse.json({ error: candidature }, { status: 400 });

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_CANDIDATURES_DB;
  if (!token || !databaseId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[candidature] NOTION_TOKEN ou NOTION_CANDIDATURES_DB manquant, candidature non enregistrée.");
      return NextResponse.json({ ok: true, stored: false });
    }
    return NextResponse.json({ error: "Candidatures indisponibles" }, { status: 503 });
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Prénom: { title: text(candidature.prenom) },
        Email: { email: candidature.email },
        Profil: { select: { name: candidature.profil } },
        "Niveau IA": { select: { name: candidature.niveau } },
        Projet: { rich_text: text(candidature.projet) },
        Statut: { status: { name: "Nouvelle" } },
      },
    }),
  });

  if (!res.ok) {
    console.error("[candidature] Notion a refusé l’enregistrement", res.status, await res.text());
    return NextResponse.json({ error: "Enregistrement impossible" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
