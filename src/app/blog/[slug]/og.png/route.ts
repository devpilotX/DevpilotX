import { allPosts } from "content-collections";
import { getSlug } from "@/lib/blog";
import { renderOgCard } from "@/lib/og";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: getSlug(post) }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = allPosts.find((p) => getSlug(p) === slug);

  if (!post) {
    return renderOgCard({ title: "Post not found" });
  }

  return renderOgCard({
    title: post.title,
    description: post.summary,
    date: formatDate(post.publishedAt),
  });
}
