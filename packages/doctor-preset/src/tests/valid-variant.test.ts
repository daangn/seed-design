import { describe, expect, test } from "bun:test";
import { runStaticRules } from "@seed-design/doctor-core";

import { createValidVariantRule } from "../rules/valid-variant";
import { FIXTURE_KNOWLEDGE } from "./__testfixtures__/knowledge";

function run(files: Array<{ path: string; content: string }>) {
  const rule = createValidVariantRule(FIXTURE_KNOWLEDGE, {
    componentPackage: "@seed-design/react",
    baseUrl: "https://seed-design.io",
  });
  return runStaticRules({ files, rules: [rule] });
}

const IMPORT = `import { ActionButton } from "@seed-design/react";`;

describe("seed/valid-variant", () => {
  test("존재하지 않는 variant 값을 error로 보고하고 유효 값 목록을 안내한다", () => {
    const result = run([
      {
        path: "src/a.tsx",
        content: `${IMPORT}\n\nexport const App = () => <ActionButton variant="primary" />;\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toMatchObject({
      ruleId: "seed/valid-variant",
      severity: "error",
      line: 3,
      message: "`primary`은(는) Action Button의 유효한 variant 값이 아니에요.",
      data: { componentId: "action-button", prop: "variant", value: "primary" },
    });
    expect(result.findings[0].remediation).toContain("brandSolid");
  });

  test("유효한 값과 variant가 아닌 prop은 통과한다", () => {
    const result = run([
      {
        path: "src/b.tsx",
        content: `${IMPORT}\n\nexport const App = () => (\n  <ActionButton variant="brandSolid" size="small" onClick={() => {}} />\n);\n`,
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("표현식 값과 스프레드는 판정하지 않는다", () => {
    const result = run([
      {
        path: "src/c.tsx",
        content: [
          IMPORT,
          "declare const dynamic: string;",
          "declare const rest: object;",
          "export const App = () => <ActionButton variant={dynamic} {...rest} />;",
          "",
        ].join("\n"),
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("alias import를 로컬 이름으로 추적한다", () => {
    const result = run([
      {
        path: "src/d.tsx",
        content: `import { ActionButton as AB } from "@seed-design/react";\n\nexport const App = () => <AB size="tiny" />;\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].data).toMatchObject({ prop: "size", value: "tiny" });
  });

  test("여는 태그(children 있는 JSX)에서도 감지한다", () => {
    const result = run([
      {
        path: "src/e.tsx",
        content: `${IMPORT}\n\nexport const App = () => <ActionButton layout="stacked">라벨</ActionButton>;\n`,
      },
    ]);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].data).toMatchObject({ prop: "layout", value: "stacked" });
  });

  test("스펙과 정확히 일치하지 않는 import(compound 등)는 판정하지 않는다", () => {
    const result = run([
      {
        path: "src/f.tsx",
        content: `import { ActionSheetRoot } from "@seed-design/react";\n\nexport const App = () => <ActionSheetRoot variant="whatever" />;\n`,
      },
    ]);

    expect(result.findings).toEqual([]);
  });

  test("같은 이름의 로컬 컴포넌트(패키지 import 아님)는 판정하지 않는다", () => {
    const result = run([
      {
        path: "src/g.tsx",
        content: [
          `import { ActionButton } from "./local-button";`,
          `import { Badge } from "@seed-design/react";`,
          `export const App = () => <ActionButton variant="primary" />;`,
          "",
        ].join("\n"),
      },
    ]);

    expect(result.findings).toEqual([]);
  });
});
