import type { Section, SectionConfig } from "./types";

const GITHUB_OWNER = "daangn";
const GITHUB_REPO = "seed-design";
const GITHUB_BRANCH = "dev";

export const sectionConfigs: Record<Section, SectionConfig> = {
  react: {
    contentDir: "react",
    baseUrl: "/react",
    description: "React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제",
    excludePaths: ["index.mdx"],
  },
  docs: {
    contentDir: "docs",
    baseUrl: "/docs",
    description: "컴포넌트 디자인 가이드라인, Foundation (색상, 타이포그래피, 간격 등)",
    excludePaths: ["index.mdx", "progress-board.mdx"],
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
};

export function getGitHubSourceUrl(section: Section, pagePath: string): string {
  const config = sectionConfigs[section];
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/docs/content/${config.contentDir}/${pagePath}`;
}

export function shouldIncludeInFullText(section: Section, pagePath: string): boolean {
  const config = sectionConfigs[section];
  const excludePaths = config.excludePaths ?? [];
  return !excludePaths.includes(pagePath);
}
