import ApplicationForm from "@/components/ApplicationForm";
import Reveal from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import Chapters from "@/components/motion/Chapters";
import { CHAPTERS } from "@/content/butterfly";
import Counter from "@/components/motion/Counter";
import Cursor from "@/components/motion/Cursor";
import Imaginals from "@/components/motion/Imaginals";
import Magnetic from "@/components/motion/Magnetic";
import Motion from "@/components/motion/Motion";
import ScrubText from "@/components/motion/ScrubText";
import Stack from "@/components/motion/Stack";
import Verbs from "@/components/motion/Verbs";

const BUTTERFLY_URL = "https://app.notion.com/p/pentaa/Butterfly-Process-23f5cf675878800081c8d7dc04bb807b";
const PENTAA_URL = "https://www.pentaa.studio";
const LINKEDIN_URL = "https://www.linkedin.com/in/benjaminarthuys";

const companies = [
  "Pentaa Studio",
  "Ternoa",
  "Syment",
  "Trunks Music",
  "Capsule Corp. Labs",
  "Mediaswapp",
  "Mobintouch",
  "AppSystem",
  "Maria Schools",
  "CCI Bayonne Pays Basque",
];

const proofs = [
  { value: 15, suffix: " ans", label: "à construire des produits, de startup en startup" },
  { value: 17, suffix: " M€", label: "levés chez Ternoa, où j’étais Chief Product Officer" },
  { value: 80, prefix: "5 → ", label: "collaborateurs en un an, en pleine scale-up" },
  { value: 30, suffix: "+", label: "personnes pilotées dans une équipe produit" },
];

const tools = ["Claude", "ChatGPT", "Cursor", "Claude Code", "n8n", "Figma", "Lovable", "v0", "Notion AI", "Midjourney", "MCP", "Agents"];

const crafts = ["Vibe coding", "Vibe designing", "RAG", "Assistants IA", "Automatisations", "Prototypage", "Product discovery"];

const months = [
  {
    month: "Mois 1",
    title: "Trouver la bonne tension",
    text: "On part de toi, de ton idée ou de ce qui te manque. On écoute le terrain, on formule le vrai problème, on choisit où l’IA a vraiment du sens.",
    chapters: [0, 1, 2, 3],
    tone: "bg-paper text-ink",
  },
  {
    month: "Mois 2",
    title: "Prototyper avec l’IA",
    text: "Vibe coding, vibe designing, assistants, RAG, automatisations. Tu prends en main les outils en construisant ton propre prototype.",
    chapters: [4, 5],
    tone: "bg-morpho text-paper",
  },
  {
    month: "Mois 3",
    title: "Incarner et lancer",
    text: "On ancre le produit, on le confronte au réel, et on installe la boucle qui le fera vivre bien après la promo.",
    chapters: [6, 7],
    tone: "bg-night text-paper",
  },
];

const included = [
  "Un cours en ligne en direct chaque semaine",
  "2 rendez-vous 1:1 par mois sur ton projet",
  "Un suivi de projet sur mesure",
  "Un Slack privé avec moi et la promo",
  "Les replays et toutes les ressources",
  "Un produit ou un projet concret à la fin",
];

const faq = [
  {
    q: "Faut-il savoir coder ?",
    a: "Non. On apprend à construire avec l’IA, pas à devenir développeur. Si tu codes déjà, on ira simplement plus loin.",
  },
  {
    q: "Combien ça coûte ?",
    a: "Le tarif dépend du format et de ton projet. On en parle ensemble pendant l’appel, après ta candidature.",
  },
  {
    q: "Pourquoi seulement 6 places ?",
    a: "Parce que je suis chaque projet personnellement. Au-delà, je ne pourrais plus accompagner chacun avec la même attention.",
  },
  {
    q: "Et si je n’ai pas encore d’idée ?",
    a: "C’est un très bon point de départ. Le premier mois sert justement à trouver ton cas d’usage, à partir de toi et de ton terrain.",
  },
  {
    q: "Ça se passe où ?",
    a: "100 % à distance : cours en direct, rendez-vous en visio et Slack pour avancer entre deux sessions.",
  },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">{children}</p>;
}

function Marquee({ items, reverse = false, className = "" }: { items: string[]; reverse?: boolean; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div className={`flex w-max shrink-0 items-center ${reverse ? "marquee-reverse" : "marquee"} ${className}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            {item}
            <span className="mx-[0.5em] text-morpho">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Motion />
      <Cursor />

      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex h-16 items-center justify-between gap-4 px-[6vw]">
          <a href="#" className="font-bold tracking-tight">
            Benjamin Arthuys
          </a>
          <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            <a href="#parcours" className="hidden hover:opacity-60 sm:inline">
              Parcours
            </a>
            <a href="#methode" className="hidden hover:opacity-60 sm:inline">
              Méthode
            </a>
            <a href="#accompagnement" className="hidden hover:opacity-60 sm:inline">
              Accompagnement
            </a>
            <a href="#candidater" className="rounded-full border border-white px-4 py-2 hover:bg-white hover:text-black">
              Candidater
            </a>
          </nav>
        </div>
      </header>

      <main className="overflow-x-clip">
        <Imaginals />

        {/* Manifeste */}
        <section data-bg="night" className="px-[6vw] py-[22vh]">
          <Kicker>Butterfly Process · Conclusion</Kicker>
          <ScrubText
            text="La chenille ne sait pas qu’elle deviendra papillon. Elle traverse. Elle se dissout. Elle fait confiance à ce qui germe en silence."
            highlight={["papillon"]}
            className="mt-8 max-w-[22ch] text-[clamp(2.25rem,5.6vw,5.5rem)] font-bold leading-[1.02] tracking-tight"
          />
          <Reveal className="mt-[16vh] ml-auto max-w-[520px]">
            <p className="text-2xl font-medium leading-snug">
              L’IA dissout nos vieilles façons de créer. C’est vertigineux, et c’est une chance. Je suis là pour que tu
              traverses cette métamorphose, et que tu en sortes avec des <span className="iridescent">ailes</span>.
            </p>
          </Reveal>
        </section>

        {/* Preuves */}
        <section data-bg="bone" className="px-[6vw] pt-[18vh] pb-[12vh]">
          <Reveal>
            <Kicker>Qui suis-je</Kicker>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,6vw,6rem)] font-extrabold leading-[0.95] tracking-tight">
              Design soul. <span className="text-morpho">Development brain.</span>
            </h2>
          </Reveal>
          <div className="mt-[10vh] grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {proofs.map((p, i) => (
              <Reveal key={p.label} delay={i * 100} className="hairline border-t pt-6">
                <p className="text-[clamp(3rem,5.5vw,5rem)] font-extrabold leading-none tracking-tight">
                  <Counter to={p.value} prefix={p.prefix} suffix={p.suffix} />
                </p>
                <p className="mt-4 max-w-[26ch] text-lg">{p.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section data-bg="bone" className="hairline border-y py-6 font-display text-[clamp(1.5rem,3vw,2.5rem)] uppercase">
          <Marquee items={companies} />
        </section>

        {/* Parcours */}
        <section id="parcours" data-bg="bone" className="pt-[18vh] pb-[10vh]">
          <div className="grid gap-10 px-[6vw] md:grid-cols-[1fr_auto] md:items-end">
            <Reveal>
              <Kicker>Parcours</Kicker>
              <h2 className="mt-6 text-[clamp(2.5rem,6vw,6rem)] font-extrabold leading-[0.95] tracking-tight">
                Une vie qui <span className="iridescent">ondule</span>.
              </h2>
              <p className="mt-6 max-w-[48ch] text-xl">
                Né à Toulouse en 1986. Une marque de vêtements à 22 ans, San Francisco, Barcelone, la van life, le Pays
                Basque. Graphiste, designer, développeur, rédac chef, CPO, CEO par intérim. Ça monte, ça descend, comme
                la vie. Et chaque vague m’a appris quelque chose que je transmets aujourd’hui.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="relative size-40 overflow-hidden rounded-full bg-gradient-to-br from-morpho via-violet to-imago md:size-52">
                <span className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold text-paper">BA</span>
              </div>
            </Reveal>
          </div>
          <div className="mt-[10vh]">
            <Timeline />
          </div>
        </section>

        <Chapters bookUrl={BUTTERFLY_URL} />
        <Verbs />

        {/* Accompagnement */}
        <section id="accompagnement" data-bg="bone" className="px-[6vw] pt-[20vh] pb-[16vh]">
          <Reveal>
            <Kicker>Accompagnement premium · 3 mois · 6 places</Kicker>
            <h2 className="mt-6 max-w-[14ch] text-[clamp(2.75rem,7vw,7rem)] font-extrabold leading-[0.92] tracking-tight">
              Pas une classe. <span className="text-morpho">Six élèves.</span>
            </h2>
            <p className="mt-8 max-w-[52ch] text-xl">
              Une petite promo que je suis personnellement pendant trois mois. Des cours en direct, du 1:1, un Slack, et
              à la fin un vrai produit construit avec l’IA. Le tien.
            </p>
          </Reveal>

          <div className="mt-[12vh] grid gap-6 md:grid-cols-2">
            <Reveal className="hairline group rounded-3xl border p-8 transition-colors duration-500 hover:bg-ink hover:text-paper md:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">Entrée A</p>
              <h3 className="mt-6 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-[0.95]">
                Pour ceux qui <span className="text-morpho group-hover:text-imago">ont des idées</span>.
              </h3>
              <p className="mt-6 text-lg">
                L’IA n’attend pas. On transforme ton idée en produit, en apprenant les outils sur ton propre projet.
              </p>
            </Reveal>
            <Reveal delay={120} className="hairline group rounded-3xl border p-8 transition-colors duration-500 hover:bg-ink hover:text-paper md:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">Entrée B</p>
              <h3 className="mt-6 text-[clamp(2rem,3.6vw,3.25rem)] font-extrabold leading-[0.95]">
                Pour ceux qui <span className="text-morpho group-hover:text-imago">n’ont pas d’idées</span>.
              </h3>
              <p className="mt-6 text-lg">
                L’IA vous attend, avec impatience. On part de toi et de ton terrain pour trouver ton cas d’usage, puis on
                le construit.
              </p>
            </Reveal>
          </div>

          <div className="mt-[16vh]">
            <Stack>
              {months.map((m, i) => (
                <article
                  key={m.month}
                  data-card
                  className={`sticky grid min-h-[62vh] origin-top gap-8 rounded-3xl p-8 shadow-[0_30px_80px_-30px_rgba(11,10,18,0.45)] md:grid-cols-2 md:p-14 ${m.tone}`}
                  style={{ top: `calc(12vh + ${i * 28}px)` }}
                >
                  <div className="flex flex-col justify-between gap-8">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">{m.month}</p>
                    <h3 className="text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.92] tracking-tight">{m.title}</h3>
                  </div>
                  <div className="flex flex-col justify-between gap-8">
                    <p className="text-xl leading-snug">{m.text}</p>
                    <ul className="hairline flex flex-col gap-2 border-t pt-5">
                      {m.chapters.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span className="font-mono font-bold opacity-50">{String(c).padStart(2, "0")}</span>
                          {CHAPTERS[c]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
              <article
                data-card
                className="sticky grid min-h-[62vh] origin-top gap-8 rounded-3xl bg-imago p-8 text-night shadow-[0_30px_80px_-30px_rgba(11,10,18,0.45)] md:grid-cols-2 md:p-14"
                style={{ top: `calc(12vh + ${months.length * 28}px)` }}
              >
                <div className="flex flex-col justify-between gap-8">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">Inclus</p>
                  <h3 className="text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.92] tracking-tight">
                    Tout ce qu’il faut pour éclore.
                  </h3>
                </div>
                <ul className="flex flex-col justify-end gap-3 text-xl font-medium">
                  {included.map((item) => (
                    <li key={item} className="border-b border-night/15 pb-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Stack>
          </div>
        </section>

        {/* Ce que tu sauras faire */}
        <section data-bg="bone" className="pb-[16vh]">
          <Reveal className="px-[6vw]">
            <Kicker>Ce que tu sauras faire</Kicker>
          </Reveal>
          <div className="mt-8 flex flex-col gap-2 text-[clamp(3rem,8vw,7.5rem)] font-extrabold uppercase leading-none tracking-tight">
            <Marquee items={crafts} />
            <Marquee items={tools} reverse className="text-outline" />
          </div>
        </section>

        {/* Final */}
        <section id="candidater" data-bg="night" className="px-[6vw] pt-[22vh] pb-[12vh]">
          <Reveal>
            <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-mist">Prochaine promo · 6 places</p>
            <h2 className="mt-8 text-center text-[clamp(4rem,15vw,15rem)] font-extrabold leading-[0.85] tracking-tighter">
              À toi de <span className="iridescent">voler.</span>
            </h2>
            <p className="mx-auto mt-10 max-w-[48ch] text-center text-xl text-mist">
              Dis-moi qui tu es et ce que tu veux construire. Si on est faits pour travailler ensemble, on s’appelle 15
              minutes pour en parler.
            </p>
            <div className="mt-12 flex justify-center">
              <Magnetic>
                <a
                  href="#formulaire"
                  className="flex size-40 items-center justify-center rounded-full bg-imago text-lg font-bold text-night transition-transform duration-300 hover:scale-105 md:size-48"
                >
                  Candidater
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <div id="formulaire" className="mx-auto mt-[16vh] max-w-[1100px] scroll-mt-24">
            <Reveal>
              <ApplicationForm />
            </Reveal>
          </div>

          <div className="mx-auto mt-[14vh] max-w-[860px]">
            <Kicker>Tes questions</Kicker>
            <div className="hairline mt-6 divide-y divide-white/10 border-y">
              {faq.map((item) => (
                <details key={item.q} className="group py-6">
                  <summary className="flex list-none items-center justify-between gap-4 text-2xl font-bold">
                    {item.q}
                    <span className="font-mono text-imago transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-[60ch] text-lg text-mist">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer data-bg="night" className="hairline border-t px-[6vw] py-10">
        <div className="flex flex-col justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em] text-mist sm:flex-row">
          <p>Benjamin Arthuys · Product Architect</p>
          <div className="flex gap-6">
            <a href={PENTAA_URL} className="hover:text-imago">
              Pentaa Studio
            </a>
            <a href={LINKEDIN_URL} className="hover:text-imago">
              LinkedIn
            </a>
            <a href={BUTTERFLY_URL} className="hover:text-imago">
              Butterfly Process
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
