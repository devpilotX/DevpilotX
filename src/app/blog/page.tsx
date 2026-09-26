import { Suspense } from "react";
import type { Metadata } from "next";
import BlurFade from "@/components/magicui/blur-fade";
import { BlogList, type BlogListItem } from "@/components/blog-list";
import { BLOG_DESCRIPTION, getSlug, getSortedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog",
    description: BLOG_DESCRIPTION,
    images: [{ url: "/blog/og.png", width: 1200, height: 630, alt: "Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: BLOG_DESCRIPTION,
    images: ["/blog/og.png"],
  },
};

const BLUR_FADE_DELAY = 0.04;

export default function BlogPage() {
  const posts: BlogListItem[] = getSortedPosts().map((post) => ({
    slug: getSlug(post),
    title: post.title,
    publishedAt: post.publishedAt,
  }));

  return (
    <section id="blog">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Blog{" "}
          <span className="ml-1 bg-card border border-border rounded-md px-2 py-1 text-muted-foreground text-sm">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{BLOG_DESCRIPTION}</p>
      </BlurFade>

      {/* The page number lives in the query string, which only exists in the
          browser for a statically exported site. */}
      <Suspense fallback={null}>
        <BlogList posts={posts} />
      </Suspense>
    </section>
  );
}
