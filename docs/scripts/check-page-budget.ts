/**
 * `bun --filter @seed-design/docs check:budget` — 빌드 산출물(`out/**\/*.html`)의 island 구조 검사. `build:post` 마지막에
 * 돈다. 되돌린 시도(c1a2105fd)를 무너뜨린 모양(셸 전체 `client:load`, slot을 가진 persist island, 무거운 island props)이
 * 다시 들어오면 빌드를 실패시킨다.
 *
 * 규칙(렌더 결과로만 볼 수 있는 규칙은 이 파일에만 둔다. 소스 규칙 S-1–S-5는 `src/structure.test.ts`)
 * O-1 `<astro-island client="load">`의 컴포넌트(`opts.name`)는 `LOAD_ALLOWED` 중 하나다.
 * O-2 문서 셸 페이지(`#nd-notebook-layout`이 있는 문서)마다 `data-astro-transition-persist` 요소 집합이 정확히
 *     `PERSISTED`다(이름·island 컴포넌트·persist-props). persist 이름 목록, "persist island는 하나", "조건 없이 그린다"를
 *     한 번에 본다. 문서 셸이 아닌 페이지에는 persist 요소가 없다.
 * O-3 persist된 island 안에 `<astro-slot>`·`<template data-astro-template>`이 없다(persist island의 slot은 갱신되지 않는다).
 * O-4 `DocsNav` island의 `props` 속성(HTML escape 포함 실제 바이트)과 `#docs-nav-data` 본문이 각각 ≤ `NAV_PROPS_MAX_BYTES`.
 * O-5 문서 셸 페이지의 `<script type="module" src>`는 `SCRIPT_ALLOWED` 중 하나다(셸 밖 페이지 script가 몰래 늘거나
 *     React를 import하는 `.astro` script가 들어오는 것을 막는다).
 *
 * 하지 않는 것: 페이지 유형별 island 개수 상한. JS 바이트·CLS·이동 지연·hydrate 수는 단계 게이트의 Playwright 측정이
 * 잰다. 개수는 원인 분석용으로 출력만 한다.
 */
import path from "node:path";

/** O-1. 문서 셸 둘과 ClientRouter 없는 별도 문서 둘. SiteHeader를 persist(escape hatch)하면 여기와 PERSISTED를 함께 바꾼다. */
export const LOAD_ALLOWED: readonly string[] = [
  "DocsNav",
  "SiteHeader",
  "LandingPage",
  "BlockRenderer",
];

export interface PersistedElement {
  /** `transition:persist` 이름. */
  name: string;
  /** island 컴포넌트 이름. island가 아닌 요소(portal 루트)는 null. */
  island: string | null;
  persistProps: boolean;
}

/**
 * O-2. 문서 셸의 persist 요소는 `DocsNav` island(persist-props)와 모바일 패널 portal 루트 둘이다(`DocsShell.astro`).
 * SiteHeader를 persist(escape hatch)하면 여기와 LOAD_ALLOWED 주석을 함께 바꾼다.
 */
export const PERSISTED: readonly PersistedElement[] = [
  { name: "docs-nav", island: "DocsNav", persistProps: true },
  { name: "docs-nav-portal", island: null, persistProps: false },
];

/** O-4. React 섹션(가장 큼) 실측: props 속성 raw 29,352B, `#docs-nav-data` 15,610B [S1-d]. */
export const NAV_PROPS_MAX_BYTES = 40 * 1024;

/**
 * O-5. 산출물 경로로 판정한다(archive 빌드는 `/<channel>/_assets` 접두사).
 * - `DocsShell.astro`의 `<script>`(`src/shell/client.ts`)
 * - `page.*.js`: Astro가 모든 페이지에 넣는 page script(prefetch, `@fumadocs/astro` page script 포함, S2 이탈 7)
 * - `<ClientRouter />`의 router script
 * island component·renderer chunk는 `astro-island`가 불러오므로 대상이 아니다.
 */
export const SCRIPT_ALLOWED: readonly RegExp[] = [
  /^(?:\/[\w.-]+\/[\w.-]+\/_assets)?\/_astro\/ClientRouter\.astro_astro_type_script_index_0_lang\.[\w-]+\.js$/,
  /^(?:\/[\w.-]+\/[\w.-]+\/_assets)?\/_astro\/DocsShell\.astro_astro_type_script_index_0_lang\.[\w-]+\.js$/,
  /^(?:\/[\w.-]+\/[\w.-]+\/_assets)?\/_astro\/page\.[\w-]+\.js$/,
];

export type Rule = "O-1" | "O-2" | "O-3" | "O-4" | "O-5";

export interface PageReport {
  violations: Array<{ rule: Rule; detail: string }>;
  docsShell: boolean;
  islands: Array<{ name: string; client: string }>;
  navBytes?: { props: number; data: number };
}

interface PersistSeen extends PersistedElement {
  tag: string;
}

/** HTML 한 쪽을 검사한다. `HTMLRewriter`(Bun 내장)로 읽는다. */
export async function checkPage(html: string): Promise<PageReport> {
  const violations: PageReport["violations"] = [];
  const islands: PageReport["islands"] = [];
  const persisted: PersistSeen[] = [];
  const scripts: string[] = [];
  let docsShell = false;
  let persistDepth = 0;
  let navProps: number | undefined;
  let navData = 0;
  const slotInPersisted = (element: { tagName: string }) => {
    if (persistDepth > 0)
      violations.push({ rule: "O-3", detail: `persist island 안의 <${element.tagName}>` });
  };

  const rewriter = new HTMLRewriter()
    .on("#nd-notebook-layout", {
      element() {
        docsShell = true;
      },
    })
    .on("[data-astro-transition-persist]", {
      element(element) {
        const opts =
          element.tagName === "astro-island" ? islandName(element.getAttribute("opts")) : null;
        persisted.push({
          tag: element.tagName,
          name: element.getAttribute("data-astro-transition-persist") ?? "",
          island: opts,
          persistProps: element.hasAttribute("data-astro-transition-persist-props"),
        });
        if (element.tagName !== "astro-island") return;
        persistDepth++;
        element.onEndTag(() => {
          persistDepth--;
        });
      },
    })
    .on("astro-island", {
      element(element) {
        const name =
          islandName(element.getAttribute("opts")) ??
          element.getAttribute("component-export") ??
          "?";
        const client = element.getAttribute("client") ?? "";
        islands.push({ name, client });
        if (client === "load" && !LOAD_ALLOWED.includes(name)) {
          violations.push({ rule: "O-1", detail: `client="load" island ${name}` });
        }
        if (name === "DocsNav") navProps = Buffer.byteLength(element.getAttribute("props") ?? "");
      },
    })
    .on("astro-slot", { element: slotInPersisted })
    .on("template[data-astro-template]", { element: slotInPersisted })
    .on("script#docs-nav-data", {
      text(text) {
        navData += Buffer.byteLength(text.text);
      },
    })
    .on('script[type="module"][src]', {
      element(element) {
        scripts.push(element.getAttribute("src") ?? "");
      },
    });
  // 문자열을 바로 넘긴다(`bun test`의 happy-dom preload가 전역 `Response`를 바꿔 둔다).
  rewriter.transform(html);

  if (docsShell) {
    const expected = PERSISTED.map(persistKey).sort();
    const actual = persisted.map(persistKey).sort();
    if (expected.join("\n") !== actual.join("\n")) {
      violations.push({
        rule: "O-2",
        detail: `persist 집합 [${actual.join(", ")}] ≠ PERSISTED [${expected.join(", ")}]`,
      });
    }
    for (const src of scripts) {
      if (!SCRIPT_ALLOWED.some((pattern) => pattern.test(src))) {
        violations.push({ rule: "O-5", detail: `허용 목록 밖 module script ${src}` });
      }
    }
  } else if (persisted.length > 0) {
    violations.push({
      rule: "O-2",
      detail: `문서 셸이 아닌 페이지의 persist 요소 [${persisted.map(persistKey).join(", ")}]`,
    });
  }

  const navBytes =
    navProps !== undefined || navData > 0 ? { props: navProps ?? 0, data: navData } : undefined;
  if (navBytes && navBytes.props > NAV_PROPS_MAX_BYTES) {
    violations.push({
      rule: "O-4",
      detail: `DocsNav props ${navBytes.props}B > ${NAV_PROPS_MAX_BYTES}B`,
    });
  }
  if (navBytes && navBytes.data > NAV_PROPS_MAX_BYTES) {
    violations.push({
      rule: "O-4",
      detail: `#docs-nav-data ${navBytes.data}B > ${NAV_PROPS_MAX_BYTES}B`,
    });
  }

  return { violations, docsShell, islands, ...(navBytes ? { navBytes } : {}) };
}

/** `HTMLRewriter`의 `getAttribute`는 HTML entity를 풀지 않는다(`opts="{&quot;name&quot;:…}"`). */
function decodeAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function islandName(opts: string | null): string | null {
  if (!opts) return null;
  try {
    const name = (JSON.parse(decodeAttribute(opts)) as { name?: unknown }).name;
    return typeof name === "string" ? name : null;
  } catch {
    return null;
  }
}

function persistKey(element: PersistedElement): string {
  return `${element.name}:${element.island ?? "-"}${element.persistProps ? "+props" : ""}`;
}

export interface OutputReport {
  pages: number;
  docsShellPages: number;
  violations: Array<{ page: string; rule: Rule; detail: string }>;
  /** 섹션(첫 경로 조각) → DocsNav props·data 최대 바이트. */
  navBytesMax: Record<string, { props: number; data: number }>;
  /** 원인 분석용. 게이트가 아니다. directive → island 수 합계. */
  islandTotals: Record<string, number>;
}

export async function checkIslandOutput(outDir: string): Promise<OutputReport> {
  const report: OutputReport = {
    pages: 0,
    docsShellPages: 0,
    violations: [],
    navBytesMax: {},
    islandTotals: {},
  };
  for await (const file of new Bun.Glob("**/*.html").scan({ cwd: outDir, onlyFiles: true })) {
    const page = file.split(path.sep).join("/");
    const result = await checkPage(await Bun.file(path.join(outDir, file)).text());
    report.pages++;
    if (result.docsShell) report.docsShellPages++;
    for (const violation of result.violations) report.violations.push({ page, ...violation });
    for (const island of result.islands) {
      report.islandTotals[island.client] = (report.islandTotals[island.client] ?? 0) + 1;
    }
    if (result.navBytes) {
      const section = page.split("/")[0]?.replace(/\.html$/, "") ?? "";
      const max = report.navBytesMax[section] ?? { props: 0, data: 0 };
      report.navBytesMax[section] = {
        props: Math.max(max.props, result.navBytes.props),
        data: Math.max(max.data, result.navBytes.data),
      };
    }
  }
  report.violations.sort((a, b) => a.page.localeCompare(b.page) || a.rule.localeCompare(b.rule));
  return report;
}

if (import.meta.main) {
  const outDir = path.resolve(process.argv[2] ?? "out");
  const report = await checkIslandOutput(outDir);
  console.log(
    `check:budget — ${outDir}: HTML ${report.pages}쪽(문서 셸 ${report.docsShellPages}쪽), 위반 ${report.violations.length}건`,
  );
  console.log(
    `  island(원인 분석용): ${
      Object.entries(report.islandTotals)
        .map(([client, count]) => `${client} ${count}`)
        .join(", ") || "없음"
    }`,
  );
  for (const [section, bytes] of Object.entries(report.navBytesMax)) {
    console.log(`  DocsNav ${section}: props ${bytes.props}B, data ${bytes.data}B`);
  }
  for (const violation of report.violations.slice(0, 50)) {
    console.log(`  ${violation.rule} ${violation.page}: ${violation.detail}`);
  }
  if (report.violations.length > 50) console.log(`  … 외 ${report.violations.length - 50}건`);
  if (report.pages === 0) {
    console.error("검사할 HTML이 없습니다. 먼저 빌드하세요.");
    process.exit(1);
  }
  process.exit(report.violations.length === 0 ? 0 : 1);
}
