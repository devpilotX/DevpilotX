import { DATA } from "@/data/resume";
import { renderProjectCover } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

// Builds one cover image per project, for example /projects/quant.png
export function generateStaticParams() {
  return DATA.projects.map((project) => ({ file: `${project.slug}.png` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const project = DATA.projects.find((p) => `${p.slug}.png` === file);

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  return renderProjectCover({
    title: project.title,
    tagline: project.tagline,
    tags: project.technologies,
    repo: project.href.split("/").pop() ?? project.slug,
  });
}
