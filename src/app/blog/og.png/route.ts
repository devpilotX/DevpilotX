import { BLOG_DESCRIPTION } from "@/lib/blog";
import { renderOgCard } from "@/lib/og";

export const dynamic = "force-static";

export function GET() {
  return renderOgCard({ title: "Blog", description: BLOG_DESCRIPTION });
}
