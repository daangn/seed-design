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

/**
 * llms 출력이 읽는 페이지. `src/content/source.ts#getLlmsPages`가 만든다(fumadocs 타입은 그 모듈 밖으로 나오지 않는다).
 */
export interface LLMPage {
  url: string;
  /** 섹션 content 디렉터리 기준 원천 경로(예: `components/action-button.mdx`). */
  path: string;
  slugs: string[];
  data: {
    title: string;
    description?: string;
    deprecated?: boolean;
    /** components 섹션: 헤더/llms에 상태를 보여줄 컴포넌트 id 목록. 생략 시 slug 하나로 간주. */
    componentIds?: string[];
    /** lynx 섹션: 문서 헤더와 llms에 보여줄 Engine 최소 버전과 사용 XElement. */
    compatibility?: {
      lynx: LynxCompatibility;
    };
    /** updates 섹션: 발행일. */
    publishedAt?: string | Date;
    getText: (type: "processed") => Promise<string>;
  };
}

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  description: string;
  excludePaths?: string[];
}
