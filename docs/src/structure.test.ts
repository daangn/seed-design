/**
 * 소스 수준 구조 불변식. `bun docs:test`가 실행한다. `.astro`를 렌더링하지 않고 소스 텍스트를 읽는다.
 * 규칙마다 "지금 트리가 지킨다"와 "어기는 예시를 잡는다"를 함께 본다.
 *
 * 규칙(렌더 결과로만 볼 수 있는 규칙은 `scripts/check-page-budget.ts`의 O-1–O-5가 맡는다)
 * S-1 `client:` directive는 `DIRECTIVE_FILES`에만 있다. MDX 원문(`content/**\/*.mdx`, 코드 블록 밖)에는 없다.
 * S-2 `<ClientRouter`는 `src/layouts/DocsShell.astro`에만 있다.
 * S-3 `@fumadocs/astro`·`fumadocs-core/source`는 `ENGINE_FILES`만 import한다. `fumadocs-ui` JS import는
 *     `FUMADOCS_UI_JS_PENDING`에만 남고, 이 목록은 줄어들기만 한다(더 이상 import하지 않는 파일이 남아 있어도 실패).
 *     CSS `@import`는 Phase 7까지 허용한다(`src/styles/`).
 * S-4 render 경로(`src/layouts`·`src/mdx`·`src/pages`의 `.astro`, `src/pages`의 endpoint `.ts`)는 `fs`를 import하지 않고
 *     `fetch(`를 부르지 않는다. 빌드 데이터는 module로 import한다(incremental build가 낡은 페이지를 복원하지 않게).
 *     휴리스틱이고 최종 판정은 Phase 5의 incremental vs `--force` 산출물 diff다.
 * S-5 React 컴포넌트를 import하는 `.astro`(`src/layouts`·`src/mdx`·`src/components`)는 frontmatter에서 `await`하지 않는다.
 *     React renderer가 렌더링 순서대로 `useId` 접두사를 주므로 그 앞의 I/O 대기는 빌드를 비결정적으로 만든다.
 *     route 파일(`src/pages/**`)의 맨 앞 데이터 로드는 예외다. React 판정: `.tsx`로 풀리는 상대 import 또는 이름에
 *     `react`가 든 패키지.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "bun:test";

const DOCS = path.resolve(import.meta.dir, "..");

/**
 * S-1. 여기에 없는 파일에 `client:*`를 쓰려면 이 목록을 고치면서 이유를 PR에 남긴다.
 * - 문서 셸: DocsNav·SiteHeader(load), Toc·PageActions(idle) — Phase 2
 * - MDX island wrapper: visible·idle·only(load 금지는 O-1)
 * - ClientRouter 없는 별도 문서: landing, blocks iframe, `/admin`(`src/layouts/PageShell.astro`) — Phase 4
 */
export const DIRECTIVE_FILES = [
  "src/layouts/DocsShell.astro",
  "src/layouts/DocsArticle.astro",
  "src/mdx/islands/*.astro",
  "src/pages/index.astro",
  "src/pages/blocks/[[]name].astro", // Bun.Glob에서 `[`는 문자 클래스라 `[[]`로 쓴다.
  "src/pages/admin.astro",
] as const;

/**
 * S-3. 데이터 엔진(`@fumadocs/astro`, fumadocs-core loader)을 아는 파일. `lib/content/satteri-options.ts`는 같은
 * 통합의 옵션(`CollectionOptions`)을 만든다.
 */
export const ENGINE_FILES = [
  "astro.config.ts",
  "lib/content/satteri-options.ts",
  "src/content.config.ts",
  "src/content/source.ts",
] as const;

/**
 * S-3 임시 허용 목록: 아직 `fumadocs-ui` JS를 import하는 파일. 줄어들기만 한다. 셸 파일은 Phase 2에서, MDX 본문
 * 컴포넌트는 Phase 3에서, landing은 Phase 4에서 0이 됐다. 비어 있어야 한다(새 import가 생기면 실패).
 */
const FUMADOCS_UI_JS_PENDING: readonly string[] = [];

interface SourceFile {
  /** docs 기준 POSIX 경로. */
  path: string;
  text: string;
}

const SKIP = /^(?:node_modules|out|\.cache|\.astro)\/|\.test\.tsx?$/;

async function sources(globs: readonly string[]): Promise<SourceFile[]> {
  const seen = new Map<string, SourceFile>();
  for (const pattern of globs) {
    for await (const file of new Bun.Glob(pattern).scan({ cwd: DOCS, onlyFiles: true })) {
      const posix = file.split(path.sep).join("/");
      if (SKIP.test(posix) || seen.has(posix)) continue;
      seen.set(posix, { path: posix, text: await Bun.file(path.join(DOCS, file)).text() });
    }
  }
  return [...seen.values()].sort((a, b) => a.path.localeCompare(b.path));
}

const matchesAny = (file: string, globs: readonly string[]) =>
  globs.some((pattern) => new Bun.Glob(pattern).match(file));

/** MDX의 코드 블록·inline code 안 `client:` 예시는 위반이 아니다. */
function stripCode(mdx: string): string {
  return mdx.replace(/^(```|~~~)[\s\S]*?^\1/gm, "").replace(/`[^`\n]*`/g, "");
}

/** 첫 `---` 쌍 사이의 코드(주석 제외). */
function frontmatter(astro: string): string {
  return (astro.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const IMPORT = /\bfrom\s+["']([^"']+)["']/g;

function importsReact(file: SourceFile): boolean {
  for (const [, specifier] of frontmatter(file.text).matchAll(IMPORT)) {
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      const base = specifier.startsWith("@/")
        ? path.join(DOCS, specifier.slice(2))
        : path.resolve(path.dirname(path.join(DOCS, file.path)), specifier);
      if (
        base.endsWith(".tsx") ||
        existsSync(`${base}.tsx`) ||
        existsSync(path.join(base, "index.tsx"))
      )
        return true;
    } else if (/(?:^|[/-])react(?:$|[/-])/.test(specifier)) {
      return true;
    }
  }
  return false;
}

// ───────────────────────── 규칙 ─────────────────────────

export function directiveOutsideAllowed(files: SourceFile[]): string[] {
  return files
    .filter((file) => !matchesAny(file.path, DIRECTIVE_FILES))
    .filter((file) =>
      /\sclient:[a-z]/.test(file.path.endsWith(".mdx") ? stripCode(file.text) : file.text),
    )
    .map((file) => file.path);
}

export function clientRouterOutsideShell(files: SourceFile[]): string[] {
  return files
    .filter(
      (file) => file.path !== "src/layouts/DocsShell.astro" && /<ClientRouter\b/.test(file.text),
    )
    .map((file) => file.path);
}

export function engineImportOutsideEngine(files: SourceFile[]): string[] {
  return files
    .filter((file) => !(ENGINE_FILES as readonly string[]).includes(file.path))
    .filter((file) =>
      /from\s+["'](?:@fumadocs\/astro(?:\/[^"']*)?|fumadocs-core\/source)["']/.test(file.text),
    )
    .map((file) => file.path);
}

const FUMADOCS_UI_JS = /(?:\bfrom\s*|\bimport\s*\(?\s*)["']fumadocs-ui[/"']/;

export function fumadocsUiOutsidePending(files: SourceFile[], pending: readonly string[]) {
  const importing = files.filter((file) => FUMADOCS_UI_JS.test(file.text)).map((file) => file.path);
  return {
    offenders: importing.filter((file) => !pending.includes(file)),
    /** 이제 import하지 않는데 목록에 남은 파일(목록에서 지운다). */
    stale: pending.filter((file) => !importing.includes(file)),
  };
}

export function renderIo(files: SourceFile[]): string[] {
  return files
    .filter((file) => /from\s+["'](?:node:)?fs(?:\/promises)?["']|\bfetch\s*\(/.test(file.text))
    .map((file) => file.path);
}

export function awaitBeforeReact(files: SourceFile[]): string[] {
  return files
    .filter((file) => importsReact(file) && /\bawait\b/.test(frontmatter(file.text)))
    .map((file) => file.path);
}

// ───────────────────────── 검사 ─────────────────────────

const fixture = (filePath: string, text: string): SourceFile => ({ path: filePath, text });

describe("S-1 hydration 위치", () => {
  test("`client:` directive는 DIRECTIVE_FILES에만 있다", async () => {
    expect(directiveOutsideAllowed(await sources(["src/**/*.astro", "content/**/*.mdx"]))).toEqual(
      [],
    );
  });
  test("어기는 예시를 잡는다", () => {
    expect(
      directiveOutsideAllowed([
        fixture("src/mdx/Callout.astro", "<Callout client:load />"),
        fixture("content/a.mdx", "<Example client:visible />"),
        fixture("content/b.mdx", "```astro\n<X client:load />\n```\n`client:idle`"),
        fixture("src/mdx/islands/Ok.astro", "<X client:visible />"),
      ]),
    ).toEqual(["src/mdx/Callout.astro", "content/a.mdx"]);
  });
});

describe("S-2 ClientRouter", () => {
  test("<ClientRouter />는 DocsShell.astro 밖에 없다", async () => {
    expect(clientRouterOutsideShell(await sources(["src/**/*.astro"]))).toEqual([]);
  });
  test("어기는 예시를 잡는다", () => {
    expect(
      clientRouterOutsideShell([fixture("src/pages/index.astro", "<ClientRouter />")]),
    ).toEqual(["src/pages/index.astro"]);
  });
});

describe("S-3 import 경계", () => {
  const code = [
    "astro.config.ts",
    "src/**/*.{ts,tsx,astro}",
    "lib/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
  ];

  test("fumadocs 데이터 엔진은 ENGINE_FILES만 import한다", async () => {
    expect(engineImportOutsideEngine(await sources(code))).toEqual([]);
  });
  test("fumadocs-ui JS import는 임시 목록에만 있고, 목록은 실제와 같다", async () => {
    expect(fumadocsUiOutsidePending(await sources(code), FUMADOCS_UI_JS_PENDING)).toEqual({
      offenders: [],
      stale: [],
    });
  });
  test("어기는 예시를 잡는다", () => {
    expect(
      engineImportOutsideEngine([
        fixture("lib/x.ts", 'import { loader } from "fumadocs-core/source";'),
        fixture("src/y.ts", 'import { pageLoader } from "@fumadocs/astro/loaders";'),
        fixture("lib/z.ts", 'import { pageSchema } from "fumadocs-core/source/schema";'),
      ]),
    ).toEqual(["lib/x.ts", "src/y.ts"]);
    expect(
      fumadocsUiOutsidePending(
        [
          fixture("components/a.tsx", 'import { Card } from "fumadocs-ui/components/card";'),
          fixture("components/b.tsx", 'const m = await import("fumadocs-ui/page");'),
        ],
        ["components/b.tsx", "components/gone.tsx"],
      ),
    ).toEqual({ offenders: ["components/a.tsx"], stale: ["components/gone.tsx"] });
  });
});

describe("S-4 render 경로의 fs·fetch", () => {
  test("render 경로는 fs·fetch를 쓰지 않는다", async () => {
    expect(
      renderIo(
        await sources([
          "src/layouts/**/*.astro",
          "src/mdx/**/*.astro",
          "src/pages/**/*.astro",
          "src/pages/**/*.ts",
        ]),
      ),
    ).toEqual([]);
  });
  test("어기는 예시를 잡는다", () => {
    expect(
      renderIo([
        fixture("src/mdx/A.astro", '---\nimport { readFileSync } from "node:fs";\n---'),
        fixture("src/pages/b.ts", "export const GET = async () => fetch(url);"),
        fixture("src/mdx/C.astro", '---\nimport data from "../data.json";\n---'),
      ]),
    ).toEqual(["src/mdx/A.astro", "src/pages/b.ts"]);
  });
});

describe("S-5 결정적 render", () => {
  test("React를 import하는 .astro는 frontmatter에서 await하지 않는다", async () => {
    expect(
      awaitBeforeReact(
        await sources([
          "src/layouts/**/*.astro",
          "src/mdx/**/*.astro",
          "src/components/**/*.astro",
        ]),
      ),
    ).toEqual([]);
  });
  test("어기는 예시를 잡는다", () => {
    expect(
      awaitBeforeReact([
        fixture(
          "src/mdx/A.astro",
          '---\nimport { Callout } from "../../components/callout";\nconst x = await f();\n---',
        ),
        fixture(
          "src/mdx/B.astro",
          '---\nimport { Box } from "@seed-design/react";\nawait f();\n---',
        ),
        fixture(
          "src/mdx/C.astro",
          '---\nimport { packageManagerTabItems } from "../../components/codeblock/package-manager";\nawait f();\n---',
        ),
        fixture(
          "src/mdx/D.astro",
          '---\nimport { Callout } from "../../components/callout";\n// await하지 않는다\n---\n{await x}',
        ),
      ]),
    ).toEqual(["src/mdx/A.astro", "src/mdx/B.astro"]);
  });
});
