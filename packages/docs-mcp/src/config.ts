/**
 * SEED Design Documentation Configuration
 *
 * 이 파일은 docs-mcp의 단일 진실의 원천(Single Source of Truth)입니다.
 * 새 섹션이나 카테고리를 추가할 때 이 파일만 수정하면 됩니다.
 */

export type SectionId = "react" | "docs" | "breeze" | "ai-integration" | "lynx";

export interface SectionConfig {
  /** 섹션 표시 이름 */
  name: string;
  /** 섹션 설명 */
  description: string;
  /** LLM 문서 기본 경로 (예: /llms/react) */
  basePath: string;
  /** 섹션 개요 경로 (예: /react/llms.txt) */
  overviewPath: string;
  /** 전체 문서 경로 (예: /react/llms-full.txt) */
  fullPath: string;
  /** 카테고리 맵 (카테고리 ID → 설명) */
  categories: Record<string, string>;
}

export const SECTIONS: Record<SectionId, SectionConfig> = {
  react: {
    name: "React",
    description: "React 컴포넌트 라이브러리, API 레퍼런스, 사용 예제",
    basePath: "/llms/react",
    overviewPath: "/react/llms.txt",
    fullPath: "/react/llms-full.txt",
    categories: {
      components: "React 컴포넌트 API 및 사용법",
      "getting-started": "설치 및 시작 가이드",
      stackflow: "Stackflow 네비게이션 연동",
      "developer-tools": "Codemods, Figma 연동 등 개발 도구",
      migration: "버전 마이그레이션 가이드",
      updates: "업데이트 및 변경사항 (changelog 포함)",
      patterns: "사용 패턴 및 모범 사례",
    },
  },
  docs: {
    name: "Design Guidelines",
    description: "컴포넌트 디자인 가이드라인, Foundation (색상, 타이포그래피, 간격 등)",
    basePath: "/llms/docs",
    overviewPath: "/docs/llms.txt",
    fullPath: "/docs/llms-full.txt",
    categories: {
      components: "컴포넌트 디자인 가이드라인",
      foundation: "색상, 타이포그래피, 간격 등 기초 토큰",
      guidelines: "디자인 원칙 및 가이드라인",
    },
  },
  breeze: {
    name: "Breeze",
    description: "프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트",
    basePath: "/llms/breeze",
    overviewPath: "/breeze/llms.txt",
    fullPath: "/breeze/llms-full.txt",
    categories: {
      components: "Breeze 유틸리티 컴포넌트",
    },
  },
  "ai-integration": {
    name: "AI Integration",
    description: "MCP, llms.txt 활용법 등 AI 도구 연동 가이드",
    basePath: "/llms/ai-integration",
    overviewPath: "/ai-integration/llms.txt",
    fullPath: "/ai-integration/llms-full.txt",
    categories: {},
  },
  lynx: {
    name: "Lynx",
    description: "Lynx 프레임워크",
    basePath: "/llms/lynx",
    overviewPath: "/lynx/llms.txt",
    fullPath: "/lynx/llms-full.txt",
    categories: {},
  },
};

/**
 * 섹션 ID 목록
 */
export const SECTION_IDS = Object.keys(SECTIONS) as SectionId[];

/**
 * 섹션 ID가 유효한지 확인
 */
export function isValidSection(section: string): section is SectionId {
  return section in SECTIONS;
}

/**
 * 섹션의 카테고리가 유효한지 확인
 */
export function isValidCategory(section: SectionId, category: string): boolean {
  const config = SECTIONS[section];
  const hasNoCategories = Object.keys(config.categories).length === 0;
  if (hasNoCategories) {
    return true;
  }
  return category in config.categories;
}
