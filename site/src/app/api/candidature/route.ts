import { NextResponse } from "next/server";

const FIELDS = ["prenom", "email", "profil", "niveau", "projet"] as const;

// Reçoit une candidature. TODO : la brancher sur un vrai stockage (base Notion, Resend…) avant la mise en ligne.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

  const candidature: Record<string, string> = {};
  for (const field of FIELDS) {
    const value = body[field];
    if (typeof value !== "string" || !value.trim() || value.length > 5000) {
      return NextResponse.json({ error: `Champ manquant : ${field}` }, { status: 400 });
    }
    candidature[field] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidature.email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  console.log("[candidature]", candidature);
  return NextResponse.json({ ok: true });
}
