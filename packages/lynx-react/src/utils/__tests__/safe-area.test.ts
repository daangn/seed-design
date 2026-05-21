import { afterEach, describe, expect, it } from "vitest";

import { getSafeAreaInset, getSafeAreaPadding } from "../safe-area";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsets?: {
        top?: number | string | null;
        bottom?: number | string | null;
      };
      safeAreaInsetTop?: number | string | null;
      safeAreaInsetBottom?: number | string | null;
    };
  };
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  (globalThis as TestLynxGlobal).lynx = {
    __globalProps: globalProps,
  };
}

describe("safe area utils", () => {
  afterEach(() => {
    delete (globalThis as TestLynxGlobal).lynx;
  });

  it("falls back to env when global props are not available", () => {
    expect(getSafeAreaInset("top")).toBe("env(safe-area-inset-top)");
    expect(getSafeAreaInset("bottom")).toBe("env(safe-area-inset-bottom)");
  });

  it("uses safeAreaInsets values before env fallback", () => {
    setGlobalProps({
      safeAreaInsets: {
        top: 47,
        bottom: 34,
      },
    });

    expect(getSafeAreaInset("top")).toBe("47px");
    expect(getSafeAreaInset("bottom")).toBe("34px");
  });

  it("uses flat safeAreaInset values when safeAreaInsets are not available", () => {
    setGlobalProps({
      safeAreaInsetTop: 48,
      safeAreaInsetBottom: "35",
    });

    expect(getSafeAreaInset("top")).toBe("48px");
    expect(getSafeAreaInset("bottom")).toBe("35px");
  });

  it("lets safeAreaInsets values take precedence over flat values", () => {
    setGlobalProps({
      safeAreaInsets: {
        top: "52px",
      },
      safeAreaInsetTop: 48,
    });

    expect(getSafeAreaInset("top")).toBe("52px");
  });

  it("falls back to env when global props are zero-like", () => {
    setGlobalProps({
      safeAreaInsets: {
        top: 0,
      },
      safeAreaInsetBottom: "0px",
    });

    expect(getSafeAreaInset("top")).toBe("env(safe-area-inset-top)");
    expect(getSafeAreaInset("bottom")).toBe("env(safe-area-inset-bottom)");
  });

  it("combines base padding with the resolved safe area inset", () => {
    setGlobalProps({
      safeAreaInsets: {
        top: 47,
      },
    });

    expect(getSafeAreaPadding("top", 16)).toBe("calc(16px + 47px)");
    expect(getSafeAreaPadding("bottom", "16px")).toBe(
      "calc(16px + env(safe-area-inset-bottom))",
    );
    expect(getSafeAreaPadding("top")).toBe("47px");
  });
});
