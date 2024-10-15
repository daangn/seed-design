import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: [
    "@seed-design/react-checkbox",
    "@seed-design/react-switch",
    "@seed-design/react-tabs",
  ],
};

export default withMDX(config);
