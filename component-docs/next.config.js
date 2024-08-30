import nextra from "nextra";
import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";

const withVanillaExtract = createVanillaExtractPlugin();

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  output: "export",
  images: {
    unoptimized: true,
  },

  /**
   * @stackflow/plugin-basic-ui 패키지 내부 코드를 강제로 cjs로 변환합니다.
   * @see https://github.com/vercel/next.js/issues/39375
   * @see https://github.com/vercel/next.js/issues/39375#issuecomment-1380266233
   */
  transpilePackages: ["@stackflow/plugin-basic-ui"],
};

export default withVanillaExtract(withNextra(nextConfig));
