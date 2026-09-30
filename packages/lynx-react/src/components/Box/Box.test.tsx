import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
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

  it("keeps token styles, user overrides, native props, ref, and taps on the root view", () => {
    const ref = createRef<NodesRef>();
    const onTap = vi.fn();

    render(
      <Box
        ref={ref}
        id="box-root"
        className="box-test"
        accessibility-element
        accessibility-label="요약 카드"
        bindtap={onTap}
        p="x3"
        borderRadius="r3"
        style={{ paddingLeft: "24px" }}
      >
        <Text>Box content</Text>
      </Box>,
    );

    const box = getRenderedRoot().querySelector("#box-root") as HTMLElement;

    expect(box.tagName.toLowerCase()).toBe("view");
    expect(box).toHaveClass("box-test");
    expect(box).toHaveAttribute("accessibility-label", "요약 카드");
    expectStyle(box.style, {
      "padding-top": "var(--seed-dimension-x3)",
      "padding-right": "var(--seed-dimension-x3)",
      "padding-left": "24px",
      "border-radius": "var(--seed-radius-r3)",
    });
    expect(box).toHaveTextContent("Box content");
    expect(ref.current).not.toBeNull();
    expect(Array.from(box.attributes).some(({ name }) => name.startsWith("react-ref-"))).toBe(true);

    fireEvent.tap(box);

    expect(onTap).toHaveBeenCalledTimes(1);
  });
});
