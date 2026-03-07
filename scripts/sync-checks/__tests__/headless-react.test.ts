import { describe, expect, test } from "bun:test";
import { headlessReactCheck } from "../checks/headless-react";
import { runPairCheck } from "../run-checks";

const makeOpts = (existingFiles: string[] = []) => ({
  fileExists: (pattern: string) =>
    existingFiles.some((f) => f === pattern || f.startsWith(pattern)),
  isNewDirectory: () => true,
});

describe("headless-react check", () => {
  test("headless 변경, styled 미변경 → 경고", () => {
    const changedFiles = ["packages/react-headless/checkbox/src/useCheckbox.ts"];
    const opts = makeOpts([]);

    const results = runPairCheck(headlessReactCheck, changedFiles, opts);
    expect(results).toHaveLength(1);
    expect(results[0].component).toBe("checkbox");
    expect(results[0].targetId).toBe("styled");
    expect(results[0].expectedTarget).toBe("packages/react/src/components/Checkbox/");
  });

  test("headless + styled 둘 다 변경 → 통과", () => {
    const changedFiles = [
      "packages/react-headless/checkbox/src/useCheckbox.ts",
      "packages/react/src/components/Checkbox/Checkbox.tsx",
    ];
    const opts = makeOpts([]);

    const results = runPairCheck(headlessReactCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("styled 컴포넌트가 이미 존재 → 통과", () => {
    const changedFiles = ["packages/react-headless/checkbox/src/useCheckbox.ts"];
    const opts = makeOpts(["packages/react/src/components/Checkbox/Checkbox.tsx"]);

    const results = runPairCheck(headlessReactCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("유틸 패키지는 무시", () => {
    const changedFiles = [
      "packages/react-headless/primitive/src/index.ts",
      "packages/react-headless/supports/src/index.ts",
      "packages/react-headless/use-controllable-state/src/index.ts",
      "packages/react-headless/portal/src/index.ts",
    ];
    const opts = makeOpts([]);

    const results = runPairCheck(headlessReactCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("여러 headless 변경 → 각각 체크", () => {
    const changedFiles = [
      "packages/react-headless/checkbox/src/useCheckbox.ts",
      "packages/react-headless/tabs/src/useTabs.ts",
    ];
    const opts = makeOpts([]);

    const results = runPairCheck(headlessReactCheck, changedFiles, opts);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.component).sort()).toEqual(["checkbox", "tabs"]);
  });
});
