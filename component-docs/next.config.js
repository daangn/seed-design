import nextra from "nextra";

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
   */
  transpilePackages: ["@stackflow/plugin-basic-ui"],
};

export default withNextra(nextConfig);
