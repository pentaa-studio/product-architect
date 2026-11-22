import type { Lang } from "./blog";

// Textes de l'interface du blog, en français et en anglais.
export const BLOG_TEXT = {
  fr: {
    reflections: "Réflexions",
    apply: "Candidater",
    home: "← Accueil",
    allPosts: "← Toutes les réflexions",
    minRead: "min de lecture",
    min: "min",
    readNext: "À lire aussi",
    otherLanguage: "English",
    otherLanguageLabel: "Read in English",
    indexKicker: "Réflexions partagées",
    indexTitle: "Ce que je comprends, ",
    indexTitleAccent: "je le partage.",
    indexTitleMeta: "Réflexions · Benjamin Arthuys",
    indexDescription: "Mes réflexions sur l'IA, le produit et la création.",
  },
  en: {
    reflections: "Reflections",
    apply: "Apply",
    home: "← Home",
    allPosts: "← All reflections",
    minRead: "min read",
    min: "min",
    readNext: "Read next",
    otherLanguage: "Français",
    otherLanguageLabel: "Lire en français",
    indexKicker: "Shared reflections",
    indexTitle: "What I understand, ",
    indexTitleAccent: "I share.",
    indexTitleMeta: "Reflections · Benjamin Arthuys",
    indexDescription: "My reflections on AI, product and creation.",
  },
} satisfies Record<Lang, Record<string, string>>;
