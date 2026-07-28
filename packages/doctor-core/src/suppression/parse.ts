import type { Suppression } from "../types";

// "seed-doctor-ignore-next-line"이 "seed-doctor-ignore"의 prefix라서 -next-line을 먼저 매칭한다.
const DIRECTIVE_PATTERN = /seed-doctor-ignore(-next-line)?\b([^\n]*)/;
const RULE_ID_PATTERN = /^[\w@/-]+$/;

/**
 * 파일 내용에서 억제 디렉티브를 찾아 대상 라인 기준으로 해석한다.
 * 주석 문법(//, /* ...)과 무관하게 라인 단위 텍스트 매칭 — 룰 id 명시가 필수라 오탐 여지가 작다.
 * (문자열 리터럴 내부 오탐 가능성은 알려진 한계. 후속: AST 주석 범위 기반)
 */
export function parseSuppressions(content: string): Suppression[] {
  const suppressions: Suppression[] = [];
  const lines = content.split("\n");

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(DIRECTIVE_PATTERN);
    if (!match) continue;

    const kind = match[1] ? "next-line" : "inline";
    const rest = match[2] ?? "";

    // "--" 뒤는 사유. 블록 주석 닫힘(*/)은 사유·id 파싱 전에 제거한다.
    const separatorIndex = rest.indexOf("--");
    const idsPart = (separatorIndex === -1 ? rest : rest.slice(0, separatorIndex))
      .replace(/\*\/.*$/, "")
      .trim();
    const reasonPart =
      separatorIndex === -1
        ? undefined
        : rest
            .slice(separatorIndex + 2)
            .replace(/\*\/.*$/, "")
            .trim();

    const ruleIds = idsPart
      .split(/[,\s]+/)
      .filter(Boolean)
      .filter((token) => RULE_ID_PATTERN.test(token));

    // 룰 id가 없는 디렉티브는 무효 — 전체 억제는 지원하지 않는다.
    if (!ruleIds.length) continue;

    suppressions.push({
      kind,
      ruleIds,
      reason: reasonPart || undefined,
      targetLine: kind === "next-line" ? index + 2 : index + 1,
    });
  }

  return suppressions;
}
