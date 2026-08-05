import {
  getAiIntegrationSource,
  getBreezeSource,
  getComponentsSource,
  getDocsSource,
  getFoundationsSource,
  getGetStartedSource,
  getLynxSource,
  getPatternsSource,
  getReactSource,
  getUpdatesSource,
} from "@/app/source";
import type { Section } from "./config";

/**
 * 섹션 전체를 균일하게 순회하기 위한 최소 형태.
 *
 * 컬렉션마다 frontmatter 스키마가 달라 `getPages()`의 페이지 타입이 제각각이라,
 * 구체 타입을 유지하면 `Object.values(...).flatMap()`이 유니온으로 깨진다.
 * 섹션별 필드가 필요한 라우트는 `@/app/source`에서 소스를 직접 import한다.
 */
interface SectionSource {
  getPages(): Array<{
    url: string;
    slugs: string[];
    path: string;
    absolutePath: string;
  }>;
}

/**
 * 섹션 ↔ fumadocs 소스 로더 짝.
 *
 * `Record<Section, ...>`이라 `config.ts`에 섹션을 추가하면 여기서 컴파일 에러가 난다 —
 * 소스를 안 붙인 섹션이 조용히 넘어가지 않는다.
 *
 * `config.ts`와 분리된 이유: 이 파일은 `@/app/source`를 값으로 import하고, 그건
 * 번들러 전용인 `.source/server.ts`로 이어진다. `scripts/generate-docs-index.ts`가
 * Next 밖에서 `config.ts`를 읽어야 해서 그쪽에는 이 의존을 둘 수 없다.
 */
export const sectionSources: Record<Section, () => Promise<SectionSource>> = {
  "get-started": getGetStartedSource,
  foundations: getFoundationsSource,
  components: getComponentsSource,
  patterns: getPatternsSource,
  docs: getDocsSource,
  react: getReactSource,
  breeze: getBreezeSource,
  lynx: getLynxSource,
  "ai-integration": getAiIntegrationSource,
  updates: getUpdatesSource,
};
