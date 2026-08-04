import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { loader } from "fumadocs-core/source";
import { dynamic } from "fumadocs-mdx/runtime/dynamic";
import matter from "gray-matter";
import { getLLMTextForFullCompilation } from "../app/_llms/get-llm-text";
import * as Config from "../source.config";

/**
 * npm 패키지에 LLM용 문서를 내장하기 위한 생성 스크립트.
 *
 * docs/content/react/<sourcePrefix>/** 페이지를 웹 llms.txt와 동일한 파이프라인
 * (processed markdown + _llms 룰)으로 마크다운화해 packages/<pkg>/docs/ 에 쓰고,
 * index.md 색인을 생성한다. 산출물은 git에 커밋되며 각 package.json `files`의
 * "docs" 항목으로 tarball에 포함된다. 목적: 에이전트가 설치된 패키지 버전과
 * 일치하는 문서를 node_modules에서 바로 읽게 하는 것.
 *
 * `.source/server.ts`(번들러 가상 모듈)는 bun에서 로드할 수 없으므로,
 * 공개 API인 fumadocs-mdx/runtime/dynamic으로 대상 파일만 런타임 컴파일한다.
 */

const DOCS_ROOT = path.resolve(import.meta.dir, "..");
const REPO_ROOT = path.resolve(DOCS_ROOT, "..");
const COLLECTION_DIR = path.join(DOCS_ROOT, "content/react");

interface Target {
  /** react 컬렉션 루트 기준 콘텐츠 경로 프리픽스 */
  sourcePrefix: `${string}/`;
  /** 산출 대상 패키지 디렉토리 (레포 루트 기준) */
  packageDir: string;
  packageName: string;
  /** index.md 헤더에 안내할 온라인(latest) 문서 URL */
  onlineDocsUrl: string;
  /**
   * 필터된 페이지가 이 미만이면 실패. 콘텐츠 개편·프리픽스 오타로 필터가 급감했을 때
   * 커밋된 문서를 대량 삭제한 diff가 조용히 생기는 사고를 막는다.
   */
  minPages: number;
  /** 색인 최상단에 고정할 문서(relPath). 나머지는 알파벳순 */
  pinnedFirst?: string[];
}

/** 콘텐츠 디렉토리 → 대상 패키지 매핑. 문서를 내장할 패키지가 늘면 여기에 등록한다. */
const TARGETS: Target[] = [
  {
    sourcePrefix: "components/",
    packageDir: "packages/react",
    packageName: "@seed-design/react",
    onlineDocsUrl: "https://seed-design.io/react/components",
    minPages: 50,
  },
  {
    sourcePrefix: "stackflow/",
    packageDir: "packages/stackflow",
    packageName: "@seed-design/stackflow",
    onlineDocsUrl: "https://seed-design.io/react/stackflow",
    minPages: 4,
    // Stackflow는 플러그인 셋업이 본체라 색인에서 가장 먼저 안내한다.
    pinnedFirst: ["getting-started.md"],
  },
];

const create = await dynamic(Config, {
  environment: "next",
  configPath: path.join(DOCS_ROOT, "source.config.ts"),
  // core.init이 outDir에 파일을 다시 쓰므로 docs 앱이 쓰는 .source를 지정하면
  // .source/*.ts가 빈 파일로 덮어써진다. dynamic 모드는 outDir 내용을 읽지 않으니
  // 격리된 캐시 경로를 준다.
  outDir: path.join(DOCS_ROOT, "node_modules/.cache/generate-package-docs"),
});

// 정렬로 순회 순서를 고정한다 — 컴파일 순서가 흔들리면 타입 해석 순서도 흔들려
// 커밋되는 산출물에 가짜 diff가 생긴다.
const mdxFiles = TARGETS.flatMap(({ sourcePrefix }) =>
  readdirSync(path.join(COLLECTION_DIR, sourcePrefix), { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(COLLECTION_DIR, sourcePrefix, file))
    .sort(),
);

const entries = mdxFiles.map((fullPath) => ({
  info: { path: path.relative(COLLECTION_DIR, fullPath), fullPath },
  data: matter(readFileSync(fullPath, "utf8")).data,
}));

const collection = await create.docs("reactDocs", COLLECTION_DIR, {}, entries);
const reactSource = loader(collection.toFumadocsSource(), { baseUrl: "/react" });
const allPages = reactSource.getPages();

for (const target of TARGETS) {
  await generate(target);
}

// 미빌드 워크스페이스에서 실행하면 props 타입 추출이 조용히 실패해(빈 TypeTable)
// 빈 문서가 커밋될 수 있다. 대표 산출물 하나로 추출이 실제로 됐는지 검증한다.
const canary = readFileSync(path.join(REPO_ROOT, "packages/react/docs/action-button.md"), "utf8");
if (!canary.includes("- `variant`")) {
  fail(
    "props 타입 추출에 실패했습니다 (action-button.md에 variant prop 없음). `bun packages:build` 후 다시 실행하세요.",
  );
}

async function generate({
  sourcePrefix,
  packageDir,
  packageName,
  onlineDocsUrl,
  minPages,
  pinnedFirst = [],
}: Target) {
  const pages = allPages
    .filter((page) => page.path.startsWith(sourcePrefix))
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")));

  if (pages.length < minPages) {
    fail(
      `${sourcePrefix} 페이지가 ${pages.length}개뿐입니다 (하한 ${minPages}). 콘텐츠가 실제로 줄었다면 minPages를 조정하고, 아니라면 sourcePrefix를 확인하세요.`,
    );
  }

  const outDir = path.join(REPO_ROOT, packageDir, "docs");
  rmSync(outDir, { recursive: true, force: true });

  const entries: IndexEntry[] = [];
  for (const page of pages) {
    // slugs[0]은 sourcePrefix 세그먼트라 제거한다. 라우트 그룹((deprecated) 등)은 slug에 없다.
    const relPath = `${page.slugs.slice(1).join("/")}.md`;
    if (entries.some((entry) => entry.relPath === relPath)) {
      fail(`slug 충돌로 파일이 덮어써집니다: ${relPath}`);
    }

    const filePath = path.join(outDir, relPath);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, await getLLMTextForFullCompilation(page));

    entries.push({
      relPath,
      title: page.data.title,
      description: page.data.description,
      deprecated: page.data.deprecated === true,
    });
  }

  writeFileSync(
    path.join(outDir, "index.md"),
    renderIndex({ packageName, onlineDocsUrl, entries, pinnedFirst }),
  );

  console.log(
    chalk.green(
      `[generate-package-docs] ${packageName}: 문서 ${entries.length}개 → ${packageDir}/docs`,
    ),
  );
}

interface IndexEntry {
  relPath: string;
  title: string;
  description: string | undefined;
  deprecated: boolean;
}

/**
 * 색인 마크다운을 생성한다. 문서 사본이 설치된 버전과 함께 배포된다는 점을 안내하되,
 * 버전 문자열은 박지 않는다(단일 소스는 바로 옆 package.json).
 */
function renderIndex({
  packageName,
  onlineDocsUrl,
  entries,
  pinnedFirst,
}: {
  packageName: string;
  onlineDocsUrl: string;
  entries: IndexEntry[];
  pinnedFirst: string[];
}): string {
  const lines = [
    `# ${packageName} — 문서 색인`,
    "",
    `설치된 ${packageName} 버전과 함께 배포된 문서 사본입니다. 각 문서에는 예제 코드와 props 목록이 인라인되어 있으므로, 해당 파일 하나만 읽으면 됩니다.`,
    "",
    `예제 코드의 \`seed-design/ui/*\` import는 CLI 스니펫(\`npx @seed-design/cli add\`)이 프로젝트에 생성하는 경로입니다. 스니펫 없이 이 패키지를 직접 사용한다면 같은 이름의 컴포넌트를 \`${packageName}\`에서 임포트하세요.`,
    "",
    `최신(latest) 버전 문서: ${onlineDocsUrl}`,
  ];

  const rank = (entry: IndexEntry) => {
    const index = pinnedFirst.indexOf(entry.relPath);
    return index === -1 ? pinnedFirst.length : index;
  };

  const groups = groupEntries(entries);
  for (const [groupName, groupedEntries] of groups) {
    // 그룹이 하나뿐이면(예: stackflow) 헤딩 없이 플랫 리스트로 낸다.
    if (groups.size > 1) lines.push("", `## ${groupName}`, "");
    else lines.push("");

    for (const entry of [...groupedEntries].sort((a, b) => rank(a) - rank(b))) {
      const label = entry.deprecated ? " (Deprecated)" : "";
      const description = entry.description ? ` — ${entry.description}` : "";
      lines.push(`- [${entry.title}](./${entry.relPath})${label}${description}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

/**
 * 색인 섹션 그룹핑: 최상위 문서는 Components, 하위 디렉토리는 디렉토리명, deprecated는 별도 섹션.
 * Components 먼저, 나머지 알파벳 순, Deprecated는 마지막.
 */
function groupEntries(entries: IndexEntry[]): Map<string, IndexEntry[]> {
  const groups = new Map<string, IndexEntry[]>();
  const groupOf = (entry: IndexEntry): string => {
    if (entry.deprecated) return "Deprecated";
    const [first, ...rest] = entry.relPath.split("/");
    if (rest.length === 0 || first === undefined) return "Components";
    return first.charAt(0).toUpperCase() + first.slice(1);
  };

  for (const entry of entries) {
    const group = groupOf(entry);
    groups.set(group, [...(groups.get(group) ?? []), entry]);
  }

  const order = (group: string) => {
    if (group === "Components") return "0";
    if (group === "Deprecated") return `2:${group}`;
    return `1:${group}`;
  };

  return new Map([...groups.entries()].sort(([a], [b]) => order(a).localeCompare(order(b))));
}

function fail(message: string): never {
  console.error(chalk.red(`[generate-package-docs] ${message}`));
  process.exit(1);
}
