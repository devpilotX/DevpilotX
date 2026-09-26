"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { normalizePage, paginate } from "@/lib/pagination";

export interface BlogListItem {
  slug: string;
  title: string;
  publishedAt: string;
}

const PAGE_SIZE = 5;
const BLUR_FADE_DELAY = 0.04;

const pagerClass =
  "h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg";

export function BlogList({ posts }: { posts: BlogListItem[] }) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const currentPage = normalizePage(searchParams.get("page") ?? undefined, totalPages);
  const { items, pagination } = paginate(posts, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  if (items.length === 0) {
    return (
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
          <p className="text-muted-foreground text-center">
            No posts yet. Check back soon.
          </p>
        </div>
      </BlurFade>
    );
  }

  return (
    <>
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div className="flex flex-col gap-5">
          {items.map((post, id) => {
            const indexNumber = (pagination.page - 1) * PAGE_SIZE + id + 1;
            return (
              <BlurFade delay={BLUR_FADE_DELAY * 3 + id * 0.05} key={post.slug}>
                <Link
                  className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/blog/${post.slug}/`}
                >
                  <span className="text-xs font-mono tabular-nums font-medium mt-[5px]">
                    {String(indexNumber).padStart(2, "0")}.
                  </span>
                  <div className="flex flex-col gap-y-2 flex-1">
                    <p className="tracking-tight text-lg font-medium">
                      <span className="group-hover:text-foreground transition-colors">
                        {post.title}
                        <ChevronRight
                          className="ml-1 inline-block size-4 stroke-3 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                          aria-hidden
                        />
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{post.publishedAt}</p>
                  </div>
                </Link>
              </BlurFade>
            );
          })}
        </div>
      </BlurFade>

      {pagination.totalPages > 1 && (
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="flex gap-3 flex-row items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2 sm:justify-end">
              {pagination.hasPreviousPage ? (
                <Link
                  href={`/blog/?page=${pagination.page - 1}`}
                  className={`${pagerClass} hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                >
                  Previous
                </Link>
              ) : (
                <span className={`${pagerClass} opacity-50 cursor-not-allowed`}>Previous</span>
              )}
              {pagination.hasNextPage ? (
                <Link
                  href={`/blog/?page=${pagination.page + 1}`}
                  className={`${pagerClass} hover:bg-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                >
                  Next
                </Link>
              ) : (
                <span className={`${pagerClass} opacity-50 cursor-not-allowed`}>Next</span>
              )}
            </div>
          </div>
        </BlurFade>
      )}
    </>
  );
}
