import { describe, expect, it } from "bun:test";
import { compareSeedComponentApi } from "./api-parity";

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
});
