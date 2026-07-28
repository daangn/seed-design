import type { RulePack } from "@seed-design/doctor-core";

import packageJson from "../package.json";
import type { FetchImpl } from "./knowledge/fetch";
import { loadRegistryKnowledge } from "./knowledge/registry";
import { loadRootageKnowledge } from "./knowledge/rootage";
import type { SeedDoctorKnowledge } from "./knowledge/types";
import { loadGuidelineDocIds } from "./knowledge/guideline-docs";
import { IDENTIFIER_OVERRIDES } from "./rules/component-reviews";
import { createComponentUsageReviewRule } from "./rules/component-usage-review";
import { createNoDeprecatedComponentRule } from "./rules/no-deprecated-component";
import { createSnippetGenerationRule } from "./rules/snippet-generation";
import { createValidVariantRule } from "./rules/valid-variant";

export interface LoadSeedRulePackOptions {
  /** seed-design.io 또는 로컬 docs 서버 */
  baseUrl: string;
  framework: "react" | "lynx";
  /** 스캔 루트 기준 스니펫 디렉토리의 posix 상대 경로 (seed-design.json의 path). 없으면 스니펫 검사를 건너뛴다. */
  snippetRoot?: string;
  fetchImpl?: FetchImpl;
}

const COMPONENT_PACKAGE_BY_FRAMEWORK = {
  react: "@seed-design/react",
  lynx: "@seed-design/lynx-react",
} as const;

/**
 * SEED 룰 팩을 만든다. 지식(rootage·registry 아티팩트)을 먼저 전부 fetch한 뒤
 * 룰을 인스턴스화하므로, 이후 룰 실행(check)은 네트워크 없이 결정론적으로 동작한다.
 */
export async function loadSeedRulePack(options: LoadSeedRulePackOptions): Promise<RulePack> {
  const { baseUrl, framework, snippetRoot, fetchImpl } = options;

  const rootage = await loadRootageKnowledge({ baseUrl, fetchImpl });
  const registry = await loadRegistryKnowledge({
    baseUrl,
    framework,
    deprecatedComponents: rootage.deprecatedComponents,
    fetchImpl,
  });

  const knowledge: SeedDoctorKnowledge = {
    components: rootage.components,
    deprecatedComponents: rootage.deprecatedComponents,
    componentVariantSpecs: rootage.componentVariantSpecs,
    deprecatedSnippetItems: registry.deprecatedSnippetItems,
    snippetItems: registry.snippetItems,
  };

  const componentPackage = COMPONENT_PACKAGE_BY_FRAMEWORK[framework];

  // 가이드라인 문서가 있는 컴포넌트에만 검토 룰을 만든다. 문서를 쓰면 검토가 켜지고,
  // 없으면 조용히 빠진다 — 읽을 게 없으면 에이전트도 판정할 게 없다.
  const guidelineDocIds = await loadGuidelineDocIds({ baseUrl, fetchImpl });

  return {
    name: packageJson.name,
    version: packageJson.version,
    rules: [
      createNoDeprecatedComponentRule(knowledge, { componentPackage, snippetRoot, baseUrl }),
      createValidVariantRule(knowledge, { componentPackage, baseUrl }),
      createSnippetGenerationRule(knowledge, { snippetRoot, baseUrl }),
      ...buildComponentReviewRules(knowledge, guidelineDocIds, baseUrl),
    ],
  };
}

/** rootage 컴포넌트 × 가이드라인 문서 존재 → 검토 룰. 이름 예외만 override 맵에서 가져온다. */
function buildComponentReviewRules(
  knowledge: SeedDoctorKnowledge,
  guidelineDocIds: Set<string>,
  baseUrl: string,
) {
  return knowledge.components
    .filter((component) => guidelineDocIds.has(component.id))
    .map((component) =>
      createComponentUsageReviewRule({
        componentId: component.id,
        componentName: component.name,
        // 기본은 공백 뺀 이름의 prefix 매칭. "Bottom Sheet" → BottomSheetRoot·BottomSheetContent 등을 다 잡는다.
        identifiers: IDENTIFIER_OVERRIDES[component.id] ?? [component.name.replace(/[\s-]/g, "")],
        baseUrl,
      }),
    );
}
