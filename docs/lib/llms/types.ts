import type { MarkdownRenderer } from "@fumadocs/satteri/local-md";
import type { Page } from "fumadocs-core/source";
import type { LynxCompatibility } from "@/lib/lynx-compatibility";

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
    content: string;
    frontmatter: Record<string, unknown> & {
      deprecated?: boolean;
      /** components 섹션: 헤더/llms에 상태를 보여줄 컴포넌트 id 목록. 생략 시 slug 하나로 간주. */
      componentIds?: string[];
      /** lynx 섹션: 문서 헤더와 llms에 보여줄 Engine 최소 버전과 사용 XElement. */
      compatibility?: {
        lynx: LynxCompatibility;
      };
    };
    load: () => Promise<MarkdownRenderer<Record<string, unknown> & { processed?: string }>>;
  };
};

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  description: string;
  excludePaths?: string[];
}
