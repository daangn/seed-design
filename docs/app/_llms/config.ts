const GITHUB_OWNER = "daangn";
const GITHUB_REPO = "seed-design";
const GITHUB_BRANCH = "dev";

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  /** 루트 llms.txt 표와 CLI 인덱스의 카테고리 라벨 */
  label: string;
  description: string;
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
  },
  foundations: {
    contentDir: "foundations",
    baseUrl: "/foundations",
    label: "Foundations",
    description: "색상, 타이포그래피, 간격 등 디자인 파운데이션",
  },
  components: {
    contentDir: "components",
    baseUrl: "/components",
    label: "Components",
    description: "컴포넌트 디자인 스펙 (Anatomy, Properties, Guidelines)",
  },
  patterns: {
    contentDir: "patterns",
    baseUrl: "/patterns",
    label: "Patterns",
    description: "디자인 패턴 및 가이드라인",
  },
  docs: {
    contentDir: "docs",
    baseUrl: "/docs",
    label: "Design Guidelines",
    description: "마이그레이션 등 디자인 참고 문서",
  },
  react: {
    contentDir: "react",
    baseUrl: "/react",
    label: "React",
    description: "React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제",
  },
  breeze: {
    contentDir: "breeze",
    baseUrl: "/breeze",
    label: "Breeze",
    description: "프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트",
  },
  lynx: {
    contentDir: "lynx",
    baseUrl: "/lynx",
    label: "Lynx",
    description: "Lynx 프레임워크",
  },
  "ai-integration": {
    contentDir: "ai-integration",
    baseUrl: "/ai-integration",
    label: "AI Integration",
    description: "MCP, llms.txt 활용법 등 AI 도구 연동 가이드",
  },
  updates: {
    contentDir: "updates",
    baseUrl: "/updates",
    label: "Updates",
    description: "SEED 업데이트 소식과 릴리즈 노트",
    // 섹션 인덱스 mdx가 없다 — 랜딩은 app/updates/page.tsx가 그린다.
  },
} satisfies Record<string, SectionConfig>;

export type Section = keyof typeof sectionConfigs;

export const sections = Object.keys(sectionConfigs) as Section[];

export function getGitHubSourceUrl(section: Section, pagePath: string): string {
  const config = sectionConfigs[section];
  const encodedPagePath = pagePath.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/docs/content/${config.contentDir}/${encodedPagePath}`;
}

/** 섹션 루트 index.mdx가 사이트에서 갖는 URL. slug가 없어 baseUrl 자체가 된다. */
export function getDocUrl(section: Section, slugs: string[]): string {
  const { baseUrl } = sectionConfigs[section];
  return slugs.length === 0 ? baseUrl : `${baseUrl}/${slugs.join("/")}`;
}

/**
 * 문서 URL 앞에 `/llms`를 붙이고 뒤에 `.txt`를 붙인다. 그것이 규칙의 전부라, 어느 문서든
 * 사이트 주소만 알면 llms 주소가 나온다. 섹션 루트 index.mdx도 예외가 아니다 — 그 문서의
 * URL이 `/react`이므로 `/llms/react.txt`가 된다.
 *
 * @example /components/button -> /llms/components/button.txt
 * @example /react (섹션 루트 index.mdx) -> /llms/react.txt
 */
export function getLLMMarkdownUrl(section: Section, slugs: string[]): string {
  return `/llms${getDocUrl(section, slugs)}.txt`;
}
