const GITHUB_OWNER = "daangn";
const GITHUB_REPO = "seed-design";
const GITHUB_BRANCH = "dev";

/**
 * CLI 문서 인덱스(`public/__docs__/index.json`)에서 한 섹션의 페이지들을 어떻게 묶을지.
 *
 * 콘텐츠 구조에서 추론하지 않고 선언한다. `slugs[0]`을 일괄 적용하면 평면 섹션이
 * 페이지마다 단일 항목 섹션으로 쪼개지고(components는 58개가 전부 1레벨),
 * 반대로 고정 라벨을 쓰면 lynx의 components/foundation/getting-started/hooks가
 * 한 덩어리로 뭉개진다.
 */
type SectionGrouping =
  /**
   * 전부 한 섹션에 담는다. `id`는 CLI 경로에 쓰이므로(`breeze/components/animate-number`)
   * 카테고리 id를 그대로 반복하기보다 내용에 맞는 이름을 준다.
   */
  | { kind: "flat"; id: string; label: string }
  /** `slugs[0]`으로 묶는다. `labels`에 없는 키는 slug를 그대로 라벨로 쓴다. */
  | { kind: "byFirstSlug"; labels: Record<string, string> };

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  /** 루트 llms.txt 표와 CLI 인덱스의 카테고리 라벨 */
  label: string;
  description: string;
  /** llms-full.txt와 CLI 인덱스에서 제외할 콘텐츠 상대 경로. 없으면 빈 배열. */
  excludePaths: string[];
  /** `/{section}/llms-full.txt` 라우트 보유 여부 */
  fullText: boolean;
  grouping: SectionGrouping;
  /**
   * CLI 인덱스 항목에 스니펫 링크를 붙일 때 조회할 `public/__registry__` 레지스트리.
   * 앞에서부터 항목 id로 찾고 처음 맞는 것을 쓴다. 스니펫이 없는 섹션은 빈 배열.
   */
  snippetRegistries: `${string}/${string}`[];
}

/**
 * 섹션 하나를 추가할 때 손으로 고치는 유일한 곳.
 *
 * 선언 순서가 루트 llms.txt 표와 CLI 인덱스의 카테고리 순서다.
 *
 * fumadocs 소스를 여기서 import하면 안 된다. `scripts/generate-docs-index.ts`가
 * Next 밖에서 이 파일을 읽는데, `.source/server.ts`는 번들러 전용 쿼리스트링
 * import(`?collection=...&only=frontmatter`)를 쓰므로 스크립트에서 해석되지 않는다.
 * 섹션 ↔ 소스 짝은 `sources.ts`가 들고 있다.
 */
export const sectionConfigs = {
  "get-started": {
    contentDir: "get-started",
    baseUrl: "/get-started",
    label: "Get Started",
    description: "SEED 시작하기",
    excludePaths: [],
    fullText: false,
    grouping: { kind: "flat", id: "get-started", label: "시작하기" },
    snippetRegistries: [],
  },
  foundations: {
    contentDir: "foundations",
    baseUrl: "/foundations",
    label: "Foundations",
    description: "색상, 타이포그래피, 간격 등 디자인 파운데이션",
    excludePaths: ["index.mdx"],
    fullText: false,
    // color/*, design-token/*, iconography/*는 중첩이지만 나머지는 평면이라
    // byFirstSlug로 묶으면 대부분이 단일 항목 섹션이 된다.
    grouping: { kind: "flat", id: "foundations", label: "파운데이션" },
    snippetRegistries: [],
  },
  components: {
    contentDir: "components",
    baseUrl: "/components",
    label: "Components",
    description: "컴포넌트 디자인 스펙 (Anatomy, Properties, Guidelines)",
    excludePaths: ["index.mdx", "progress-board.mdx"],
    fullText: false,
    grouping: { kind: "flat", id: "components", label: "컴포넌트" },
    snippetRegistries: ["react/ui", "react/breeze"],
  },
  patterns: {
    contentDir: "patterns",
    baseUrl: "/patterns",
    label: "Patterns",
    description: "디자인 패턴 및 가이드라인",
    excludePaths: ["index.mdx"],
    fullText: false,
    grouping: { kind: "flat", id: "patterns", label: "패턴" },
    snippetRegistries: [],
  },
  docs: {
    contentDir: "docs",
    baseUrl: "/docs",
    label: "Design Guidelines",
    description: "마이그레이션 등 디자인 참고 문서",
    excludePaths: ["index.mdx"],
    fullText: true,
    grouping: { kind: "byFirstSlug", labels: { migration: "마이그레이션" } },
    snippetRegistries: ["react/ui", "react/breeze"],
  },
  react: {
    contentDir: "react",
    baseUrl: "/react",
    label: "React",
    description: "React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제",
    excludePaths: ["index.mdx"],
    fullText: true,
    grouping: {
      kind: "byFirstSlug",
      labels: {
        "getting-started": "시작하기",
        components: "컴포넌트",
        blocks: "블록",
        stackflow: "Stackflow",
        "developer-tools": "개발자 도구",
        migration: "마이그레이션",
        updates: "업데이트",
      },
    },
    snippetRegistries: ["react/ui", "react/breeze"],
  },
  breeze: {
    contentDir: "breeze",
    baseUrl: "/breeze",
    label: "Breeze",
    description: "프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트",
    excludePaths: ["index.mdx"],
    fullText: true,
    grouping: { kind: "flat", id: "components", label: "컴포넌트" },
    snippetRegistries: ["react/breeze"],
  },
  lynx: {
    contentDir: "lynx",
    baseUrl: "/lynx",
    label: "Lynx",
    description: "Lynx 프레임워크",
    excludePaths: ["index.mdx"],
    fullText: true,
    grouping: {
      kind: "byFirstSlug",
      labels: {
        "getting-started": "시작하기",
        components: "컴포넌트",
        foundation: "파운데이션",
        hooks: "훅",
      },
    },
    snippetRegistries: ["lynx/ui"],
  },
  "ai-integration": {
    contentDir: "ai-integration",
    baseUrl: "/ai-integration",
    label: "AI Integration",
    description: "MCP, llms.txt 활용법 등 AI 도구 연동 가이드",
    excludePaths: ["index.mdx"],
    fullText: true,
    // skill.mdx + (mcp)/ 2장뿐이라 byFirstSlug면 단일 항목 섹션 3개가 된다.
    grouping: { kind: "flat", id: "guides", label: "가이드" },
    snippetRegistries: [],
  },
  updates: {
    contentDir: "updates",
    baseUrl: "/updates",
    label: "Updates",
    description: "SEED 업데이트 소식과 릴리즈 노트",
    // 섹션 인덱스 mdx가 없다 — 랜딩은 app/updates/page.tsx가 그린다.
    excludePaths: [],
    fullText: false,
    grouping: { kind: "flat", id: "updates", label: "업데이트" },
    snippetRegistries: [],
  },
} satisfies Record<string, SectionConfig>;

export type Section = keyof typeof sectionConfigs;

export const sections = Object.keys(sectionConfigs) as Section[];

export function getGitHubSourceUrl(section: Section, pagePath: string): string {
  const config = sectionConfigs[section];
  const encodedPagePath = pagePath.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/docs/content/${config.contentDir}/${encodedPagePath}`;
}

/**
 * @description section 과 slugs 를 받아서 llms.txt 파일의 경로를 반환합니다.
 * @example /docs -> /docs/llms.txt
 * @example /components/button -> /llms/components/button.txt
 */
export function getLLMMarkdownUrl(section: Section, slugs: string[]): string {
  const config = sectionConfigs[section];
  if (slugs.length === 0) return `${config.baseUrl}/llms.txt`;
  const slugsWithExt = slugs.map((s, i) => (i === slugs.length - 1 ? `${s}.txt` : s));
  return `/llms/${section}/${slugsWithExt.join("/")}`;
}

export function shouldIncludeInFullText(section: Section, pagePath: string): boolean {
  const excludePaths: string[] = sectionConfigs[section].excludePaths;
  return !excludePaths.includes(pagePath);
}
