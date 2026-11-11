import { fileURLToPath } from "node:url";
import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import fumadocs from "@fumadocs/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { createFumadocsOptions } from "./lib/content/satteri-options";

const archiveChannel = process.env.NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL;
if (archiveChannel && !/^(?:react|lynx)\/v(?:0|[1-9]\d*|1\.(?:0|[1-9]\d*))$/.test(archiveChannel)) {
  throw new Error(
    "Archives must use a major channel such as react/v2 or lynx/v0, or retained react/v1.0 channels",
  );
}

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  site: "https://seed-design.io",
  outDir: "./out",
  // archive 채널은 `/react/v3/…/` 디렉터리 URL로 제공하고, 기본 빌드는 `foo.html` 파일로 내보낸다.
  trailingSlash: archiveChannel ? "always" : "never",
  build: {
    format: archiveChannel ? "directory" : "file",
    ...(archiveChannel ? { assetsPrefix: `/${archiveChannel}/_assets` } : {}),
  },
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      // 문서에서 directive 문법을 쓰지 않습니다. 켜 두면 한국어의 `2:1로` 같은 비율을
      // textDirective로 해석해 LLM용 Markdown 직렬화가 실패합니다.
      features: { directive: false, smartPunctuation: false },
    }),
  },
  integrations: [react(), mdx(), fumadocs(createFumadocsOptions())],
  server: { allowedHosts: [".test"] },
  vite: {
    plugins: [
      tailwindcss(),
      {
        // `@lynx-js/web-core`는 `new URL(/* webpack 주석 */ "….wasm", import.meta.url)`처럼 주석을 끼워
        // wasm과 worker를 가리킨다. Vite는 주석이 끼면 이 패턴을 asset·worker로 인식하지 못해 번들에서
        // 빠뜨리므로, 첫 인자 앞의 주석을 지운다.
        name: "seed-docs:lynx-web-core-asset-urls",
        enforce: "pre",
        transform(code, id) {
          if (!id.includes("/@lynx-js/web-core/dist/client/")) return;
          return code.replace(/(new (?:URL|Worker)\()\s*(?:\/\*[\s\S]*?\*\/\s*)+/g, "$1");
        },
      },
    ],
    // Lynx Web runtime의 worker는 ES module이다.
    worker: { format: "es" },
    envPrefix: ["NEXT_PUBLIC_", "PUBLIC_"],
    resolve: {
      // `@seed-design/css`의 recipe를 `@layer`로 감싼 진입점으로 연결한다.
      conditions: ["seed-layered"],
      // CSS를 import하거나 `seed-layered` 조건으로 해석해야 하는 패키지는 Vite를 거쳐야 한다.
      noExternal: ["fumadocs-ui", /^@seed-design\//],
      alias: {
        "@": root.replace(/\/$/, ""),
        "seed-design": `${root}registry/react`,
        // 문서 예제가 독자에게 보여 주는 `next/dynamic` import를 Next.js 없이 실행한다.
        "next/dynamic": `${root}components/next-dynamic.ts`,
      },
    },
  },
});
