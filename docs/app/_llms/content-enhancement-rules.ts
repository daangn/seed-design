import type { LLMPage, Section } from "./types";

// Content Enhancement Rules
export type ContentEnhancementRule = {
  name: string;
  shouldApply: (page: LLMPage, section: Section) => boolean;
  enhance: (content: string, page: LLMPage) => Promise<string>;
};

/*
  Rootage data 를 가져옵니다.
*/
async function fetchRootageData(paths: string[]): Promise<string> {
  const results: string[] = [];

  for (const path of paths) {
    try {
      const response = await fetch(`https://seed-design.io/rootage/${path}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
      }
      const data = await response.json();
      results.push(`### ${path}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``);
    } catch {
      results.push(`### ${path}\n\n(데이터를 불러올 수 없습니다)`);
    }
  }

  return results.join("\n\n");
}

/*
  Mapping of pages to their rootage paths. 
  NOTE: llm.txt 에서 TokenReference 컴포넌트를 사용하는 페이지에서 rootage data 가 나타나도록 합니다.
*/
const ROOTAGE_MAPPING: Record<string, string[]> = {
  "foundation/design-token-reference": [
    "color.json",
    "dimension.json",
    "font-size.json",
    "font-weight.json",
    "line-height.json",
    "radius.json",
    "shadow.json",
    "gradient.json",
    "duration.json",
    "timing-function.json",
  ],
  "foundation/spacing": ["dimension.json"],
  "foundation/radius": ["radius.json"],
  "foundation/color/palette": ["color.json"],
  "foundation/color/color-role": ["color.json"],
  "foundation/elevation": ["shadow.json"],
  "foundation/gradient": ["gradient.json"],
  "foundation/typography/overview": ["font-size.json", "font-weight.json", "line-height.json"],
  "foundation/motion": ["duration.json", "timing-function.json"],
};

const rootageEnhancementRule: ContentEnhancementRule = {
  name: "rootage-data",
  shouldApply: (page, section) => {
    if (section !== "docs") return false;
    const pagePath = page.path.replace(/\.mdx?$/, "");
    return pagePath in ROOTAGE_MAPPING;
  },
  enhance: async (content, page) => {
    const pagePath = page.path.replace(/\.mdx?$/, "");
    const rootagePaths = ROOTAGE_MAPPING[pagePath];

    console.log("[rootageEnhancementRule] Fetching rootage data for", rootagePaths.length, "paths");
    const rootageData = await fetchRootageData(rootagePaths);

    return `${content}

---

## Rootage Token Specifications

아래는 SEED Design의 디자인 토큰 실제 값입니다. docs-mcp의 \`get_rootage()\` 툴과 동일한 데이터입니다.

Rootage Index: https://seed-design.io/rootage/index.json

${rootageData}`;
  },
};

export const CONTENT_ENHANCEMENT_RULES: ContentEnhancementRule[] = [rootageEnhancementRule];
