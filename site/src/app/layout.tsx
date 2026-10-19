import type { Metadata } from "next";
import { Abel, Anonymous_Pro, Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const abel = Abel({
  variable: "--font-abel",
  weight: "400",
  subsets: ["latin"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Benjamin Arthuys — Intelligence créative",
  description:
    "L’IA redéfinit les règles de la créativité. Je vous forme à l’intelligence créative et je code pour vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${figtree.variable} ${abel.variable} ${anonymousPro.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
