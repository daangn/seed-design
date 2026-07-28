import type { RuleGuidance } from "../../types";

/** 테스트에서 룰·finding을 만들 때 쓰는 최소 가이드 */
export const TEST_GUIDANCE: RuleGuidance = {
  context: "테스트용 맥락",
  references: [{ title: "테스트 문서", url: "https://seed-design.io/test" }],
  howToFix: "테스트용 해결 방법",
};
