import { describe, expect, test } from "bun:test";
import { runStaticRules } from "@seed-design/doctor-core";

import { createSnippetGenerationRule } from "../rules/snippet-generation";
import { FIXTURE_KNOWLEDGE } from "./__testfixtures__/knowledge";

const OPTIONS = { snippetRoot: "seed-design", baseUrl: "https://seed-design.io" };

function run(files: Array<{ path: string; content: string }>) {
  const rule = createSnippetGenerationRule(FIXTURE_KNOWLEDGE, OPTIONS);
  return runStaticRules({ files, rules: [rule] });
}

/** 설치된 스니펫 헤더를 흉내낸다 (CLI가 생성하는 실제 형태) */
function header(requires: string[]): string {
  return [
    "/**",
    " * @file ui:action-button",
    ...requires.map((r) => ` * @requires ${r}`),
    " **/",
    "",
  ].join("\n");
}

describe("seed/snippet-generation", () => {
  test("구세대 스니펫을 감지하고 두 세대를 모두 보여준다", () => {
    const result = run([
      {
        path: "seed-design/ui/action-button.tsx",
        content: `${header(["@seed-design/react@~1.0.0", "@seed-design/css@~1.0.0"])}\nexport const A = 1;\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({
      ruleId: "seed/snippet-generation",
      severity: "info",
      line: 1,
    });
    expect(result.findings[0].message).toContain("@seed-design/react@~1.0.0");
    expect(result.findings[0].message).toContain("@seed-design/react@^2.0.0");
  });

  test("최신 세대 스니펫은 통과한다", () => {
    const result = run([
      {
        path: "seed-design/ui/action-button.tsx",
        content: `${header(["@seed-design/react@^2.0.0", "@seed-design/css@^2.0.0"])}\nexport const A = 1;\n`,
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("가이드에 재설치 절차와 참조 문서가 실린다", () => {
    const result = run([
      {
        path: "seed-design/ui/action-button.tsx",
        content: `${header(["@seed-design/react@~1.0.0"])}\nexport const A = 1;\n`,
      },
    ]);

    const { guidance } = result.findings[0];
    expect(guidance.howToFix).toContain("--on-diff backup");
    expect(guidance.references.map((reference) => reference.url)).toContain(
      "https://seed-design.io/llms/react/getting-started/cli/commands.txt",
    );
  });

  test("스니펫 디렉토리 밖 파일과 registry에 없는 파일은 무시한다", () => {
    const result = run([
      {
        path: "src/app.tsx",
        content: `${header(["@seed-design/react@~1.0.0"])}\nexport const A = 1;\n`,
      },
      {
        path: "seed-design/ui/unknown.tsx",
        content: `${header(["@seed-design/react@~1.0.0"])}\nexport const A = 1;\n`,
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("@requires 헤더가 없는 파일은 판정하지 않는다", () => {
    const result = run([
      { path: "seed-design/ui/action-button.tsx", content: "export const A = 1;\n" },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("snippetRoot가 없으면 룰이 동작하지 않는다", () => {
    const rule = createSnippetGenerationRule(FIXTURE_KNOWLEDGE, { baseUrl: OPTIONS.baseUrl });
    const result = runStaticRules({
      files: [
        {
          path: "seed-design/ui/action-button.tsx",
          content: `${header(["@seed-design/react@~1.0.0"])}\nexport const A = 1;\n`,
        },
      ],
      rules: [rule],
    });

    expect(result.findings).toEqual([]);
  });
});
