import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const recipeDirectory = fileURLToPath(new URL("../packages/css/recipes", import.meta.url));
const layeredRecipeAliases = Object.fromEntries(
  readdirSync(recipeDirectory)
    .filter((fileName) => fileName.endsWith(".layered.mjs"))
    .map((fileName) => [
      `@seed-design/css/recipes/${fileName.replace(".layered.mjs", "")}`,
      `@seed-design/css/recipes/${fileName.replace(".layered.mjs", ".layered")}`,
    ]),
);

/** @type {import('next').NextConfig} */
const config = {
  allowedDevOrigins: ["**.test"],
  output: "export",
  reactStrictMode: true,
  typescript: {
    // `bun run build`에서 TypeScript 7 검사가 먼저 성공한 경우에만 Next의 TypeScript 6 검사를 생략한다.
    ignoreBuildErrors: process.env.NEXT_EXTERNAL_TYPECHECK === "1",
  },
  transpilePackages: ["@seed-design/react", "@seed-design/stackflow"],
  serverExternalPackages: [
    "@fumadocs/satteri",
    "satteri",
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
  experimental: {
    // Next.js 16.2에서는 프로덕션 빌드용 Turbopack 파일 캐시가 기본으로 꺼져 있다.
    turbopackFileSystemCacheForBuild: true,
  },
  turbopack: {
    // Turbopack은 아직 package exports의 커스텀 condition을 설정할 수 없다.
    // Webpack의 `seed-layered` condition과 동일한 CSS 진입점을 직접 연결한다.
    resolveAlias: layeredRecipeAliases,
  },
  webpack: (config) => {
    config.resolve.conditionNames = ["seed-layered", "..."];
    return config;
  },
};

export default config;
