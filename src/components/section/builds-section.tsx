import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DATA } from "@/data/resume";
import { Icons } from "@/components/icons";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";

export default function BuildsSection() {
  return (
    <section id="builds" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">More Builds</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">I like building things</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              Besides the projects above, here are {DATA.builds.length} more
              things I have built and put on GitHub. Some are experiments,
              some are tools I needed myself, and a few are full products.
            </p>
          </div>
        </div>
        <Timeline>
          {DATA.builds.map((build) => (
            <TimelineItem key={build.title} className="w-full flex items-start justify-between gap-10">
              <TimelineConnectItem className="flex items-start justify-center">
                <div className="size-10 bg-card z-10 shrink-0 overflow-hidden border rounded-full shadow ring-2 ring-border flex items-center justify-center flex-none">
                  <build.icon className="size-4 text-foreground" aria-hidden />
                </div>
              </TimelineConnectItem>
              <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                <time className="text-xs text-muted-foreground">{build.dates}</time>
                <h3 className="font-semibold leading-none">{build.title}</h3>
                <p className="text-sm text-muted-foreground">{build.stack}</p>
                <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                  {build.description}
                </p>
                {build.links.length > 0 && (
                  <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                    {build.links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground">
                          {link.title === "Website" ? (
                            <Icons.globe className="h-4 w-4" />
                          ) : (
                            <Icons.github className="h-4 w-4" />
                          )}
                          {link.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}
