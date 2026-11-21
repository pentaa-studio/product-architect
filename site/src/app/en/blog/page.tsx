import BlogIndexView, { blogIndexMetadata } from "@/components/blog/BlogIndexView";

export const metadata = blogIndexMetadata("en");

export default function BlogIndexEn() {
  return <BlogIndexView lang="en" />;
}
