import Timeline from "@/components/Timeline";

// À remplacer par tes vrais liens (Calendly, Stripe…).
const BOOKING_URL = "#";
const SIGNUP_URL = "#";

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="text-flame">{children}</span>
);

const schools = [
  {
    name: "Formateur CCI - EMISRA",
    text: "Acculturation IA en entreprise. Je forme les entrepreneurs à l’utilisation des outils IA dans leur domaine professionnel jusqu’à la création d’assistants IA personnalisés.",
  },
  {
    name: "Formateur Maria School",
    text: "Formations pour devenir “Product Manager IA”. Les clés pour savoir structurer et suivre un produit fonctionnant avec l’IA.",
  },
];

const testimonials = [
  { quote: "“testimonial 1”", author: "prénom" },
  { quote: "“testimonial 1”", author: "prénom" },
  { quote: "“testimonial 1”", author: "prénom" },
];

const skills = [
  { label: "Vibe coding", icon: "/figma/code.svg", size: 33 },
  { label: "Vibe Designing", icon: "/figma/graphic-design.svg", size: 24 },
  { label: "Creation de RAG", icon: "/figma/rag.svg", size: 29 },
  { label: "Creation d’assistant IA", icon: "/figma/chat-ai.svg", size: 24 },
  { label: "Automatisation N8N", icon: "/figma/n8n.svg", size: 29 },
];

const benefits = ["1:1", "Sur mesure", "2 RDV par mois", "Suivi de projet", "Slack"];

export default function Home() {
  return (
    <main className="overflow-x-hidden pb-32">
      {/* Hero */}
      <section className="mx-auto max-w-[676px] px-4 pt-24 md:pt-[151px]">
        <h1 className="max-w-[525px] text-4xl font-extrabold leading-tight md:text-5xl md:leading-[normal]">
          L’IA redéfinit les règles de la créativité. Je vous forme à l’
          <Accent>intelligence créative</Accent>
        </h1>
        <div className="mt-4 flex items-center gap-6">
          <div className="size-[67px] shrink-0 rounded-[21px] bg-white shadow-[0_0_17px_rgba(0,0,0,0.1)]" />
          <p className="text-xl font-medium">
            Bienvenue.
            <br />
            Je suis Benjamin Arthuys
          </p>
        </div>
      </section>

      <div className="mt-24 md:mt-[192px]">
        <Timeline />
      </div>

      {/* Faites de l'IA votre allié */}
      <section className="mx-auto mt-24 max-w-[676px] px-4 md:mt-[243px]">
        <h2 className="text-[32px] font-bold">
          Faites de l’IA votre <Accent>allié</Accent>.
        </h2>
        <p className="mt-2 max-w-[331px] text-xl font-medium">
          Voyez-la comme un outil qui peut vous aider à imaginer et mettre en vie vos idées. Un
          assistant, un agent qui exécute vos idées en un temps record.
        </p>
        <a
          href={BOOKING_URL}
          className="mt-6 inline-flex h-[29px] items-center rounded-full bg-ink px-[13px] text-[10px] font-semibold text-white transition hover:bg-flame"
        >
          Réservez un appel de 15 min
        </a>
      </section>

      {/* Je code pour vous */}
      <section id="code" className="mt-24 px-4 text-center md:mt-[102px]">
        <h2 className="text-4xl font-bold">Je code pour vous</h2>
      </section>

      {/* Je vous forme */}
      <section id="formation" className="mx-auto mt-40 max-w-[1024px] px-4 md:mt-[400px]">
        <h2 className="text-center text-4xl font-bold">Je vous forme</h2>
        <p className="mx-auto mt-16 max-w-[627px] text-center text-2xl font-bold md:mt-[101px]">
          Je partage ma <Accent>passion</Accent> et mes <Accent>expériences</Accent> dans deux
          écoles entre Paris et Bayonne.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {schools.map((school) => (
            <article
              key={school.name}
              className="flex items-center justify-center gap-5 rounded-lg border border-line px-6 py-10 md:h-[170px] md:px-[87px]"
            >
              <div className="h-[65px] w-[67px] shrink-0 rounded-full bg-ink" />
              <div className="flex max-w-[240px] flex-col gap-[5px] text-sm">
                <h3 className="font-bold">{school.name}</h3>
                <p>{school.text}</p>
              </div>
            </article>
          ))}
        </div>

        <ul className="mx-auto mt-24 grid max-w-[766px] gap-8 text-center text-sm sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <li key={i}>
              <p>{t.quote}</p>
              <p>{t.author}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Offres */}
      <section id="offres" className="mx-auto mt-32 grid max-w-[1024px] gap-10 px-4 md:mt-[161px] md:grid-cols-2 md:gap-x-[23px]">
        <div className="flex flex-col">
          <div className="text-center">
            <h2 className="text-[32px] font-bold leading-tight">
              Pour ceux qui
              <br />
              <Accent>ont des idées</Accent>.
            </h2>
            <p className="mx-auto mt-3 max-w-[233px] text-xl font-bold leading-6">
              L’IA n’attend pas, formez-vous <Accent>en continu.</Accent>
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 rounded-lg border border-line bg-cream p-[30px] sm:grid-cols-[1fr_148px] sm:gap-3 md:h-[287px] md:pr-[17px]">
            <ul className="flex flex-col justify-between gap-4 font-display text-2xl uppercase">
              {skills.map((skill) => (
                <li key={skill.label} className="flex items-center gap-[15px] whitespace-nowrap">
                  <span className="flex w-[33px] justify-center">
                    <img src={skill.icon} alt="" aria-hidden width={skill.size} height={skill.size} />
                  </span>
                  {skill.label}
                </li>
              ))}
            </ul>

            <div className="flex flex-col">
              <p className="self-end pr-2 font-display uppercase">
                <span className="text-4xl">490€</span>
                <span>/mois</span>
              </p>
              <div className="mt-auto rounded-lg bg-[linear-gradient(-9.7deg,var(--color-flame)_8.5%,var(--color-flame-light)_91.5%)] px-5 py-[11px] shadow-[0_4px_25px_rgba(0,0,0,0.1)]">
                <p className="text-[10px] uppercase text-white opacity-50">Bénéfices</p>
                <ul className="text-xs font-medium uppercase leading-[17px] text-white/90">
                  {benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <a
                href={SIGNUP_URL}
                className="mt-1 rounded-lg bg-flame px-2.5 py-[5px] text-center text-xl font-medium text-snow transition hover:brightness-110"
              >
                S’inscrire
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-center">
            <h2 className="text-[32px] font-bold leading-tight">
              Pour ceux qui
              <br />
              <Accent>n’ont pas d’idées</Accent>.
            </h2>
            <p className="mx-auto mt-3 max-w-[241px] text-xl font-bold leading-6">
              L’IA vous attend, avec impatience. <Accent>Commencez.</Accent>
            </p>
          </div>
          <div className="mt-6 min-h-[287px] rounded-lg border border-line bg-cream" />
        </div>
      </section>

      <p className="mx-auto mt-32 max-w-[1024px] px-4 font-display text-sm uppercase md:mt-[314px] md:pl-[200px]">
        Inclus
      </p>

      {/* Réflexions partagées */}
      <section id="reflexions" className="mt-40 px-4 text-center md:mt-[549px]">
        <h2 className="text-[32px] font-bold">Réflexions partagées</h2>
      </section>
    </main>
  );
}
