import type { AgentRule } from "@seed-design/doctor-core";

import { REFERENCE_PATHS, docsReference } from "../guidance";

export interface ComponentUsageReviewOptions {
  /** 컴포넌트 문서 id. 예: "bottom-sheet" */
  componentId: string;
  /** 사람이 읽는 이름. 예: "Bottom Sheet" */
  componentName: string;
  /** 코드에서 찾을 식별자 prefix. 하나라도 등장하면 검토 대상. 예: ["BottomSheet"] */
  identifiers: string[];
  baseUrl: string;
}

/**
 * 컴포넌트 사용이 가이드라인에 맞는지 에이전트에게 검토를 위임한다.
 *
 * **판정 기준을 룰에 담지 않는다.** 기준은 가이드라인 문서의 Guidelines 절과 Do/Dont의
 * `body`에 이미 있고, 에이전트가 그걸 읽어 도출한다. 그래서 문서에 Do/Dont를 하나 추가하면
 * 판정 기준이 하나 늘어난다 — 룰 코드는 그대로다.
 *
 * 대상 선정은 **내용 기반**이다. 에이전트가 어차피 파일 전체를 읽으므로 import 경로를
 * 정밀 해석할 필요가 없고, 덕분에 패키지 import·로컬 스니펫 import·자체 구현이 모두 걸린다.
 */
export function createComponentUsageReviewRule(options: ComponentUsageReviewOptions): AgentRule {
  const { componentId, componentName, identifiers, baseUrl } = options;

  return {
    id: `seed/component-usage-review/${componentId}`,
    kind: "agent",
    description: `${componentName} 사용이 디자인 가이드라인에 맞는지 검토해요.`,
    defaultSeverity: "info",
    guidance: {
      context: [
        `${componentName}은(는) 정적 분석으로는 옳고 그름을 판정할 수 없어요. prop 조합이 적절한지, 가이드라인의 Do/Don't에 어긋나지 않는지는 문서를 읽고 코드 맥락을 봐야 알 수 있어요.`,
        "",
        `대상에는 SEED ${componentName}을(를) 쓰는 파일뿐 아니라 **같은 UI를 직접 구현한 파일도 포함**돼요. 후자라면 기준을 "이 자체 구현이 가이드라인을 지키는가"로 읽고, 특히 SEED가 이미 제공하는 것을 다시 만들지 않았는지 확인하세요.`,
      ].join("\n"),
      references: [
        docsReference(
          baseUrl,
          REFERENCE_PATHS.componentGuideline(componentId),
          `${componentName} 디자인 가이드라인 (판정 기준의 출처)`,
        ),
        docsReference(
          baseUrl,
          REFERENCE_PATHS.reactComponent(componentId),
          `${componentName} React API`,
        ),
      ],
      howToFix:
        "가이드라인 문서의 Guidelines 절과 React API 문서의 Props 표를 대조해, 직접 구현한 동작 중 제공되는 prop으로 대체할 수 있는 것부터 정리하세요.",
    },
    target: {
      match: (file) =>
        /\.(tsx|jsx)$/.test(file.path) &&
        identifiers.some((identifier) => file.content.includes(identifier)),
      description: `${identifiers.join(", ")} 중 하나라도 등장하는 파일 (SEED 컴포넌트 사용 + 같은 UI의 자체 구현 둘 다)`,
    },
    // acceptanceCriteria 없음 — 기준은 위 가이드라인 문서에서 도출한다.
  };
}
