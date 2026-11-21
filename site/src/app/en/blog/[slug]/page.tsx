import type { Metadata } from "next";
import ArticleView, { articleMetadata } from "@/components/blog/ArticleView";
import { getPosts } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return articleMetadata((await params).slug, "en");
}

export default async function ArticleEn({ params }: Props) {
  return <ArticleView slug={(await params).slug} lang="en" />;
}
