import type { Page, PageData } from "fumadocs-core/source";
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

/** llms 출력이 읽는 페이지 데이터. 섹션별 컬렉션 스키마의 공통 부분만 요구한다. */
export type LLMPage = Page<
  string | undefined,
  PageData & {
    title: string;
    deprecated?: boolean;
    /** components 섹션: 헤더/llms에 상태를 보여줄 컴포넌트 id 목록. 생략 시 slug 하나로 간주. */
    componentIds?: string[];
    /** lynx 섹션: 문서 헤더와 llms에 보여줄 Engine 최소 버전과 사용 XElement. */
    compatibility?: {
      lynx: LynxCompatibility;
    };
    getText: (type: "processed") => Promise<string>;
  }
>;

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  description: string;
  excludePaths?: string[];
}
