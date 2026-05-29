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
});
