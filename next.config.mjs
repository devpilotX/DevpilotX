import { withContentCollections } from "@content-collections/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The site is hosted on GitHub Pages, so it is built as plain static files.
  output: "export",
  // GitHub Pages serves /blog/ from blog/index.html without extra rewrites.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
