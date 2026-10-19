"use client";

import { useState } from "react";
import Magnetic from "@/components/motion/Magnetic";

type Status = "idle" | "sending" | "sent" | "error";

// La candidature se lit comme une lettre : on remplit les blancs d'une phrase.

const profils = [
  { value: "J’ai une idée de produit ou de projet", label: "une idée à construire" },
  { value: "Je n’ai pas encore d’idée, je veux trouver la mienne", label: "pas encore d’idée" },
  { value: "Je veux faire monter mon équipe en compétence", label: "une équipe à embarquer" },
];

const niveaux = [
  { value: "Je découvre", label: "je découvre" },
  { value: "J’utilise ChatGPT ou Claude au quotidien", label: "je l’utilise au quotidien" },
  { value: "Je construis déjà avec l’IA", label: "je construis déjà avec" },
];

function Blank({
  name,
  placeholder,
  type = "text",
  autoComplete,
}: {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <input
      name={name}
      type={type}
      required
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size={Math.max(placeholder.length, value.length) + 1}
      className="mx-[0.15em] max-w-full border-b-2 border-white/25 bg-transparent px-1 text-imago outline-none transition-colors placeholder:text-white/25 focus:border-imago"
    />
  );
}

function Choices({ name, options }: { name: string; options: { value: string; label: string }[] }) {
  return (
    <span className="mx-[0.15em] inline-flex flex-wrap gap-2 align-middle">
      {options.map((o, i) => (
        <label key={o.value} className="group relative">
          <input type="radio" name={name} value={o.value} required={i === 0} className="peer absolute inset-0 opacity-0" />
          <span className="block rounded-full border border-white/25 px-[0.6em] py-[0.15em] text-[0.62em] leading-normal transition-all duration-300 group-hover:border-white/60 peer-checked:border-imago peer-checked:bg-imago peer-checked:text-night peer-focus-visible:ring-2 peer-focus-visible:ring-morpho">
            {o.label}
          </span>
        </label>
      ))}
    </span>
  );
}

export default function ApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [prenom, setPrenom] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setPrenom(data.prenom ?? "");
    try {
      const res = await fetch("/api/candidature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-mist">Candidature reçue</p>
        <p className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight">
          Merci {prenom}.<br />
          <span className="iridescent">Tes ailes poussent.</span>
        </p>
        <p className="mx-auto mt-8 max-w-[44ch] text-xl text-mist">
          Je lis chaque candidature moi-même. Je reviens vers toi sous 48h pour qu’on s’appelle.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-mist">Ta candidature</p>
      <div className="mt-8 text-[clamp(1.6rem,3.4vw,3rem)] font-bold leading-[1.6] tracking-tight">
        Salut Benjamin, je m’appelle <Blank name="prenom" placeholder="ton prénom" autoComplete="given-name" />, tu
        peux m’écrire à <Blank name="email" type="email" placeholder="ton@email.com" autoComplete="email" />.
        <br />
        Aujourd’hui j’ai <Choices name="profil" options={profils} />
        <br />
        et avec l’IA, <Choices name="niveau" options={niveaux} />
        <br />
        Ce que je rêve de construire, ou ce qui me bloque :
      </div>
      <textarea
        name="projet"
        required
        rows={3}
        placeholder="Raconte-moi en quelques lignes…"
        className="mt-6 w-full resize-none border-b-2 border-white/25 bg-transparent pb-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium text-imago outline-none transition-colors placeholder:text-white/25 focus:border-imago"
      />

      <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="max-w-[34ch] text-center font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-mist sm:text-left">
          6 places par promo · Je réponds à chaque candidature · Le tarif se discute pendant l’appel
        </p>
        <Magnetic>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex size-36 items-center justify-center rounded-full bg-imago text-lg font-bold text-night transition-transform duration-300 hover:scale-105 disabled:opacity-60 md:size-40"
          >
            {status === "sending" ? "Envoi…" : "Envoyer →"}
          </button>
        </Magnetic>
      </div>
      {status === "error" && (
        <p className="mt-6 text-center text-lg text-imago">L’envoi n’a pas marché. Réessaie dans un instant.</p>
      )}
    </form>
  );
}
