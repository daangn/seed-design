import { describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ComponentMapResult } from "../../seed-component-map/scripts/component-map";
import { compareMappedSeedComponentApi, compareSeedComponentApi } from "./api-parity";

describe("seed-api-parity", () => {
  it("양쪽 플랫폼이 있는 컴포넌트의 공개 표면과 차이를 반환한다", async () => {
    const result = await compareSeedComponentApi("ProgressCircle");

    expect(result.component.state).toBe("matched");
    expect(result.sources.react.publicApi.length).toBeGreaterThan(0);
    expect(result.sources.lynx.publicApi.length).toBeGreaterThan(0);
    expect(result.sources.react.publicApi).toContain(
      "packages/react-headless/progress/src/index.ts",
    );
    expect(result.dimensions.exports.confidence).toBe("partial");
    expect(result.dimensions.exports.common).toContain("ProgressCircle");
    expect(result.dimensions.exports.react).toContain("useProgressCircleContext");
    expect(result.dimensions.props.confidence).toBe("unknown");
    expect(result.dimensions.props.lynx).toEqual(["maxValue", "minValue", "value"]);
    expect(result.dimensions.props.lynxOnly).toEqual([]);
    expect(result.dimensions.slots.confidence).toBe("unknown");
    expect(result.dimensions.slots.react).toContain("track");
    expect(result.dimensions.slots.reactOnly).toEqual([]);
    expect(result.dimensions.variants.confidence).toBe("unknown");
    expect(result.dimensions.accessibility.confidence).toBe("unknown");
    expect(result.dimensions.registry.common).toEqual(["registered"]);
    expect(result.dimensions.docs.common).toEqual(["documented"]);
    expect(result.readOnly).toBe(true);
  });

  it("Stackflow 공개 후보에서 내부 helper 파일을 제외한다", async () => {
    const result = await compareSeedComponentApi("AppBar");

    expect(result.sources.react.publicApi).toContain(
      "packages/stackflow/src/components/AppBar/AppBar.tsx",
    );
    expect(result.sources.react.publicApi).not.toContain(
      "packages/stackflow/src/primitive/AppBar/useAppBarContext.ts",
    );
    expect(result.dimensions.exports.react).not.toContain("UseAppBarContext");
    expect(result.dimensions.exports.react).not.toContain("AppBarPropsProvider");
  });

  it("namespace의 소문자 helper를 slot으로 분류하지 않는다", async () => {
    const result = await compareSeedComponentApi("Tabs");

    expect(result.dimensions.slots.react).not.toContain("carousel-prevent-drag");
    expect(result.dimensions.exports.lynx).toContain("TabsCarouselCamera");
    expect(result.dimensions.exports.lynx).not.toContain("getTabsLayoutWidth");
  });

  it("구현 파일이 없는 component index도 공개 API 근거에 포함한다", async () => {
    const result = await compareSeedComponentApi("Portal");

    expect(result.sources.react.publicApi).toContain(
      "packages/react/src/components/Portal/index.ts",
    );
  });

  it("component namespace를 공개 API와 slot 근거에 포함한다", async () => {
    const result = await compareSeedComponentApi("Checkbox");

    expect(result.sources.react.publicApi).toContain(
      "packages/react/src/components/Checkbox/Checkbox.namespace.ts",
    );
    expect(result.sources.lynx.publicApi).toContain(
      "packages/lynx-react/src/components/Checkbox/Checkbox.namespace.ts",
    );
    expect(result.dimensions.slots.react).toContain("hidden-input");
    expect(result.dimensions.slots.lynx).toEqual(
      expect.arrayContaining(["control", "indicator", "label", "root"]),
    );
  });

  it("다른 컴포넌트 namespace를 통한 공개 별칭만 API로 보고한다", async () => {
    const result = await compareSeedComponentApi("BottomSheetHandle");

    expect(result.sources.react.publicApi).toEqual([
      "packages/react/src/components/BottomSheet/BottomSheet.namespace.ts",
    ]);
    expect(result.dimensions.exports.react).toEqual(["Handle", "HandleProps"]);
    expect(result.dimensions.exports.react).not.toContain("BottomSheetHandle");
    expect(result.dimensions.exports.react).not.toContain("Backdrop");
    expect(result.dimensions.slots.react).toEqual(["handle", "root", "touch-area"]);
  });

  it("한쪽 공개 표면이 없으면 소스 기반 차원을 unknown으로 남긴다", async () => {
    const result = await compareSeedComponentApi("KeyboardAvoidingScrollView");

    expect(result.component.state).toBe("matched");
    expect(result.sources.react.publicApi).toEqual([]);
    expect(result.sources.lynx.publicApi.length).toBeGreaterThan(0);
    expect(result.dimensions.props.confidence).toBe("unknown");
    expect(result.warnings.join("\n")).toContain("공개 API 원천");
  });

  it("문서에 명시된 플랫폼 제약을 미구현 후보와 구분한다", async () => {
    const result = await compareSeedComponentApi("Accordion");
    const expectedIds = result.platformDifferences.expected.map(({ id }) => id);
    const propsReview = result.platformDifferences.needsReview.find(
      ({ dimension }) => dimension === "props",
    );

    expect(expectedIds).toEqual(
      expect.arrayContaining([
        "slot-composition",
        "native-accessibility-properties",
        "native-heading-semantics",
        "keyboard-focus-model",
        "css-media-queries",
      ]),
    );
    expect(result.dimensions.props.react).toContain("headingLevel");
    expect(propsReview?.reactObservedOnly).toContain("headingLevel");
    expect(propsReview?.possiblyExplainedBy).toContainEqual({
      id: "native-heading-semantics",
      reactObservedOnly: ["headingLevel"],
      lynxObservedOnly: [],
    });
    expect(result.platformDifferences.needsReview.map(({ dimension }) => dimension)).toContain(
      "exports",
    );
  });

  it("양쪽 Registry snippet만 있는 컴포넌트의 직접 prop과 event를 비교한다", async () => {
    const root = await mkdtemp(join(tmpdir(), "seed-api-parity-"));
    const reactPath = "docs/registry/react/ui/registry-only.tsx";
    const lynxPath = "docs/registry/lynx/ui/registry-only.tsx";
    const reactActionPath = "docs/registry/react/ui/action-button.tsx";
    const lynxActionPath = "docs/registry/lynx/ui/action-button.tsx";
    const map: ComponentMapResult = {
      component: {
        input: "RegistryOnly",
        kebab: "registry-only",
        pascal: "RegistryOnly",
        state: "matched",
      },
      platforms: ["react", "lynx"],
      rootage: [],
      recipeSources: { react: [], lynx: [] },
      generatedOutputs: { shared: [], react: [], lynx: [] },
      headless: { react: [], lynx: [] },
      implementations: { react: [], lynx: [] },
      packageExports: { react: [], lynx: [] },
      registry: { react: [reactPath], lynx: [lynxPath] },
      docs: { shared: [], react: [], lynx: [] },
      examples: { react: [], lynx: [] },
      tests: { react: [], lynx: [] },
      ambiguities: [],
    };

    try {
      await Promise.all([
        mkdir(join(root, "docs/registry/react/ui"), { recursive: true }),
        mkdir(join(root, "docs/registry/lynx/ui"), { recursive: true }),
      ]);
      await Promise.all([
        writeFile(
          join(root, reactPath),
          `
import { type ReactActionProps } from "./action-button";
export type RegistryOnlyProps = Omit<BaseProps, "title"> & {
  title: string;
  description?: string;
  asset?: unknown;
  primaryActionProps?: ReactActionProps;
  reactOnly?: boolean;
};
export function RegistryOnly(_props: RegistryOnlyProps) {}
`,
        ),
        writeFile(
          join(root, reactActionPath),
          `
export interface ReactActionProps {
  onClick?: () => void;
}
`,
        ),
        writeFile(
          join(root, lynxPath),
          `
import type { LynxActionProps } from "./action-button";
export interface RegistryOnlyProps extends BaseProps {
  title: string;
  description?: string;
  asset?: unknown;
  primaryActionProps?: LynxActionProps;
  lynxOnly?: boolean;
}
export function RegistryOnly(_props: RegistryOnlyProps) {}
`,
        ),
        writeFile(
          join(root, lynxActionPath),
          `
export interface LynxActionProps {
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}
`,
        ),
      ]);

      const result = await compareMappedSeedComponentApi(root, map);

      expect(result.sources.react.publicApi).toEqual([reactPath]);
      expect(result.sources.lynx.publicApi).toEqual([lynxPath]);
      expect(result.sources.react.referencedPublicApi).toEqual([reactActionPath]);
      expect(result.sources.lynx.referencedPublicApi).toEqual([lynxActionPath]);
      expect(result.dimensions.props).toMatchObject({
        confidence: "partial",
        common: ["asset", "description", "primaryActionProps", "title"],
        reactOnly: ["onClick", "reactOnly"],
        lynxOnly: ["bindtap", "lynxOnly", "main-thread:bindtap"],
        evidence: [lynxActionPath, lynxPath, reactActionPath, reactPath],
      });
      expect(result.dimensions.event).toMatchObject({
        confidence: "partial",
        react: ["onClick"],
        lynx: ["bindtap", "main-thread:bindtap"],
      });
      expect(result.warnings.join("\n")).toContain("직접 선언된 prop은 partial 근거");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
