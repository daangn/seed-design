import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
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
    // `createNextStory()` passes its glob filter straight to webpack's `test`,
    // which only accepts absolute paths or RegExp — register the loader manually.
    config.module.rules.push({
      test: /\.story\.(?:js|jsx|ts|tsx)$/,
      enforce: "pre",
      use: [
        {
          loader: fileURLToPath(new URL("./lib/story-controls-filter-loader.mjs", import.meta.url)),
        },
        { loader: "@fumadocs/story/webpack/story" },
      ],
    });
    return config;
  },
};

export default withMDX(config);
