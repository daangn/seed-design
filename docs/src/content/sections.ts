/**
 * 문서 섹션의 유일한 목록.
 *
 * 여기서 파생하는 것: content collection(`src/content.config.ts`), fumadocs collection 설정
 * (`astro.config.ts`), 문서 route의 getStaticPaths(`src/pages/[...slug].astro`), llms route,
 * 검색 태그, 섹션 라벨. 섹션을 추가·삭제할 때 이 파일만 고친다
 * (+ `packages/docs-mcp/src/config.ts`는 기존 규칙대로 별도).
 *
 * `astro.config.ts`가 Vite alias 없이 import하므로 이 파일은 상대 경로 import만 쓴다.
 */
import { archivePaths } from "../../lib/docs-archive";

export type SectionId =
  | "docs"
  | "get-started"
  | "foundations"
  | "components"
  | "patterns"
  | "react"
  | "breeze"
  | "lynx"
  | "ai-integration"
  | "updates";

export interface SectionConfig {
  id: SectionId;
  /** 사람이 읽는 섹션 이름. 섹션 라벨·모바일 패널 제목·검색 태그 라벨. */
  label: string;
  /** content collection 디렉터리(docs 기준). */
  contentDir: `content/${string}`;
  /** `<contentDir>/**\/meta.json`이 있으면 true. 없는 섹션은 meta collection을 만들지 않는다(빈 collection 경고). */
  hasMeta: boolean;
  /** fumadocs loader baseUrl. archive 채널이면 `archivePaths`가 접두사를 붙인다. */
  baseUrl: string;
  /**
   * - `sidebar`: 사이드바·TOC가 있는 문서 셸.
   * - `no-sidebar`: 사이드바 없는 문서 셸(get-started).
   * - `custom`: 섹션 route가 따로 있다(updates). 단일 문서 route는 건너뛴다.
   */
  layout: "sidebar" | "no-sidebar" | "custom";
  /** React·Lynx 섹션만. 사이드바 상단 버전 전환기와 archive 채널 판정에 쓴다. */
  platform?: "react" | "lynx";
  /**
   * `/api/search.json` 색인의 `tag`. 헤더 섹션은 검색 필터 칩(`lib/search-tags.ts`)과 같은 값이고, 칩이 없는 섹션
   * (docs·get-started·breeze)은 "All"에서만 보인다. docs는 기존 색인과 같은 `design`이다.
   */
  searchTag: string;
  /** `/llms/<id>/**.txt`, `/<id>/llms.txt`를 만든다. */
  llms: boolean;
}

export const SECTIONS: readonly SectionConfig[] = [
  {
    id: "docs",
    label: "Docs",
    contentDir: "content/docs",
    hasMeta: true,
    baseUrl: "/docs",
    layout: "sidebar",
    searchTag: "design",
    llms: true,
  },
  {
    id: "get-started",
    label: "Get Started",
    contentDir: "content/get-started",
    hasMeta: false,
    baseUrl: "/get-started",
    layout: "no-sidebar",
    searchTag: "get-started",
    llms: true,
  },
  {
    id: "foundations",
    label: "Foundations",
    contentDir: "content/foundations",
    hasMeta: true,
    baseUrl: "/foundations",
    layout: "sidebar",
    searchTag: "foundations",
    llms: true,
  },
  {
    id: "components",
    label: "Components",
    contentDir: "content/components",
    hasMeta: true,
    baseUrl: "/components",
    layout: "sidebar",
    searchTag: "components",
    llms: true,
  },
  {
    id: "patterns",
    label: "Patterns",
    contentDir: "content/patterns",
    hasMeta: true,
    baseUrl: "/patterns",
    layout: "sidebar",
    searchTag: "patterns",
    llms: true,
  },
  {
    id: "react",
    label: "React",
    contentDir: "content/react",
    hasMeta: true,
    baseUrl: archivePaths.routes("react").base,
    layout: "sidebar",
    platform: "react",
    searchTag: "react",
    llms: true,
  },
  {
    id: "breeze",
    label: "Breeze",
    contentDir: "content/breeze",
    hasMeta: true,
    baseUrl: "/breeze",
    layout: "sidebar",
    searchTag: "breeze",
    llms: true,
  },
  {
    id: "lynx",
    label: "Lynx",
    contentDir: "content/lynx",
    hasMeta: true,
    baseUrl: archivePaths.routes("lynx").base,
    layout: "sidebar",
    platform: "lynx",
    searchTag: "lynx",
    llms: true,
  },
  {
    id: "ai-integration",
    label: "AI & Tools",
    contentDir: "content/ai-integration",
    hasMeta: true,
    baseUrl: "/ai-integration",
    layout: "sidebar",
    searchTag: "ai-integration",
    llms: true,
  },
  {
    id: "updates",
    label: "Updates",
    contentDir: "content/updates",
    hasMeta: false,
    baseUrl: "/updates",
    layout: "custom",
    searchTag: "updates",
    llms: true,
  },
];

/**
 * 이번 빌드에 포함할 섹션. archive 채널 빌드(`NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL`)는 해당 플랫폼만 남긴다.
 * 섹션 필터 규칙은 여기 하나뿐이다.
 */
export function sectionsForBuild(): readonly SectionConfig[] {
  const platform = archivePaths.platform;
  return platform ? SECTIONS.filter((section) => section.platform === platform) : SECTIONS;
}

export function getSectionConfig(id: SectionId): SectionConfig {
  const section = SECTIONS.find((item) => item.id === id);
  if (!section) throw new Error(`Unknown docs section: ${id}`);
  return section;
}
