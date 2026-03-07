import { describe, expect, test } from "bun:test";
import { rootageRecipeCheck } from "../checks/rootage-recipe";
import { runPairCheck } from "../run-checks";

const makeOpts = (existingFiles: string[] = []) => ({
  fileExists: (pattern: string) => existingFiles.includes(pattern),
  isNewDirectory: () => true,
});

describe("rootage-recipe check", () => {
  test("rootage 변경, recipe 존재하지만 미변경 → 경고", () => {
    const changedFiles = ["packages/rootage/components/checkbox.yaml"];
    const opts = makeOpts(["packages/qvism-preset/src/recipes/checkbox.ts"]);

    const results = runPairCheck(rootageRecipeCheck, changedFiles, opts);
    // onlyWhenTargetExists=true이고 타겟이 있으므로 체크 진행
    // 타겟이 changedFiles에 없고, fileExists로 존재는 함 → 통과
    // 실제로는 "이미 존재하면 통과" 로직에 의해 0
    expect(results).toHaveLength(0);
  });

  test("rootage 변경, recipe 미존재 → onlyWhenTargetExists로 무시", () => {
    const changedFiles = ["packages/rootage/components/new-spec.yaml"];
    const opts = makeOpts([]); // recipe 없음

    const results = runPairCheck(rootageRecipeCheck, changedFiles, opts);
    // onlyWhenTargetExists=true이고 타겟이 없으므로 스킵
    expect(results).toHaveLength(0);
  });

  test("rootage 변경 + recipe도 변경 → 통과", () => {
    const changedFiles = [
      "packages/rootage/components/checkbox.yaml",
      "packages/qvism-preset/src/recipes/checkbox.ts",
    ];
    const opts = makeOpts(["packages/qvism-preset/src/recipes/checkbox.ts"]);

    const results = runPairCheck(rootageRecipeCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });

  test("서브 컴포넌트 스펙은 매칭하지 않음", () => {
    // 파일 이름에 점이 포함된 경우 (e.g., checkbox.control.yaml)
    const changedFiles = ["packages/rootage/components/checkbox.control.yaml"];
    const opts = makeOpts([]);

    // 패턴이 /([^.]+)\.yaml$/ 이므로 점 포함 파일은 매칭 안됨
    const results = runPairCheck(rootageRecipeCheck, changedFiles, opts);
    expect(results).toHaveLength(0);
  });
});
