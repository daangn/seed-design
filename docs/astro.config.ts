/**
 * Astro 설정. Vite 부분(Lynx web-core asset plugin, worker format, postcss 고정, `seed-layered` 조건 3환경,
 * noExternal, envPrefix, `next/dynamic` shim)은 c1a2105fd에서 가져왔다. collections는 `SECTIONS`에서 파생한다.
 *
 * Vite alias(`@/`) 없이 읽히므로 상대 경로 import만 쓴다.
 *
 * `@fumadocs/astro`·`fumadocs-core/source`를 import하는 곳은 이 파일, `src/content.config.ts`,
 * `src/content/source.ts` 셋뿐이다. 버전: `@fumadocs/astro@0.3.0`(정확 고정), `fumadocs-core`·`fumadocs-ui
 * ^16.19.0`, `@fumadocs/satteri ^0.8`, `satteri ^0.11.7`, `@astrojs/react 7.1.8` + `oxc-transform-react 0.156.0`.
 *
 * 빌드는 Node로 돈다(`bun run astro build`는 bin shebang이 node). `bun --bun astro build`는
 * fumadocs-typescript(type table)가 `stdout._handle.fd` TypeError로 실패한다.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { satteri } from "@astrojs/markdown-satteri";
import react from "@astrojs/react";
import fumadocs from "@fumadocs/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type ViteUserConfig } from "astro/config";
import { defaultClientConditions, defaultServerConditions } from "vite";
import { createFumadocsOptions } from "./lib/content/satteri-options";
import { sectionsForBuild } from "./src/content/sections";

const archiveChannel = process.env.NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL;
const root = fileURLToPath(new URL(".", import.meta.url));
const serverConditions = ["seed-layered", ...defaultServerConditions];

/**
 * CI는 `SEED_DOCS_INCREMENTAL_BUILD=1`로 켠다. 로컬은 끈다(작업 중 tree에서 Git 수정일 cacheKey가 정확하지 않다).
 * `SEED_DOCS_PRERENDER_WORKERS`는 측정용 스위치다(렌더가 serial의 71%에 그쳐 채택하지 않았다, PLAN Phase 1 재측정).
 * 두 플래그는 Astro config hash에 들어가지 않는다.
 */
const incrementalBuild = process.env.SEED_DOCS_INCREMENTAL_BUILD === "1";
const prerenderWorkers = Number(process.env.SEED_DOCS_PRERENDER_WORKERS) || 0;

/**
 * 기존 코드가 읽는 `process.env.NEXT_PUBLIC_*`(Next가 빌드 때 박아 넣던 값)를 Vite에서도 같은 값으로 바꾼다.
 * 브라우저에는 `process`가 없다. 값이 없으면 `undefined` 그대로다.
 */
const publicEnvDefine = Object.fromEntries(
  [
    "NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL",
    "NEXT_PUBLIC_LYNX_BUNDLE_ORIGIN",
    "NEXT_PUBLIC_STACKFLOW_SPA_URL",
  ].map((key) => [`process.env.${key}`, JSON.stringify(process.env[key]) ?? "undefined"]),
);

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];

/**
 * SEED CSS는 `src/styles/global.css`가 `@seed-design/css/all.layered.css`를 한 번 import한다. recipe `.css`
 * side-effect import(`@seed-design/react`·예제가 부른다)는 빈 모듈로 바꾼다. 이 plugin이 없으면 Astro가 예제
 * lazy glob을 따라가 모든 예제의 recipe CSS를 문서 route의 모든 페이지에 따로 붙인다.
 */
function seedCssGraft(): VitePlugin {
  return {
    name: "seed-docs:recipe-css-graft",
    enforce: "pre",
    load(id) {
      if (/\/packages\/css\/recipes\/[^/]+\.css(\?|$)/.test(id)) return "";
    },
  };
}

/**
 * `@lynx-js/web-core`는 `new URL(/* webpack 주석 *\/ "….wasm", import.meta.url)`처럼 주석을 끼워 wasm과
 * worker를 가리킨다. Vite는 주석이 끼면 asset·worker로 인식하지 못해 번들에서 빠뜨리므로 첫 인자 앞의 주석을 지운다.
 */
function lynxWebCoreAssetUrls(): VitePlugin {
  return {
    name: "seed-docs:lynx-web-core-asset-urls",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("/@lynx-js/web-core/dist/client/")) return;
      return code.replace(/(new (?:URL|Worker)\()\s*(?:\/\*[\s\S]*?\*\/\s*)+/g, "$1");
    },
  };
}

/**
 * 빌드 경고 허용 목록. 의존성 코드가 의도적으로 direct `eval`을 쓴다: `@lynx-js/lynx-core` web 출력은 Lynx 번들 JS를
 * 실행하고, `@lottiefiles/react-lottie-player`(lottie-web)는 After Effects expression을 실행한다. 우리 코드에서는
 * 고칠 수 없으므로 이 둘만 거르고 나머지 경고는 그대로 낸다.
 */
const ALLOWED_EVAL_MODULES =
  /@lynx-js\/lynx-core\/output\/web\/|@lottiefiles\/react-lottie-player\/dist\//;

const PUBLIC_OG_FILES_ID = "virtual:seed-docs/public-og-files";

/**
 * `public/og/**` 파일 목록을 module로 낸다(`src/content/public-files.ts`). 커버·OG 이미지 존재 판정이 render 중
 * `existsSync`를 쓰지 않게 한다. 목록이 module graph에 들어가므로 파일을 더하거나 지우면 incremental build가
 * 그 목록을 쓰는 route를 다시 렌더링한다.
 */
function publicOgFiles(): VitePlugin {
  const dir = path.join(root, "public", "og");
  return {
    name: "seed-docs:public-og-files",
    resolveId(id) {
      if (id === PUBLIC_OG_FILES_ID) return `\0${PUBLIC_OG_FILES_ID}`;
    },
    load(id) {
      if (id !== `\0${PUBLIC_OG_FILES_ID}`) return;
      this.addWatchFile(dir);
      const files = readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map(
          (entry) =>
            `/${path.relative(path.join(root, "public"), path.join(entry.parentPath, entry.name)).split(path.sep).join("/")}`,
        )
        .sort();
      return `export default ${JSON.stringify(files)};`;
    },
  };
}

export default defineConfig({
  site: "https://seed-design.io",
  outDir: "./out",
  cacheDir: "./.cache/astro", // CI 캐시 단위 `astro`. node_modules 밖에 둔다.
  trailingSlash: archiveChannel ? "always" : "never",
  build: {
    format: archiveChannel ? "directory" : "file", // Next export와 같은 `foo.html`
    ...(archiveChannel ? { assetsPrefix: `/${archiveChannel}/_assets` } : {}),
  },
  markdown: {
    syntaxHighlight: false, // rehype-code(Shiki)가 fumadocs 옵션에서 처리
    // 문서에서 directive 문법을 쓰지 않는다. 켜 두면 한국어의 `2:1로` 같은 비율을 textDirective로 읽는다.
    processor: satteri({ features: { directive: false, smartPunctuation: false } }),
  },
  integrations: [
    react(),
    // components 옵션 없음 = Astro MDX 모드. <Content components>는 hydrate하지 않고 렌더링만 한다.
    fumadocs({
      ...createFumadocsOptions(),
      collections: Object.fromEntries(sectionsForBuild().map((s) => [s.id, { dir: s.contentDir }])),
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  experimental: {
    incrementalBuild,
    parallelPrerender: prerenderWorkers > 0 ? { workers: prerenderWorkers } : false,
  },
  server: { port: Number(process.env.PORT) || 3000, allowedHosts: [".test"] },
  vite: {
    plugins: [tailwindcss(), seedCssGraft(), lynxWebCoreAssetUrls(), publicOgFiles()],
    build: {
      // 500kB를 넘는 chunk는 모두 첫 로드에 받지 않는 lazy chunk다: IconLibrary(`/foundations/iconography/library`
      // 한 쪽, client:only, 아이콘 데이터 3.9MB)와 Shiki 언어 문법(언어별 lazy, 최대 0.8MB). Next 산출물에도 4.4MB
      // chunk가 있었다. 첫 로드 JS는 단계 게이트(Playwright perf)가 잰다.
      chunkSizeWarningLimit: 4096,
      rolldownOptions: {
        onLog(level, log, handler) {
          if (log.code === "EVAL" && ALLOWED_EVAL_MODULES.test(`${log.id ?? ""} ${log.message}`))
            return;
          // 빈 문자열 문장(`''`)은 unified 계열(mdast-util-to-hast)이 JSDoc 타입 참조를 위해 두는 것이라 의미가 없다.
          // 검색 다이얼로그(브라우저 Markdown 렌더러)가 그 모듈을 client 번들에 넣으면서 나온다.
          if (log.code === "MODULE_LEVEL_DIRECTIVE" && log.message.includes('directive ""')) return;
          handler(level, log);
        },
      },
    },
    define: publicEnvDefine,
    // Lynx Web runtime의 worker는 ES module이다.
    worker: { format: "es" },
    // `postcss.config.js`는 Lynx 예제 빌드용이다. Vite가 그 파일을 읽으면 Tailwind가 두 번 돈다.
    css: { postcss: { plugins: [] } },
    // 페이지 HTML이 링크하는 CSS는 서버 쪽 환경이 만든다. 정적 빌드는 `prerender`, dev는 `ssr` 환경이다.
    ssr: { resolve: { conditions: serverConditions } },
    environments: { prerender: { resolve: { conditions: serverConditions } } },
    envPrefix: ["NEXT_PUBLIC_", "PUBLIC_"],
    resolve: {
      // `conditions`를 지정하면 Vite 기본값이 사라지므로(예: `browser`) 기본 조건을 함께 넘긴다.
      conditions: ["seed-layered", ...defaultClientConditions],
      noExternal: [/^@seed-design\//],
      alias: {
        "@": root.replace(/\/$/, ""),
        "seed-design": `${root}registry/react`,
        // 문서 예제가 독자에게 보여 주는 `next/dynamic` import를 Next.js 없이 실행한다.
        "next/dynamic": `${root}components/next-dynamic.ts`,
      },
    },
  },
});
