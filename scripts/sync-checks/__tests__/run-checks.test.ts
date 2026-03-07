import { describe, expect, test } from "bun:test";
import { headlessReactCheck } from "../checks/headless-react";
import { newComponentCheck } from "../checks/new-component";
import { rootageRecipeCheck } from "../checks/rootage-recipe";
import { runAllChecks } from "../run-checks";

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

const pairChecks = [newComponentCheck, headlessReactCheck, rootageRecipeCheck];

describe("runAllChecks 통합 테스트", () => {
  test("관련 없는 파일 변경 → 0개 결과", async () => {
    const changedFiles = ["docs/README.md", "package.json", ".github/workflows/ci.yml"];
    const opts = makeOpts();

    const results = await runAllChecks(pairChecks, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("여러 체크가 동시에 트리거 → 각각 결과 반환", async () => {
    const changedFiles = [
      // new-component 트리거
      "packages/react/src/components/NewWidget/NewWidget.tsx",
      // headless-react 트리거
      "packages/react-headless/dialog/src/useDialog.ts",
    ];
    const opts = makeOpts([], ["packages/react/src/components/NewWidget"]);

    const results = await runAllChecks(pairChecks, changedFiles, opts);

    const newComponentResults = results.filter((r) => r.checkId === "new-component");
    const headlessResults = results.filter((r) => r.checkId === "headless-react");

    expect(newComponentResults.length).toBeGreaterThan(0);
    expect(headlessResults.length).toBeGreaterThan(0);
  });

  test("rootage 변경, recipe 미존재 → onlyWhenTargetExists로 스킵", async () => {
    const changedFiles = ["packages/rootage/components/new-spec.yaml"];
    const opts = makeOpts();

    const results = await runAllChecks(pairChecks, changedFiles, opts);
    expect(results).toHaveLength(0);
  });
});
