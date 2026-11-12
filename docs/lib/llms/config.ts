import { archivePaths } from "@/lib/docs-archive";
import type { Section, SectionConfig } from "./types";

const GITHUB_OWNER = "daangn";
const GITHUB_REPO = "seed-design";
// 브라우저 번들에는 `process`가 없다. 빌드 시점의 ref는 서버 렌더링에서만 읽는다.
const GITHUB_BRANCH =
  (typeof process === "undefined" ? undefined : process.env.SEED_DOCS_SOURCE_REF) ?? "dev";

/**
 * llms 텍스트에 Sanity의 플랫폼 상태 표와 progress board 표를 넣을지 정한다.
 *
 * Next.js 정적 export에서는 이 조회가 항상 실패해 표 없이 배포돼 왔다. Astro에서는 조회가 성공하므로,
 * 배포된 llms 산출물을 그대로 유지하려고 꺼 둔다. 켜면 `llms/components/*.txt`에 표가 추가된다.
 */
export const INCLUDE_SANITY_TABLES = false;

export const sectionConfigs: Record<Section, SectionConfig> = {
  "get-started": {
    contentDir: "get-started",
    baseUrl: "/get-started",
    description: "SEED 시작하기",
  },
  foundations: {
    contentDir: "foundations",
    baseUrl: "/foundations",
    description: "색상, 타이포그래피, 간격 등 디자인 파운데이션",
    excludePaths: ["index.mdx"],
  },
  components: {
    contentDir: "components",
    baseUrl: "/components",
    description: "컴포넌트 디자인 스펙 (Anatomy, Properties, Guidelines)",
    excludePaths: ["index.mdx", "progress-board.mdx"],
  },
  patterns: {
    contentDir: "patterns",
    baseUrl: "/patterns",
    description: "디자인 패턴 및 가이드라인",
    excludePaths: ["index.mdx"],
  },
  react: {
    contentDir: "react",
    baseUrl: "/react",
    description: "React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제",
    excludePaths: ["index.mdx"],
  },
  docs: {
    contentDir: "docs",
    baseUrl: "/docs",
    description: "마이그레이션 등 디자인 참고 문서",
    excludePaths: ["index.mdx"],
  },
  breeze: {
    contentDir: "breeze",
    baseUrl: "/breeze",
    description: "프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트",
    excludePaths: ["index.mdx"],
  },
  lynx: {
    contentDir: "lynx",
    baseUrl: "/lynx",
    description: "Lynx 프레임워크",
    excludePaths: ["index.mdx"],
  },
  "ai-integration": {
    contentDir: "ai-integration",
    baseUrl: "/ai-integration",
    description: "MCP, llms.txt 활용법 등 AI 도구 연동 가이드",
    excludePaths: ["index.mdx"],
  },
  updates: {
    contentDir: "updates",
    baseUrl: "/updates",
    description: "SEED 업데이트 소식과 릴리즈 노트",
  },
};

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
  if (slugs.length === 0) return archivePaths.link(`${config.baseUrl}/llms.txt`);
  const slugsWithExt = slugs.map((s, i) => (i === slugs.length - 1 ? `${s}.txt` : s));
  return archivePaths.endpoint(`/llms/${section}/${slugsWithExt.join("/")}`);
}

export function shouldIncludeInFullText(section: Section, pagePath: string): boolean {
  const config = sectionConfigs[section];
  const excludePaths = config.excludePaths ?? [];
  return !excludePaths.includes(pagePath);
}
