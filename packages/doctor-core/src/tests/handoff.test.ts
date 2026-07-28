import { describe, expect, test } from "bun:test";

import { generateAgentHandoff, matchAgentRules } from "../agent/handoff";
import type { AgentRule, Finding, ScannedFile } from "../types";

const FILES: ScannedFile[] = [
  { path: "src/pages/home.tsx", content: "bottom-sheet 사용" },
  { path: "src/utils/math.ts", content: "무관한 파일" },
];

const RULE: AgentRule = {
  id: "seed/component-usage-review",
  kind: "agent",
  description: "BottomSheet 사용이 가이드라인에 맞는지 검토한다.",
  defaultSeverity: "info",
  guidance: {
    context: "BottomSheet는 닫기 수단이 없으면 사용자가 갇힐 수 있어요.",
    references: [
      {
        title: "BottomSheet 문서",
        url: "https://seed-design.io/llms/react/components/bottom-sheet.txt",
      },
    ],
    howToFix: "문서의 Guidelines 절을 따라 닫기 수단을 추가하세요.",
  },
  target: {
    match: (file) => file.path.endsWith(".tsx") && file.content.includes("bottom-sheet"),
    description: "BottomSheet를 사용하는 화면 파일",
  },
  acceptanceCriteria: [
    "닫기 수단이 최소 하나 제공된다.",
    "시트 내부에 또 다른 시트를 중첩하지 않는다.",
  ],
};

const META = {
  tool: { name: "@seed-design/cli", version: "0.0.0-test" },
  cwd: "/project",
};

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    ruleId: "seed/version-guide",
    severity: "warn",
    message: "@seed-design/react 1.2.0 → 최신 2.0.4 (major 1개 뒤)",
    file: "package.json",
    line: 23,
    guidance: {
      context: "2.0.0부터 SemVer를 지키기 시작했어요.",
      references: [
        { title: "v2 업그레이드 가이드", url: "https://seed-design.io/llms/react/updates/v2.txt" },
      ],
      howToFix: "업그레이드 가이드를 읽고 순서대로 적용하세요.",
    },
    suppressed: false,
    ...overrides,
  };
}

describe("matchAgentRules", () => {
  test("target.match로 대상 파일을 선정한다", () => {
    const matches = matchAgentRules(FILES, [RULE]);

    expect(matches).toHaveLength(1);
    expect(matches[0].matchedFiles).toEqual(["src/pages/home.tsx"]);
  });

  test("대상 파일이 없으면 매치에서 제외한다", () => {
    const matches = matchAgentRules([{ path: "src/a.css", content: "" }], [RULE]);

    expect(matches).toEqual([]);
  });
});

describe("generateAgentHandoff", () => {
  test("결정론 룰이 알아낸 사실을 '확인된 사실'로 함께 싣는다", () => {
    const markdown = generateAgentHandoff({ findings: [makeFinding()], agentMatches: [] }, META);

    expect(markdown).toContain("## 확인된 사실");
    expect(markdown).toContain("### seed/version-guide");
    expect(markdown).toContain("2.0.0부터 SemVer를 지키기 시작했어요.");
    expect(markdown).toContain("`package.json:23`");
    expect(markdown).toContain("major 1개 뒤");
    expect(markdown).toContain("https://seed-design.io/llms/react/updates/v2.txt");
  });

  test("억제된 finding은 사실에서 제외한다", () => {
    const markdown = generateAgentHandoff(
      { findings: [makeFinding({ suppressed: true })], agentMatches: [] },
      META,
    );

    expect(markdown).not.toContain("## 확인된 사실");
  });

  test("검토 요청에 대상·맥락·기준·참조 문서·수정 방법이 모두 담긴다", () => {
    const markdown = generateAgentHandoff(
      { findings: [], agentMatches: matchAgentRules(FILES, [RULE]) },
      META,
    );

    expect(markdown).toContain("## 검토 요청");
    expect(markdown).toContain("### seed/component-usage-review");
    expect(markdown).toContain("BottomSheet는 닫기 수단이 없으면");
    expect(markdown).toContain("- src/pages/home.tsx");
    expect(markdown).toContain("1. 닫기 수단이 최소 하나 제공된다.");
    expect(markdown).toContain("문서의 Guidelines 절을 따라");
    expect(markdown).toContain(
      "[BottomSheet 문서](https://seed-design.io/llms/react/components/bottom-sheet.txt)",
    );
  });

  test("사실과 검토 요청이 한 문서에 함께 담기고 출력 계약이 붙는다", () => {
    const markdown = generateAgentHandoff(
      { findings: [makeFinding()], agentMatches: matchAgentRules(FILES, [RULE]) },
      META,
    );

    expect(markdown).toContain("# SEED Doctor — 에이전트 핸드오프");
    expect(markdown.indexOf("## 확인된 사실")).toBeLessThan(markdown.indexOf("## 검토 요청"));
    expect(markdown).toContain("## 출력 형식");
    expect(markdown).toContain('jsonSchemaVersion: "1"');
  });

  test("진단 전용임을 명시한다 — 에이전트가 파일을 수정하면 안 된다", () => {
    const markdown = generateAgentHandoff(
      { findings: [makeFinding()], agentMatches: matchAgentRules(FILES, [RULE]) },
      META,
    );

    expect(markdown).toContain("이 작업은 진단입니다. 파일을 수정하지 마세요.");
  });

  test("판정 불가(unknown)와 severity 기준, 경로 기준을 출력 계약에 명시한다", () => {
    const markdown = generateAgentHandoff(
      { findings: [], agentMatches: matchAgentRules(FILES, [RULE]) },
      META,
    );

    expect(markdown).toContain("`unknown`");
    expect(markdown).toContain("severity 기준");
    // 경로 기준이 모호하면 에이전트가 모노레포 루트와 스캔 루트를 혼동한다
    expect(markdown).toContain(`${META.cwd} 기준 상대 경로`);
    // 결함이 대상 파일이 아니라 그 파일이 import한 곳에 있는 경우가 흔하다
    expect(markdown).toContain("실제로 고쳐야 할 위치");
  });

  test("사실도 검토 요청도 없으면 출력 계약만 남는다", () => {
    const markdown = generateAgentHandoff({ findings: [], agentMatches: [] }, META);

    expect(markdown).not.toContain("## 확인된 사실");
    expect(markdown).not.toContain("## 검토 요청");
    expect(markdown).toContain("## 출력 형식");
  });
});
