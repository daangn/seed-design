import { describe, expect, test } from "bun:test";

import { applySuppressions } from "../suppression/apply";
import { parseSuppressions } from "../suppression/parse";
import type { Finding } from "../types";
import { TEST_GUIDANCE } from "./__testfixtures__/guidance";

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    ruleId: "seed/no-deprecated-component",
    severity: "warn",
    message: "deprecated",
    file: "src/a.tsx",
    line: 2,
    guidance: TEST_GUIDANCE,
    suppressed: false,
    ...overrides,
  };
}

describe("parseSuppressions", () => {
  test("라인 주석의 inline 디렉티브를 파싱한다", () => {
    const content =
      "const a = 1; // seed-doctor-ignore seed/no-deprecated-component -- 마이그레이션 예정";
    const result = parseSuppressions(content);

    expect(result).toEqual([
      {
        kind: "inline",
        ruleIds: ["seed/no-deprecated-component"],
        reason: "마이그레이션 예정",
        targetLine: 1,
      },
    ]);
  });

  test("next-line 디렉티브는 다음 라인을 대상으로 한다", () => {
    const content = [
      "// seed-doctor-ignore-next-line seed/valid-variant -- PLAT-123",
      `<ActionButton variant="primary" />`,
    ].join("\n");
    const result = parseSuppressions(content);

    expect(result).toEqual([
      {
        kind: "next-line",
        ruleIds: ["seed/valid-variant"],
        reason: "PLAT-123",
        targetLine: 2,
      },
    ]);
  });

  test("쉼표로 구분된 여러 룰 id를 지원한다", () => {
    const content = "// seed-doctor-ignore seed/a, seed/b -- 사유";
    const result = parseSuppressions(content);

    expect(result[0].ruleIds).toEqual(["seed/a", "seed/b"]);
  });

  test("블록 주석에서도 동작하고 */는 사유에 포함하지 않는다", () => {
    const content = "const a = 1; /* seed-doctor-ignore seed/a -- 사유 */";
    const result = parseSuppressions(content);

    expect(result[0].ruleIds).toEqual(["seed/a"]);
    expect(result[0].reason).toBe("사유");
  });

  test("사유가 없으면 reason은 undefined다", () => {
    const content = "// seed-doctor-ignore seed/a";
    const result = parseSuppressions(content);

    expect(result[0].reason).toBeUndefined();
  });

  test("룰 id가 없는 디렉티브는 무효다 (전체 억제 미지원)", () => {
    const content = "// seed-doctor-ignore\n// seed-doctor-ignore -- 사유만 있음";

    expect(parseSuppressions(content)).toEqual([]);
  });
});

describe("applySuppressions", () => {
  test("같은 라인·같은 룰 id의 finding을 억제한다", () => {
    const findings = [makeFinding({ line: 2 })];
    const suppressions = parseSuppressions(
      ["const a = 1;", "use(); // seed-doctor-ignore seed/no-deprecated-component -- 이유"].join(
        "\n",
      ),
    );

    const [result] = applySuppressions(findings, suppressions);

    expect(result.suppressed).toBe(true);
    expect(result.suppression).toEqual({ kind: "inline", reason: "이유" });
  });

  test("룰 id가 다르면 억제하지 않는다", () => {
    const findings = [makeFinding({ ruleId: "seed/valid-variant", line: 2 })];
    const suppressions = parseSuppressions(
      ["const a = 1;", "use(); // seed-doctor-ignore seed/no-deprecated-component"].join("\n"),
    );

    const [result] = applySuppressions(findings, suppressions);

    expect(result.suppressed).toBe(false);
  });

  test("라인이 다르면 억제하지 않는다", () => {
    const findings = [makeFinding({ line: 5 })];
    const suppressions = parseSuppressions(
      "// seed-doctor-ignore-next-line seed/no-deprecated-component",
    );

    const [result] = applySuppressions(findings, suppressions);

    expect(result.suppressed).toBe(false);
  });
});
