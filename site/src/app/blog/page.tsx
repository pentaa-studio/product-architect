import BlogIndexView, { blogIndexMetadata } from "@/components/blog/BlogIndexView";

export const metadata = blogIndexMetadata("fr");

export default function BlogIndex() {
  return <BlogIndexView lang="fr" />;
}
