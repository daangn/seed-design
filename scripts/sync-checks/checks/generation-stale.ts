import type { CheckResult, CustomCheck } from "../types";

export const generationStaleCheck: CustomCheck = {
  kind: "custom",
  id: "generation-stale",
  name: "생성물 최신 상태",
  severity: "warning",
  relevantPaths: [/^packages\/rootage\//, /^packages\/qvism-preset\/src\/recipes\//],
  async run(_changedFiles: string[]): Promise<CheckResult[]> {
    const { $ } = await import("bun");

    // 생성 실행
    await $`bun generate:all`.quiet();

    // 생성 후 변경사항 확인
    const diff = await $`git diff --name-only`.text();
    const changedGenerated = diff
      .trim()
      .split("\n")
      .filter((f) => f.length > 0)
      .filter(
        (f) =>
          f.startsWith("packages/css/vars/") ||
          f.startsWith("packages/css/recipes/") ||
          f.startsWith("packages/qvism-preset/src/vars/"),
      );

    if (changedGenerated.length === 0) {
      return [];
    }

    // 변경사항 원복
    for (const file of changedGenerated) {
      await $`git checkout -- ${file}`.quiet();
    }

    return changedGenerated.map((file) => ({
      checkId: "generation-stale",
      targetId: "generated-file",
      targetName: "생성 파일",
      severity: "warning" as const,
      component: file.split("/").pop() ?? file,
      sourceFile: "packages/rootage/ 또는 packages/qvism-preset/src/recipes/",
      expectedTarget: file,
      message: `\`${file}\`이(가) 최신 상태가 아닙니다. \`bun generate:all\`을 실행해주세요.`,
    }));
  },
};
