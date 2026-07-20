import type { Page } from "fumadocs-core/source";

export type Section =
  | "get-started"
  | "foundations"
  | "components"
  | "patterns"
  | "react"
  | "docs"
  | "breeze"
  | "lynx"
  | "ai-integration"
  | "updates";

export type LLMPage = Page & {
  data: {
    title: string;
    description?: string;
    deprecated?: boolean;
    /** components 섹션: 헤더/llms에 상태를 보여줄 컴포넌트 id 목록. 생략 시 slug 하나로 간주. */
    componentIds?: string[];
    getText: (type: "raw" | "processed") => Promise<string | undefined>;
  };
};

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  description: string;
  excludePaths?: string[];
}
