import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Text } from "../Text";
import { Box } from "./Box";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetBottom?: number;
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

  it("adds the seed-box class of each style prop before the user className", () => {
    render(<Box className="box-test" bg="bg.brandWeak" p="x4" borderRadius="r2" flexGrow />);

    const box = getRenderedRoot().querySelector(".box-test") as HTMLElement;

    expect([...box.classList]).toEqual([
      "seed-box",
      "seed-box-background",
      "seed-box-border-radius",
      "seed-box-padding",
      "seed-box-flex-grow",
      "box-test",
    ]);
  });

  it("adds no seed-box class without style props", () => {
    render(<Box className="box-test" />);

    const box = getRenderedRoot().querySelector(".box-test") as HTMLElement;

    expect([...box.classList]).toEqual(["box-test"]);
  });

  it("adds safe area padding classes", () => {
    setGlobalProps({
      safeAreaInsetTop: 47,
      safeAreaInsetBottom: 34,
    });

    render(
      <Box className="box-test" pt="safeArea" pb="safeArea">
        <Text>Box content</Text>
      </Box>,
    );

    expect(getRenderedRoot().querySelector(".box-test")).toHaveClass(
      "seed-box-padding-top",
      "seed-box-padding-bottom",
    );
  });

  it("keeps the style prop inline", () => {
    render(<Box className="box-test" mt="x4" style={{ marginTop: "3px" }} />);

    const box = getRenderedRoot().querySelector(".box-test") as HTMLElement;

    expect(box).toHaveClass("seed-box-margin-top");
    expectStyle(box.style, { "margin-top": "3px" });
  });

  it("rejects margin and bleed props together", () => {
    // @ts-expect-error margin and bleed props both resolve to margin-*.
    render(<Box m="x1" bleedX="8px" />);
  });
});
