import { describe, expect, test } from "bun:test";

import { formatHumanReport } from "../report/human";
import { buildJsonReport, type ReportMeta } from "../report/json";
import type { Finding, RunResult } from "../types";
import { TEST_GUIDANCE } from "./__testfixtures__/guidance";

const META: ReportMeta = {
  tool: { name: "@seed-design/cli", version: "0.0.0-test" },
  cwd: "/project",
  fileCount: 3,
  rulePacks: [{ name: "@seed-design/doctor-preset", version: "0.0.0-test" }],
  createdAt: "2026-01-01T00:00:00.000Z",
};

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    ruleId: "seed/valid-variant",
    severity: "error",
    message: "`primary`는 유효한 값이 아니에요.",
    file: "src/a.tsx",
    line: 3,
    column: 20,
    guidance: TEST_GUIDANCE,
    suppressed: false,
    ...overrides,
  };
}

describe("buildJsonReport", () => {
  test("스키마 버전과 summary를 포함한 리포트를 만든다", () => {
    const result: RunResult = {
      findings: [
        makeFinding(),
        makeFinding({ ruleId: "seed/no-deprecated-component", severity: "warn", line: 1 }),
        makeFinding({ severity: "info", line: 5 }),
        makeFinding({ severity: "warn", line: 7, suppressed: true }),
      ],
      diagnostics: [{ message: "파싱 실패" }],
    };

    const report = buildJsonReport(result, META);

    expect(report.jsonSchemaVersion).toBe("1");
    expect(report.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(report.target).toEqual({ cwd: "/project", fileCount: 3 });
    // summary의 severity 카운트는 비억제 finding 기준, 억제분은 suppressed로 분리
    expect(report.summary).toEqual({ error: 1, warn: 1, info: 1, suppressed: 1 });
    expect(report.findings).toHaveLength(4);
    expect(report.findings.filter((finding) => finding.suppressed)).toHaveLength(1);
  });
});

describe("formatHumanReport", () => {
  test("파일별 그룹과 요약을 출력하고 억제 finding은 목록에서 제외한다", () => {
    const report = buildJsonReport(
      {
        findings: [
          makeFinding({ remediation: "유효한 값: brandSolid, neutralSolid" }),
          makeFinding({ line: 9, suppressed: true }),
        ],
        diagnostics: [],
      },
      META,
    );

    const text = formatHumanReport(report);

    expect(text).toContain("src/a.tsx");
    expect(text).toContain("3:20");
    expect(text).toContain("`primary`는 유효한 값이 아니에요.");
    expect(text).toContain("↳ 유효한 값: brandSolid, neutralSolid");
    expect(text).toContain("문제 1개 (error 1 · warn 0 · info 0)");
    expect(text).toContain("억제된 finding 1개");
    expect(text).not.toContain("9:");
  });

  test("룰별 가이드와 참조 링크를 렌더한다 — 사용자가 무엇을 읽어야 하는지가 리포트에 남아야 한다", () => {
    const report = buildJsonReport(
      { findings: [makeFinding(), makeFinding({ line: 9 })], diagnostics: [] },
      META,
    );

    const text = formatHumanReport(report);

    expect(text).toContain("── seed/valid-variant");
    expect(text).toContain("테스트용 맥락");
    expect(text).toContain("테스트용 해결 방법");
    expect(text).toContain("읽어보기: 테스트 문서 — https://seed-design.io/test");
    // 같은 룰의 finding이 둘이어도 가이드 블록은 한 번만
    expect(text.split("── seed/valid-variant")).toHaveLength(2);
  });

  test("finding이 없으면 문제 없음 메시지를 출력한다", () => {
    const report = buildJsonReport({ findings: [], diagnostics: [] }, META);

    expect(formatHumanReport(report)).toContain("발견된 문제가 없어요.");
  });

  test("colorizer를 주입하면 해당 부분에 적용된다", () => {
    const report = buildJsonReport({ findings: [makeFinding()], diagnostics: [] }, META);

    const text = formatHumanReport(report, { error: (value) => `<E>${value}</E>` });

    expect(text).toContain("<E>error</E>");
  });
});
