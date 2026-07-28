import { describe, expect, test } from "bun:test";

import { getNodePosition } from "../engine/rule-context";
import { runStaticRules } from "../engine/run-static-rules";
import type { ScannedFile, StaticRule } from "../types";
import { TEST_GUIDANCE } from "./__testfixtures__/guidance";

const FILES: ScannedFile[] = [
  { path: "src/a.tsx", content: `import { Fab } from "@seed-design/react";\n` },
  { path: "src/b.ts", content: "export const b = 1;\n" },
];

function makeRule(overrides: Partial<StaticRule> = {}): StaticRule {
  return {
    id: "test/report-every-file",
    kind: "static",
    description: "모든 파일에 finding 하나를 보고한다",
    defaultSeverity: "warn",
    guidance: TEST_GUIDANCE,
    check(context) {
      context.report({ message: `hit ${context.file.path}`, line: 1 });
    },
    ...overrides,
  };
}

describe("runStaticRules", () => {
  test("모든 파일에 룰을 실행하고 finding을 수집한다", () => {
    const result = runStaticRules({ files: FILES, rules: [makeRule()] });

    expect(result.findings).toHaveLength(2);
    expect(result.findings[0]).toMatchObject({
      ruleId: "test/report-every-file",
      severity: "warn",
      file: "src/a.tsx",
      suppressed: false,
    });
    expect(result.diagnostics).toEqual([]);
  });

  test("match 프레디킷으로 파일을 필터링한다", () => {
    const rule = makeRule({ match: (path) => path.endsWith(".tsx") });
    const result = runStaticRules({ files: FILES, rules: [rule] });

    expect(result.findings.map((finding) => finding.file)).toEqual(["src/a.tsx"]);
  });

  test("config로 severity를 오버라이드한다", () => {
    const result = runStaticRules({
      files: FILES,
      rules: [makeRule()],
      config: { rules: { "test/report-every-file": "error" } },
    });

    expect(result.findings.every((finding) => finding.severity === "error")).toBe(true);
  });

  test('config "off"면 룰을 실행하지 않는다', () => {
    const result = runStaticRules({
      files: FILES,
      rules: [makeRule()],
      config: { rules: { "test/report-every-file": "off" } },
    });

    expect(result.findings).toEqual([]);
  });

  test("룰이 던진 예외는 diagnostics로 수집되고 다른 룰은 계속 실행된다", () => {
    const throwing = makeRule({
      id: "test/throws",
      check() {
        throw new Error("boom");
      },
    });
    const result = runStaticRules({ files: FILES, rules: [throwing, makeRule()] });

    expect(result.findings).toHaveLength(2);
    expect(result.diagnostics).toHaveLength(2);
    expect(result.diagnostics[0]).toMatchObject({ ruleId: "test/throws", message: "boom" });
  });

  test("sourceFile()로 JSX AST에 접근할 수 있다", () => {
    const jsxFile: ScannedFile = {
      path: "src/jsx.tsx",
      content: `import { ActionButton } from "@seed-design/react";\n\nexport const App = () => <ActionButton variant="brandSolid" />;\n`,
    };
    const rule = makeRule({
      id: "test/jsx",
      check(context) {
        const sourceFile = context.sourceFile();
        const attribute = sourceFile.getDescendants().find((node) => {
          return node.getKindName() === "JsxAttribute" && node.getText().startsWith("variant");
        });
        if (attribute) {
          const position = getNodePosition(attribute);
          context.report({ message: "variant 발견", line: position.line, column: position.column });
        }
      },
    });

    const result = runStaticRules({ files: [jsxFile], rules: [rule] });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].line).toBe(3);
    expect(result.findings[0].column).toBeGreaterThan(1);
  });

  test("억제 디렉티브가 finding에 반영된다", () => {
    const file: ScannedFile = {
      path: "src/suppressed.tsx",
      content: [
        "// seed-doctor-ignore-next-line test/report-every-file -- 이유",
        "const a = 1;",
      ].join("\n"),
    };
    const rule = makeRule({
      check(context) {
        context.report({ message: "hit", line: 2 });
      },
    });

    const result = runStaticRules({ files: [file], rules: [rule] });

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].suppressed).toBe(true);
    expect(result.findings[0].suppression?.reason).toBe("이유");
  });

  test("agent 룰은 static 실행에서 무시된다", () => {
    const result = runStaticRules({
      files: FILES,
      rules: [
        {
          id: "test/agent",
          kind: "agent",
          description: "agent rule",
          defaultSeverity: "info",
          guidance: TEST_GUIDANCE,
          target: { description: "모든 파일" },
          acceptanceCriteria: ["기준"],
        },
      ],
    });

    expect(result.findings).toEqual([]);
    expect(result.diagnostics).toEqual([]);
  });
});
