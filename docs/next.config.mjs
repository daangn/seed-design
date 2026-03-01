import { createMDX } from "fumadocs-mdx/next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@seed-design/react", "@seed-design/stackflow"],
  serverExternalPackages: ["ts-morph", "typescript", "oxc-transform", "@shikijs/twoslash"],
  staticPageGenerationTimeout: 300,
  images: {
    // Keep unoptimized for initial Workers migration.
    // Enable Cloudflare Images in a follow-up by adding the images binding to wrangler.jsonc.
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/docs/design/:path*", destination: "/docs/:path*", permanent: true },
      { source: "/docs/react/:path*", destination: "/react/:path*", permanent: true },
    ];
  },
};

export default withMDX(config);
