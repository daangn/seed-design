import { describe, expect, test } from "bun:test";
import { generationStaleCheck } from "../checks/generation-stale";

describe("generation-stale check", () => {
  test("relevantPaths가 rootage와 qvism-preset recipes를 포함", () => {
    const paths = [
      "packages/rootage/components/button.yaml",
      "packages/rootage/tokens/color.yaml",
      "packages/qvism-preset/src/recipes/button.ts",
    ];

    for (const path of paths) {
      const matches = generationStaleCheck.relevantPaths.some((p) => p.test(path));
      expect(matches).toBe(true);
    }
  });

  test("관련 없는 경로는 매칭하지 않음", () => {
    const paths = [
      "packages/react/src/components/Button/Button.tsx",
      "packages/css/vars/color.css",
      "docs/stories/Button.stories.tsx",
    ];

    for (const path of paths) {
      const matches = generationStaleCheck.relevantPaths.some((p) => p.test(path));
      expect(matches).toBe(false);
    }
  });

  test("check 메타데이터가 올바름", () => {
    expect(generationStaleCheck.kind).toBe("custom");
    expect(generationStaleCheck.id).toBe("generation-stale");
    expect(generationStaleCheck.severity).toBe("warning");
  });
});
