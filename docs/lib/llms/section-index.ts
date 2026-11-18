import { archivePaths } from "@/lib/docs-archive";
import { baseUrl } from "@/lib/metadata";
import { getLLMMarkdownUrl, sectionConfigs, shouldIncludeInFullText } from "./config";
import { getLLMText } from "./get-llm-text";
import type { LLMPage, Section } from "./types";
import { getDisplayTitle, sortCategories } from "./utils";

/**
 * `/<section>/llms.txt` 본문. 섹션마다 문구와 목록 모양이 다르다(Next `app/<section>/llms.txt/route.ts`를 옮겼다).
 * 입력은 그 섹션의 모든 페이지(인덱스 포함)다. route는 `src/pages/[section]/llms.txt.ts` 하나다.
 */
export const sectionLlmsIndex: Record<Section, (pages: LLMPage[]) => Promise<string> | string> = {
  // 다른 섹션의 llms.txt는 하위 문서 목록이지만 get-started는 index.mdx 한 장이 전부다.
  // 자기 자신만 담긴 목록을 내보내봐야 쓸모가 없어서 본문을 그대로 내보낸다.
  // (`/llms/get-started/*`가 없는 것도 같은 이유 — 하위 문서가 없다.)
  "get-started": async (pages) => {
    const page = pages.find((item) => item.slugs.length === 0);
    if (!page) throw new Error("get-started 섹션의 index 문서를 찾을 수 없습니다.");
    return getLLMText(page, "get-started");
  },

  foundations: (allPages) => {
    // 섹션 인덱스는 sectionConfigs.excludePaths가 이미 걸러준다.
    const pages = allPages.filter((page) => shouldIncludeInFullText("foundations", page.path));

    // color/iconography/design-token 탭 그룹의 index는 모두 title이 "Overview"라
    // 그대로 나열하면 구분이 안 된다. getDisplayTitle이 slug로 꼬리표를 붙여준다.
    // 정렬은 title이 아니라 slug 기준 — 그래야 탭 그룹의 하위 문서가 부모 옆에 붙는다.
    const pageList = pages
      .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
      .map((page) => {
        const displayTitle = getDisplayTitle(page, pages);
        const llmsUrl = new URL(getLLMMarkdownUrl("foundations", page.slugs), baseUrl);
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${displayTitle}](${llmsUrl})${description}`;
      })
      .join("\n");

    return `# SEED Foundations - LLM Reference

${sectionConfigs.foundations.description}

## Documents

${pageList}

## Related Sections

- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
`;
  },

  components: (allPages) => {
    // 섹션 인덱스와 progress-board는 sectionConfigs.excludePaths가 이미 걸러준다.
    // `(deprecated)`는 라우트 그룹이라 slug에 안 들어간다 — frontmatter로만 구분된다.
    const pages = allPages.filter((page) => shouldIncludeInFullText("components", page.path));

    const pageList = pages
      .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
      .map((page) => {
        const displayTitle = getDisplayTitle(page, pages);
        const llmsUrl = new URL(getLLMMarkdownUrl("components", page.slugs), baseUrl);
        const deprecatedLabel = page.data.deprecated ? " (Deprecated)" : "";
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${displayTitle}](${llmsUrl})${deprecatedLabel}${description}`;
      })
      .join("\n");

    return `# SEED Components - LLM Reference

${sectionConfigs.components.description}

## Components

${pageList}

## Related Sections

- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 구현 및 API 레퍼런스
`;
  },

  patterns: (allPages) => {
    // 섹션 인덱스는 sectionConfigs.excludePaths가 이미 걸러준다.
    const pages = allPages.filter((page) => shouldIncludeInFullText("patterns", page.path));

    const pageList = pages
      .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
      .map((page) => {
        const displayTitle = getDisplayTitle(page, pages);
        const llmsUrl = new URL(getLLMMarkdownUrl("patterns", page.slugs), baseUrl);
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${displayTitle}](${llmsUrl})${description}`;
      })
      .join("\n");

    return `# SEED Patterns - LLM Reference

${sectionConfigs.patterns.description}

## Documents

${pageList}

## Related Sections

- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
`;
  },

  // IA 개편으로 foundation/components/guidelines/resources는 각자 최상위 섹션으로 빠져나갔고
  // (`/foundations`, `/components`, `/patterns`) `/docs`에는 migration만 남았다.
  docs: (pages) =>
    `# SEED Guidelines - LLM Reference

마이그레이션 등 디자인 참고 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/docs/llms-full.txt", baseUrl)}): 모든 참고 문서를 하나의 파일로

## Categories

${categoryList(pages, {
  order: ["migration"],
  descriptions: { migration: "마이그레이션 가이드" },
  url: (slugs) => new URL(`/llms/docs/${txtSlugs(slugs)}`, baseUrl),
})}

## Related Sections

- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
`,

  react: (pages) =>
    `# SEED React - LLM Reference

React 컴포넌트 라이브러리 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL(archivePaths.link("/react/llms-full.txt"), baseUrl)}): 모든 React 문서를 하나의 파일로

## Categories

${categoryList(pages, {
  order: [
    "getting-started",
    "components",
    "stackflow",
    "developer-tools",
    "patterns",
    "migration",
    "updates",
  ],
  descriptions: {
    components: "React 컴포넌트 API 및 사용법",
    "getting-started": "설치 및 시작 가이드",
    stackflow: "Stackflow 네이티브 네비게이션 연동",
    "developer-tools": "Codemods, Figma 연동 등 개발 도구",
    migration: "버전 마이그레이션 가이드",
    updates: "업데이트 및 변경사항",
    patterns: "사용 패턴 및 모범 사례",
  },
  url: (slugs) => new URL(archivePaths.endpoint(`/llms/react/${txtSlugs(slugs)}`), baseUrl),
})}
`,

  breeze: (allPages) => {
    const pageList = allPages
      .filter((page) => page.slugs.length > 0)
      .map((page) => {
        const llmsUrl = new URL(`/llms/breeze/${txtSlugs(page.slugs)}`, baseUrl);
        return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
      })
      .sort()
      .join("\n");

    return `# SEED Breeze - LLM Reference

프로젝트에 바로 사용할 수 있는 유틸리티 UI 컴포넌트입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/breeze/llms-full.txt", baseUrl)}): 모든 Breeze 문서를 하나의 파일로

## Components

${pageList}

## Related Sections

- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Design Guidelines](${new URL("/docs/llms.txt", baseUrl)}): 디자인 가이드라인
`;
  },

  lynx: (allPages) => {
    const pageList = allPages
      .filter((page) => page.slugs.length > 0)
      .map((page) => {
        const llmsUrl = new URL(
          archivePaths.endpoint(`/llms/lynx/${txtSlugs(page.slugs)}`),
          baseUrl,
        );
        return `- [${page.data.title}](${llmsUrl}): ${page.data.description ?? ""}`;
      })
      .sort()
      .join("\n");

    return `# SEED Lynx - LLM Reference

Lynx 프레임워크 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL(archivePaths.link("/lynx/llms-full.txt"), baseUrl)}): 모든 Lynx 문서를 하나의 파일로

## Documents

${pageList}

## Related Sections

- [React Library](${new URL(archivePaths.link("/react/llms.txt"), baseUrl)}): React 컴포넌트 라이브러리
- [AI Integration](${new URL(archivePaths.link("/ai-integration/llms.txt"), baseUrl)}): AI 도구 연동 가이드
`;
  },

  "ai-integration": (pages) =>
    `# SEED AI Integration - LLM Reference

AI 도구 연동 가이드 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/ai-integration/llms-full.txt", baseUrl)}): 모든 AI Integration 문서를 하나의 파일로

## Categories

${categoryList(pages, {
  order: ["docs-mcp", "figma-mcp", "cli"],
  descriptions: {
    "docs-mcp": "SEED MCP 서버 연동",
    "figma-mcp": "Figma MCP 서버 연동",
    cli: "CLI 스킬 및 도구",
  },
  url: (slugs) => new URL(`/llms/ai-integration/${txtSlugs(slugs)}`, baseUrl),
  // 이 섹션만 제목을 그대로 쓰고 줄 전체로 정렬하며 deprecated 표시를 붙이지 않았다.
  plainTitles: true,
})}
`,

  updates: (allPages) => {
    // updates는 섹션 인덱스 mdx가 없어 excludePaths도 비어있다(목록은 `/updates`).
    const pages = allPages.filter((page) => shouldIncludeInFullText("updates", page.path));

    // 글 목록이라 slug 알파벳순은 의미가 없다. 발행일 최신순으로 세운다.
    const pageList = pages
      .sort((a, b) => publishedTime(b) - publishedTime(a))
      .map((page) => {
        const displayTitle = getDisplayTitle(page, pages);
        const llmsUrl = new URL(getLLMMarkdownUrl("updates", page.slugs), baseUrl);
        const description = page.data.description ? `: ${page.data.description}` : "";
        return `- [${displayTitle}](${llmsUrl})${description}`;
      })
      .join("\n");

    return `# SEED Updates - LLM Reference

${sectionConfigs.updates.description}

## Posts

${pageList}

## Related Sections

- [React Changelog](${new URL("/llms/react/updates/changelog.txt", baseUrl)}): React 패키지별/버전별 변경 이력
- [Lynx Changelog](${new URL("/llms/lynx/updates/changelog.txt", baseUrl)}): Lynx 패키지별/버전별 변경 이력
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 라이브러리
- [Lynx Library](${new URL("/lynx/llms.txt", baseUrl)}): Lynx 컴포넌트 라이브러리
`;
  },
};

/** `/llms.txt`. 섹션 진입점 표. */
export function rootLlmsIndex(): string {
  return `# SEED Design System - Documentation for LLMs

SEED는 당근의 디자인 시스템입니다.

## Documentation Sections

| 섹션 | 진입점 | 전체 문서 | 설명 |
|------|--------|-----------|------|
| Get Started | [llms.txt](${new URL("/get-started/llms.txt", baseUrl)}) | - | SEED가 무엇이고 어디서부터 보면 되는지 (본문 1장) |
| Foundations | [llms.txt](${new URL("/foundations/llms.txt", baseUrl)}) | - | 색상, 타이포그래피, 간격 등 디자인 파운데이션 |
| Components | [llms.txt](${new URL("/components/llms.txt", baseUrl)}) | - | 컴포넌트 디자인 스펙 (Anatomy, Properties, Guidelines) |
| Patterns | [llms.txt](${new URL("/patterns/llms.txt", baseUrl)}) | - | 디자인 패턴 및 가이드라인 |
| Design Guidelines | [llms.txt](${new URL("/docs/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/docs/llms-full.txt", baseUrl)}) | 마이그레이션 등 디자인 참고 문서 |
| React Library | [llms.txt](${new URL("/react/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/react/llms-full.txt", baseUrl)}) | React 컴포넌트 라이브러리, API 레퍼런스 |
| Breeze Utilities | [llms.txt](${new URL("/breeze/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/breeze/llms-full.txt", baseUrl)}) | 유틸리티 UI 컴포넌트 |
| Lynx | [llms.txt](${new URL("/lynx/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/lynx/llms-full.txt", baseUrl)}) | Lynx 프레임워크 |
| AI Integration | [llms.txt](${new URL("/ai-integration/llms.txt", baseUrl)}) | [llms-full.txt](${new URL("/ai-integration/llms-full.txt", baseUrl)}) | AI 도구 연동 가이드 |
| Updates | [llms.txt](${new URL("/updates/llms.txt", baseUrl)}) | - | SEED 업데이트 소식과 릴리즈 노트 |
| React Changelog | [llms.txt](${new URL("/llms/react/updates/changelog.txt", baseUrl)}) | - | React 패키지별/버전별 변경 이력 |
| Lynx Changelog | [llms.txt](${new URL("/llms/lynx/updates/changelog.txt", baseUrl)}) | - | Lynx 패키지별/버전별 변경 이력 |
`;
}

/** 마지막 slug에 `.txt`를 붙인 경로. */
function txtSlugs(slugs: string[]): string {
  return slugs.map((s, i) => (i === slugs.length - 1 ? `${s}.txt` : s)).join("/");
}

/** 정렬 전용. publishedAt은 frontmatter 파싱에 따라 문자열/Date 양쪽으로 온다. */
function publishedTime(page: LLMPage): number {
  return page.data.publishedAt ? new Date(page.data.publishedAt).getTime() : 0;
}

/** 첫 slug로 묶은 `### <category>` 목록(docs·react·ai-integration). */
function categoryList(
  pages: LLMPage[],
  options: {
    order: string[];
    descriptions: Record<string, string>;
    url: (slugs: string[]) => URL;
    plainTitles?: boolean;
  },
): string {
  const categories = new Map<string, LLMPage[]>();
  for (const page of pages) {
    if (page.slugs.length === 0) continue;
    const category = page.slugs[0];
    if (!categories.has(category)) categories.set(category, []);
    categories.get(category)?.push(page);
  }

  return sortCategories(categories, options.order)
    .map(([category, categoryPages]) => {
      const description = options.descriptions[category] ?? "";
      const lines = categoryPages.map((page) => {
        const llmsUrl = options.url(page.slugs);
        if (options.plainTitles) {
          const line = `- [${page.data.title}](${llmsUrl})`;
          return { displayTitle: line, line };
        }
        const displayTitle = getDisplayTitle(page, categoryPages);
        const deprecatedLabel = page.data.deprecated ? " (Deprecated)" : "";
        return { displayTitle, line: `- [${displayTitle}](${llmsUrl})${deprecatedLabel}` };
      });
      const pageList = options.plainTitles
        ? lines
            .map((x) => x.line)
            .sort()
            .join("\n")
        : lines
            .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle))
            .map((x) => x.line)
            .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");
}
