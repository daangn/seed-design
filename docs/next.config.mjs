import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  typescript: {
    // `bun run build`에서 TypeScript 7 검사가 먼저 성공한 경우에만 Next의 TypeScript 6 검사를 생략한다.
    ignoreBuildErrors: process.env.NEXT_EXTERNAL_TYPECHECK === "1",
  },
  transpilePackages: ["@seed-design/react", "@seed-design/stackflow"],
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "@shikijs/twoslash",
    "unified",
    "remark",
    "remark-gfm",
    "remark-rehype",
    "rehype-stringify",
  ],
  staticPageGenerationTimeout: 300,
  images: {
    // FIXME: temporal use for static export; will remove after image optimization setup
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.conditionNames = ["seed-layered", "..."];
    return config;
  },
};

export default withMDX(config);
