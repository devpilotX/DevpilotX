import { allPosts } from "content-collections";

export const BLOG_DESCRIPTION =
  "Notes on building SaaS products, running servers and the things I learn along the way.";

export type Post = (typeof allPosts)[number];

export const getSlug = (post: Post) => post._meta.path.replace(/\.mdx$/, "");

export function getSortedPosts() {
  return [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
