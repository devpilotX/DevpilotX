import type { MetadataRoute } from "next";
import { DATA } from "@/data/resume";
import { getSlug, getSortedPosts } from "@/lib/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPosts().map((post) => ({
    url: `${DATA.url}/blog/${getSlug(post)}/`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
  }));

  return [
    { url: `${DATA.url}/`, lastModified: new Date() },
    { url: `${DATA.url}/blog/`, lastModified: new Date() },
    ...posts,
  ];
}
