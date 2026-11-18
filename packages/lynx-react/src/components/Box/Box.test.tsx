import "@testing-library/jest-dom";
import { createRef, type ReactNode } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { SafeAreaProvider, type SafeAreaInsets } from "@seed-design/lynx-react-use-safe-area";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Text } from "../Text";
import { Box } from "./Box";

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

function safeAreaWrapper(insets: Partial<SafeAreaInsets>) {
  return ({ children }: { children?: ReactNode }) => (
    <SafeAreaProvider insets={{ top: 0, right: 0, bottom: 0, left: 0, ...insets }}>
      {children}
    </SafeAreaProvider>
  );
}

describe("Box", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves top and bottom safe area padding from SafeAreaProvider", () => {
    render(
      <Box className="box-test" pt="safeArea" pb="safeArea">
        <Text>Box content</Text>
      </Box>,
      { wrapper: safeAreaWrapper({ top: 47, bottom: 34 }) },
    );

    const box = getRenderedRoot().querySelector(".box-test");

    expect(box).toBeInTheDocument();
    expectStyle((box as HTMLElement).style, {
      "padding-top": "47px",
      "padding-bottom": "34px",
    });
  });

  it("resolves left and right safe area padding from SafeAreaProvider", () => {
    render(
      <Box className="box-test" pl="safeArea" pr="safeArea">
        <Text>Box content</Text>
      </Box>,
      { wrapper: safeAreaWrapper({ right: 62, left: 59 }) },
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

  it("negates safe area bleed from SafeAreaProvider", () => {
    render(<Box className="box-test" bleedX="safeArea" />, {
      wrapper: safeAreaWrapper({ right: 62, left: 59 }),
    });

    const box = getRenderedRoot().querySelector(".box-test");

    expectStyle((box as HTMLElement).style, {
      "margin-left": "calc(-59px)",
      "margin-right": "calc(-62px)",
    });
  });

  it("negates zero insets when no SafeAreaProvider is present", () => {
    render(<Box className="box-test" bleedX="safeArea" />);

    const box = getRenderedRoot().querySelector(".box-test");

    // happy-dom folds the constant `calc(0px * -1)` that Box emits.
    expectStyle((box as HTMLElement).style, {
      "margin-left": "calc(0px)",
      "margin-right": "calc(0px)",
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
