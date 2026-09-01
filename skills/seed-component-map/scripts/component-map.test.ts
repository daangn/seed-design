import { describe, expect, it } from "bun:test";
import { mapSeedComponent } from "./component-map";

describe("seed-component-map", () => {
  it("현재 체크아웃에서 ProgressCircle의 원천과 공개 표면을 연결한다", async () => {
    const result = await mapSeedComponent("ProgressCircle");

    expect(result.component).toEqual({
      input: "ProgressCircle",
      kebab: "progress-circle",
      pascal: "ProgressCircle",
      state: "matched",
    });
    expect(result.platforms).toEqual(["react", "lynx"]);
    expect(result.rootage).toContain("packages/rootage/components/progress-circle.yaml");
    expect(result.recipeSources.react).toContain(
      "packages/qvism-preset/src/recipes/progress-circle.ts",
    );
    expect(result.recipeSources.lynx).toEqual([]);
    expect(result.generatedOutputs.shared).toContain(
      "packages/rootage/__generated__/components/progress-circle.mjs",
    );
    expect(result.headless.react).toContain(
      "packages/react-headless/progress/src/ProgressCircle.tsx",
    );
    expect(result.implementations.react).toContain(
      "packages/react/src/components/ProgressCircle/ProgressCircle.tsx",
    );
    expect(result.implementations.lynx).toContain(
      "packages/lynx-react/src/components/ProgressCircle/ProgressCircle.tsx",
    );
    expect(result.packageExports.react).toContain("packages/react/src/index.ts");
    expect(result.packageExports.react).toContain("packages/react-headless/progress/src/index.ts");
    expect(result.packageExports.lynx).toContain("packages/lynx-react/src/index.ts");
    expect(result.registry.react).toContain("docs/registry/react/ui/progress-circle.tsx");
    expect(result.registry.lynx).toContain("docs/registry/lynx/ui/progress-circle.tsx");
    expect(result.docs.shared).toContain("docs/content/components/progress-circle.mdx");
    expect(result.examples.react).toContain("docs/examples/react/progress-circle/preview.tsx");
    expect(result.examples.lynx).toContain("docs/examples/lynx/progress-circle/preview.tsx");
    expect(result.tests.react).toContain("docs/stories/ProgressCircle.stories.tsx");
    expect(result.tests.lynx).toContain(
      "packages/lynx-react/src/components/ProgressCircle/ProgressCircle.test.tsx",
    );
  });

  it("부분 이름은 임의로 확정하지 않고 정확한 후보를 반환한다", async () => {
    const result = await mapSeedComponent("button");

    expect(result.component.state).toBe("ambiguous");
    expect(result.ambiguities.map(({ candidate }) => candidate)).toContain("action-button");
    expect(result.rootage).toEqual([]);
  });

  it("Stackflow AppBar의 React 구현과 공개 export를 찾는다", async () => {
    const result = await mapSeedComponent("AppBar");

    expect(result.component.state).toBe("matched");
    expect(result.implementations.react).toContain(
      "packages/stackflow/src/components/AppBar/AppBar.tsx",
    );
    expect(result.headless.react).toContain("packages/stackflow/src/primitive/AppBar/AppBar.tsx");
    expect(result.packageExports.react).toContain(
      "packages/stackflow/src/components/AppBar/index.ts",
    );
  });

  it("namespace alias를 거쳐 패키지 루트에 도달하는 공개 export를 찾는다", async () => {
    const result = await mapSeedComponent("BottomSheetHandle");

    expect(result.packageExports.react).toEqual(
      expect.arrayContaining([
        "packages/react/src/components/BottomSheetHandle/index.ts",
        "packages/react/src/components/BottomSheet/BottomSheet.namespace.ts",
        "packages/react/src/components/BottomSheet/index.ts",
        "packages/react/src/components/index.ts",
        "packages/react/src/index.ts",
      ]),
    );
  });
});
