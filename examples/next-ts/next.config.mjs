/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@seed-design/stylesheet", "@seed-design/recipe"],
};

export default nextConfig;
