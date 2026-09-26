import { withContentCollections } from "@content-collections/next";

// In CI, actions/configure-pages provides the path the site is served from:
// "/devpilotX" on devpilotx.github.io, or "" once a custom domain is set.
// Locally both are empty, so the dev server runs at the root as usual.
const basePath = process.env.PAGES_BASE_PATH ?? "";
// configure-pages reports http:// whenever "Enforce HTTPS" is off, but the
// site is always reachable over https, so links and metadata use that.
const siteUrl = (process.env.PAGES_BASE_URL || "https://devpilotx.me").replace(
  /^http:\/\//,
  "https://"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The site is hosted on GitHub Pages, so it is built as plain static files.
  output: "export",
  // GitHub Pages serves /blog/ from blog/index.html without extra rewrites.
  trailingSlash: true,
  basePath,
  images: {
    unoptimized: true,
  },
  // next/link handles basePath by itself, but plain <img> and <a> tags do
  // not, so the value is exposed to the app as well.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl.replace(/\/$/, ""),
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
