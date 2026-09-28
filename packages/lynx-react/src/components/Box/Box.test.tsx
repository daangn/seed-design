import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Text } from "../Text";
import { Box } from "./Box";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetRight?: number;
      safeAreaInsetBottom?: number;
      safeAreaInsetLeft?: number;
    };
  };
  lynxTestingEnv?: {
    backgroundThread: {
      globalThis: TestLynxGlobal;
    };
    mainThread: {
      globalThis: TestLynxGlobal;
    };
  };
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function expectStyle(style: CSSStyleDeclaration, expected: Record<string, string>) {
  for (const [key, value] of Object.entries(expected)) {
    expect(style.getPropertyValue(key)).toBe(value);
  }
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv?.backgroundThread.globalThis,
    lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    global.lynx = {
      ...global.lynx,
      __globalProps: globalProps,
    };
  }
}

describe("Box", () => {
  afterEach(() => {
    setGlobalProps({});
    vi.unstubAllGlobals();
  });

  it("resolves top and bottom safe area padding from global props", () => {
    setGlobalProps({
      safeAreaInsetTop: 47,
      safeAreaInsetBottom: 34,
    });

    render(
      <Box className="box-test" pt="safeArea" pb="safeArea">
        <Text>Box content</Text>
      </Box>,
    );

    const box = getRenderedRoot().querySelector(".box-test");

    expect(box).toBeInTheDocument();
    expectStyle((box as HTMLElement).style, {
      "padding-top": "47px",
      "padding-bottom": "34px",
    });
  });

  it("resolves left and right safe area padding from global props", () => {
    setGlobalProps({
      safeAreaInsetRight: 62,
      safeAreaInsetLeft: 59,
    });

    render(
      <Box className="box-test" pl="safeArea" pr="safeArea">
        <Text>Box content</Text>
      </Box>,
    );

    const box = getRenderedRoot().querySelector(".box-test");

    expect(box).toBeInTheDocument();
    expectStyle((box as HTMLElement).style, {
      "padding-left": "59px",
      "padding-right": "62px",
    });
  });

  it("resolves margin with side over axis over all", () => {
    render(<Box className="box-test" m="x1" mx="x2" ml="x3" />);

    const box = getRenderedRoot().querySelector(".box-test");

    expectStyle((box as HTMLElement).style, {
      "margin-top": "var(--seed-dimension-x1)",
      "margin-right": "var(--seed-dimension-x2)",
      "margin-bottom": "var(--seed-dimension-x1)",
      "margin-left": "var(--seed-dimension-x3)",
    });
  });

  it("keeps auto margin", () => {
    render(<Box className="box-test" ml="auto" />);

    const box = getRenderedRoot().querySelector(".box-test");

    expectStyle((box as HTMLElement).style, { "margin-left": "auto" });
  });

  it("negates bleed values with side over axis over all", () => {
    render(<Box className="box-test" bleed="4px" bleedX="8px" bleedLeft="12px" />);

    const box = getRenderedRoot().querySelector(".box-test");

    // happy-dom folds the constant `calc(4px * -1)` that Box emits.
    expectStyle((box as HTMLElement).style, {
      "margin-top": "calc(-4px)",
      "margin-right": "calc(-8px)",
      "margin-bottom": "calc(-4px)",
      "margin-left": "calc(-12px)",
    });
  });

  it("negates safe area bleed from global props", () => {
    setGlobalProps({
      safeAreaInsetRight: 62,
      safeAreaInsetLeft: 59,
    });

    render(<Box className="box-test" bleedX="safeArea" />);

    const box = getRenderedRoot().querySelector(".box-test");

    expectStyle((box as HTMLElement).style, {
      "margin-left": "calc(-59px)",
      "margin-right": "calc(-62px)",
    });
  });

  it("rejects dimension tokens as bleed values", () => {
    // @ts-expect-error Lynx drops an inline calc() that contains a token's var().
    render(<Box bleedX="x4" />);
  });

  it("lets style override margin props", () => {
    render(<Box className="box-test" mt="x4" style={{ marginTop: "3px" }} />);

    const box = getRenderedRoot().querySelector(".box-test");

    expectStyle((box as HTMLElement).style, { "margin-top": "3px" });
  });

  it("rejects margin and bleed props together", () => {
    // @ts-expect-error margin and bleed props both resolve to margin-*.
    render(<Box m="x1" bleedX="8px" />);
  });
});
