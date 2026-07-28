import { describe, expect, test } from "bun:test";
import { generateAgentHandoff, matchAgentRules } from "@seed-design/doctor-core";

import { IDENTIFIER_OVERRIDES } from "../rules/component-reviews";
import { createComponentUsageReviewRule } from "../rules/component-usage-review";

const BASE_URL = "https://seed-design.io";

const RULE = createComponentUsageReviewRule({
  componentId: "bottom-sheet",
  componentName: "Bottom Sheet",
  identifiers: ["BottomSheet"],
  baseUrl: BASE_URL,
});

function handoff(files: Array<{ path: string; content: string }>) {
  return generateAgentHandoff(
    { findings: [], agentMatches: matchAgentRules(files, [RULE]) },
    { tool: { name: "@seed-design/cli", version: "0.0.0-test" }, cwd: "/project" },
  );
}

describe("seed/component-usage-review", () => {
  test("import 경로와 무관하게 내용으로 대상을 잡는다 — 패키지·스니펫·자체 구현 모두", () => {
    const matches = matchAgentRules(
      [
        {
          path: "src/from-package.tsx",
          content: `import { BottomSheetRoot } from "@seed-design/react";`,
        },
        {
          path: "src/from-snippet.tsx",
          content: `import { BottomSheet } from "@/seed-design/ui/bottom-sheet";`,
        },
        // 자체 구현 — SEED를 안 쓰지만 같은 UI라 검토 대상 (karrot-form 실제 케이스)
        {
          path: "src/FlexibleBottomSheet.tsx",
          content: "export function FlexibleBottomSheet() {}",
        },
        {
          path: "src/unrelated.tsx",
          content: `import { ActionButton } from "@seed-design/react";`,
        },
        { path: "src/not-jsx.ts", content: "const BottomSheet = 1;" },
      ],
      [RULE],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].matchedFiles).toEqual([
      "src/from-package.tsx",
      "src/from-snippet.tsx",
      "src/FlexibleBottomSheet.tsx",
    ]);
  });

  test("판정 기준을 룰에 담지 않고 문서에서 도출하라고 지시한다", () => {
    const markdown = handoff([{ path: "src/a.tsx", content: "<BottomSheetRoot />" }]);

    expect(RULE.acceptanceCriteria).toBeUndefined();
    expect(markdown).toContain("판정 기준은 아래 참조 문서에서 도출하세요.");
    expect(markdown).toContain("Guidelines");
    // Do/Dont body가 가장 판정하기 좋은 규범 소스인데 이전엔 안 쓰고 있었다
    expect(markdown).toContain("`DoImage`/`DontImage`의 `body`");
    expect(markdown).toContain("문서에 없는 규칙을 만들지 마세요.");
    // 종결어미만으로 거르면 "최대 480px까지 보여집니다" 같은 제약 평서문을 놓친다 (실측으로 확인)
    expect(markdown).toContain("제약을 서술하는 평서문");
    // 요약을 거치면 DontImage body가 사라진다 (실측으로 확인)
    expect(markdown).toContain("원문(raw)으로");
  });

  test("기준의 출처인 가이드라인 문서와 React API 문서를 함께 준다", () => {
    const markdown = handoff([{ path: "src/a.tsx", content: "<BottomSheetRoot />" }]);

    expect(markdown).toContain(`${BASE_URL}/llms/components/bottom-sheet.txt`);
    expect(markdown).toContain(`${BASE_URL}/llms/react/components/bottom-sheet.txt`);
  });
});

describe("IDENTIFIER_OVERRIDES", () => {
  test("이름 규칙으로 유도 가능한 항목은 담지 않는다", () => {
    for (const [componentId, identifiers] of Object.entries(IDENTIFIER_OVERRIDES)) {
      const derived = componentId
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");

      expect(identifiers.length).toBeGreaterThan(0);
      // 파생 규칙 결과와 같기만 하면 override가 불필요하다
      expect(identifiers).not.toEqual([derived]);
    }
  });
});
