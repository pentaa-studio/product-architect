import Link from "next/link";

// Habillage des pages du blog : la clarté de l'os, faite pour lire.
export default function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-[6vw] md:px-6">
          <Link href="/" className="font-bold tracking-tight">
            Benjamin Arthuys
          </Link>
          <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            <Link href="/blog" className="hover:text-morpho">
              Réflexions
            </Link>
            <Link href="/#candidater" className="rounded-full border border-ink px-4 py-2 hover:bg-ink hover:text-bone">
              Candidater
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1100px] justify-between gap-4 px-[6vw] py-10 font-mono text-xs uppercase tracking-[0.2em] text-mist md:px-6">
          <p>Benjamin Arthuys · Product Architect</p>
          <Link href="/" className="hover:text-morpho">
            ← Accueil
          </Link>
        </div>
      </footer>
    </div>
  );
}
