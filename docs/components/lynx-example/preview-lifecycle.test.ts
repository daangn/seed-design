import { describe, expect, it } from "bun:test";
import {
  configureLynxView,
  DEFAULT_LYNX_PREVIEW_MIN_HEIGHT,
  getLynxPreviewSizing,
  initializeLynxView,
  isLynxPageReady,
} from "./preview-lifecycle";

describe("Lynx 미리보기 lifecycle", () => {
  it("기본 미리보기는 최소 높이를 유지하면서 Lynx 콘텐츠 높이에 맞춰 늘어난다", () => {
    expect(getLynxPreviewSizing()).toEqual({
      autoHeight: true,
      containerStyle: { minHeight: DEFAULT_LYNX_PREVIEW_MIN_HEIGHT },
      viewStyle: { height: "auto" },
    });
  });

  it("명시한 높이가 있으면 고정 높이 미리보기를 유지한다", () => {
    expect(getLynxPreviewSizing(480)).toEqual({
      autoHeight: false,
      containerStyle: { height: 480 },
      viewStyle: { height: 480 },
    });
  });

  it("theme을 globalProps 전체 값으로 설정한다", () => {
    const element: { globalProps: unknown } = { globalProps: {} };

    configureLynxView(element, "dark");

    expect(element.globalProps).toEqual({ theme: "dark" });
  });

  it("web-core의 page part가 생긴 뒤에만 준비 상태로 본다", () => {
    expect(isLynxPageReady({ querySelector: () => null })).toBe(false);
    expect(
      isLynxPageReady({
        querySelector: (selector) => (selector === '[part="page"]' ? {} : null),
      }),
    ).toBe(true);
  });

  it("스타일 규칙을 설정한 다음 url을 설정해 shadow root 생성을 시작한다", () => {
    const assignments: string[] = [];
    const element = {
      set browserConfig(value: Record<string, unknown>) {
        assignments.push(`browserConfig:${value.lynxSdkVersion}`);
      },
      set globalProps(_value: unknown) {
        assignments.push("globalProps");
      },
      set injectStyleRules(_value: string[]) {
        assignments.push("injectStyleRules");
      },
      set url(_value: string) {
        assignments.push("url");
      },
    };

    initializeLynxView(element, {
      theme: "light",
      styleRules: ["* { box-sizing: border-box; }"],
      url: "/preview.web.bundle",
    });

    expect(assignments).toEqual(["browserConfig:3.5", "globalProps", "injectStyleRules", "url"]);
  });
});
