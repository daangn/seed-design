import { describe, expect, test } from "bun:test";
import { newComponentCheck } from "../checks/new-component";
import { runPairCheck } from "../run-checks";

const makeOpts = (existingFiles: string[] = [], newDirs: string[] = []) => ({
  fileExists: (pattern: string) => {
    if (pattern.includes("*")) {
      return existingFiles.some((f) => {
        const regex = pattern
          .replace(/\*\*/g, "{{GLOBSTAR}}")
          .replace(/\*/g, "[^/]*")
          .replace(/{{GLOBSTAR}}/g, ".*");
        return new RegExp(`^${regex}$`).test(f);
      });
    }
    return existingFiles.some((f) => f === pattern || f.startsWith(pattern));
  },
  isNewDirectory: (path: string) => newDirs.includes(path),
});

describe("new-component check", () => {
  test("새 컴포넌트, 모든 타겟 누락 → 5개 결과", () => {
    const changedFiles = [
      "packages/react/src/components/NewWidget/NewWidget.tsx",
      "packages/react/src/components/NewWidget/index.ts",
    ];
    const opts = makeOpts([], ["packages/react/src/components/NewWidget"]);

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    expect(results).toHaveLength(5);
    expect(results.filter((r) => r.severity === "warning")).toHaveLength(4);
    expect(results.filter((r) => r.severity === "info")).toHaveLength(1);
  });

  test("새 컴포넌트, storybook만 존재 → 4개 결과", () => {
    const changedFiles = ["packages/react/src/components/NewWidget/NewWidget.tsx"];
    const opts = makeOpts(
      ["docs/stories/NewWidget.stories.tsx"],
      ["packages/react/src/components/NewWidget"],
    );

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    expect(results).toHaveLength(4);
    expect(results.every((r) => r.targetId !== "storybook")).toBe(true);
  });

  test("새 컴포넌트, 모든 타겟 존재 → 0개 결과", () => {
    const changedFiles = ["packages/react/src/components/NewWidget/NewWidget.tsx"];
    const opts = makeOpts(
      [
        "docs/stories/NewWidget.stories.tsx",
        "docs/content/react/components/new-widget.mdx",
        "docs/content/docs/components/feedback/new-widget.mdx",
        "packages/qvism-preset/src/recipes/new-widget.ts",
        "examples/stackflow-spa/src/seed-design/ui/new-widget.tsx",
      ],
      ["packages/react/src/components/NewWidget"],
    );

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("기존 컴포넌트 수정은 무시 (detectNewOnly)", () => {
    const changedFiles = ["packages/react/src/components/Button/Button.tsx"];
    // Button 디렉토리는 새 디렉토리가 아님
    const opts = makeOpts([], []);

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("레이아웃/유틸 컴포넌트는 무시", () => {
    const changedFiles = [
      "packages/react/src/components/Box/Box.tsx",
      "packages/react/src/components/Flex/Flex.tsx",
      "packages/react/src/components/Text/Text.tsx",
    ];
    const opts = makeOpts(
      [],
      [
        "packages/react/src/components/Box",
        "packages/react/src/components/Flex",
        "packages/react/src/components/Text",
      ],
    );

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("design-docs glob 패턴 매칭", () => {
    const changedFiles = [
      "packages/react/src/components/NewWidget/NewWidget.tsx",
      "docs/content/docs/components/feedback/new-widget.mdx",
    ];
    const opts = makeOpts([], ["packages/react/src/components/NewWidget"]);

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    // design-docs는 changedFiles에 포함되어 통과
    expect(results.find((r) => r.targetId === "design-docs")).toBeUndefined();
  });

  test("같은 컴포넌트의 여러 파일 변경은 하나로 합쳐짐", () => {
    const changedFiles = [
      "packages/react/src/components/NewWidget/NewWidget.tsx",
      "packages/react/src/components/NewWidget/NewWidgetItem.tsx",
      "packages/react/src/components/NewWidget/index.ts",
    ];
    const opts = makeOpts([], ["packages/react/src/components/NewWidget"]);

    const results = runPairCheck(newComponentCheck, changedFiles, opts);
    // NewWidget에 대해서만 5개 (중복 없음)
    expect(results).toHaveLength(5);
    expect(results.every((r) => r.component === "NewWidget")).toBe(true);
  });
});
