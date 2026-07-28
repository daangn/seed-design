import { describe, expect, test } from "bun:test";
import { runStaticRules } from "@seed-design/doctor-core";

import { createNoDeprecatedComponentRule } from "../rules/no-deprecated-component";
import { FIXTURE_KNOWLEDGE } from "./__testfixtures__/knowledge";

const OPTIONS = {
  componentPackage: "@seed-design/react",
  snippetRoot: "seed-design",
  baseUrl: "https://seed-design.io",
};

function run(files: Array<{ path: string; content: string }>) {
  const rule = createNoDeprecatedComponentRule(FIXTURE_KNOWLEDGE, OPTIONS);
  return runStaticRules({ files, rules: [rule] });
}

describe("seed/no-deprecated-component", () => {
  test("deprecated 컴포넌트 import를 감지하고 rootage 대체 안내를 remediation으로 낸다", () => {
    const result = run([
      {
        path: "src/a.tsx",
        content: `import { Fab } from "@seed-design/react";\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({
      ruleId: "seed/no-deprecated-component",
      severity: "warn",
      file: "src/a.tsx",
      line: 1,
      remediation: "Use contextual-floating-button instead.",
      data: { componentId: "fab", specifier: "Fab" },
    });
  });

  test("compound export는 최장 일치로 매칭된다 (ActionSheetItem → action-sheet-item)", () => {
    const result = run([
      {
        path: "src/b.tsx",
        content: `import { ActionSheetRoot, ActionSheetItem } from "@seed-design/react";\n`,
      },
    ]);

    expect(result.findings).toHaveLength(2);
    const bySpecifier = Object.fromEntries(
      result.findings.map((finding) => [finding.data?.specifier, finding.data?.componentId]),
    );
    expect(bySpecifier).toEqual({
      ActionSheetRoot: "action-sheet",
      ActionSheetItem: "action-sheet-item",
    });
  });

  test("deprecated가 아닌 컴포넌트와 다른 패키지 import는 무시한다", () => {
    const result = run([
      {
        path: "src/c.tsx",
        content: [
          `import { ActionButton } from "@seed-design/react";`,
          `import { Fab } from "other-library";`,
          "",
        ].join("\n"),
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("type-only import도 감지한다", () => {
    const result = run([
      {
        path: "src/d.tsx",
        content: `import type { FabProps } from "@seed-design/react";\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].data?.specifier).toBe("FabProps");
  });

  test("설치된 deprecated 스니펫 파일을 감지하고, 스니펫 내부의 패키지 import는 중복 보고하지 않는다", () => {
    const result = run([
      {
        path: "seed-design/ui/action-sheet.tsx",
        content: `import { ActionSheetRoot } from "@seed-design/react";\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({
      line: 1,
      message: "`ui:action-sheet` 스니펫은 deprecated 상태예요.",
      remediation: "Use menu-sheet instead.",
      data: { registryId: "ui", itemId: "action-sheet" },
    });
  });

  test("rootage 항목이 없는 registry 전용 스니펫은 일반 안내 remediation을 낸다", () => {
    const result = run([
      { path: "seed-design/ui/error-state.tsx", content: "export const ErrorState = 1;\n" },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].remediation).toBe("seed-design.io에서 대체 컴포넌트를 확인해주세요.");
  });

  test("스니펫 디렉토리 내부의 deprecated 아닌 파일은 조용히 통과한다", () => {
    const result = run([
      {
        path: "seed-design/ui/action-button.tsx",
        content: `import { ActionButton } from "@seed-design/react";\n`,
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("억제 디렉티브로 finding을 억제할 수 있다", () => {
    const result = run([
      {
        path: "src/e.tsx",
        content: [
          "// seed-doctor-ignore-next-line seed/no-deprecated-component -- 마이그레이션 진행 중",
          `import { Fab } from "@seed-design/react";`,
          "",
        ].join("\n"),
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].suppressed).toBe(true);
  });
});
