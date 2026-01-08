import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@seed-design/react", "@seed-design/stackflow"],
  serverExternalPackages: ["ts-morph", "typescript", "oxc-transform", "@shikijs/twoslash"],
  staticPageGenerationTimeout: 300,
  images: {
    // FIXME: temporal use for static export; will remove after image optimization setup
    unoptimized: true,
  },
  async redirects() {
    return [
      // AI Integration 문서 리다이렉트 (기존 경로 → 새 섹션)
      {
        source: "/react/ai-integration/:path*",
        destination: "/ai-integration/:path*",
        permanent: true,
      },
      {
        source: "/docs/ai-integration/:path*",
        destination: "/ai-integration/:path*",
        permanent: true,
      },
      {
        source: "/breeze/ai-integration/:path*",
        destination: "/ai-integration/:path*",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
