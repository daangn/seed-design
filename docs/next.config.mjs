import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const archiveVersion = process.env.NEXT_PUBLIC_REACT_ARCHIVE_VERSION;
if (archiveVersion && !/^v1\.[012]$/.test(archiveVersion))
  throw new Error("Invalid legacy React archive channel");
const config = {
  ...(archiveVersion
    ? { assetPrefix: `/react/${archiveVersion}/_assets`, trailingSlash: true }
    : {}),
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@seed-design/react", "@seed-design/stackflow"],
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "@shikijs/twoslash",
    "@seed-design/rootage-core",
  ],
  staticPageGenerationTimeout: 300,
  images: {
    // FIXME: temporal use for static export; will remove after image optimization setup
    unoptimized: true,
  },
};

export default withMDX(config);
