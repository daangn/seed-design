import type { Finding, Suppression } from "../types";

/**
 * finding에 억제를 적용한다. 억제된 finding은 제거하지 않고 suppressed 플래그만 세운다 —
 * 억제량 자체가 리포트·집계에서 의미 있는 지표이기 때문.
 */
export function applySuppressions(findings: Finding[], suppressions: Suppression[]): Finding[] {
  if (!suppressions.length) return findings;

  return findings.map((finding) => {
    const matched = suppressions.find(
      (suppression) =>
        suppression.targetLine === finding.line && suppression.ruleIds.includes(finding.ruleId),
    );

    if (!matched) return finding;

    return {
      ...finding,
      suppressed: true,
      suppression: { kind: matched.kind, reason: matched.reason },
    };
  });
}
