import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { ScrollFog, type ScrollFogProps } from "./ScrollFog";

type Edge = "top" | "bottom" | "left" | "right";

const ROOTAGE_STOPS = [
  { color: "#00000000", position: 0 },
  { color: "#00000003", position: 0.08 },
  { color: "#00000005", position: 0.16 },
  { color: "#0000000d", position: 0.22 },
  { color: "#00000014", position: 0.29 },
  { color: "#00000021", position: 0.35 },
  { color: "#0000002e", position: 0.41 },
  { color: "#00000040", position: 0.47 },
  { color: "#00000052", position: 0.53 },
  { color: "#00000066", position: 0.59 },
  { color: "#0000007a", position: 0.65 },
  { color: "#00000094", position: 0.71 },
  { color: "#000000ab", position: 0.78 },
  { color: "#000000c7", position: 0.84 },
  { color: "#000000e3", position: 0.92 },
  { color: "#000000ff", position: 1 },
] as const;

const DIRECTIONS: Record<Edge, string> = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
};

const OPAQUE_MASK = "linear-gradient(#000000ff, #000000ff)";

function buildExpectedGradient(edge: Edge) {
  const stops = ROOTAGE_STOPS.map(
    ({ color, position }) => `${color} ${Number((position * 100).toFixed(6))}%`,
  ).join(", ");

  return `linear-gradient(${DIRECTIONS[edge]}, ${stops})`;
}

function normalizeMaskImage(container: HTMLElement, value: string): string {
  const element = container.ownerDocument.createElement("view");
  element.style.maskImage = value;
  return element.style.maskImage;
}

function expectedMaskSize(edge: Edge, size: string) {
  return edge === "top" || edge === "bottom"
    ? `100% ${size}, 100% calc(100% - ${size})`
    : `${size} 100%, calc(100% - ${size}) 100%`;
}

function renderWithMaskSizeAssignments(ui: Parameters<typeof render>[0]) {
  const stylePrototype = Object.getPrototypeOf(
    document.documentElement.style,
  ) as CSSStyleDeclaration;
  const maskSizeSetter = vi.spyOn(stylePrototype, "maskSize", "set");

  try {
    const result = render(ui);
    const maskSizes = maskSizeSetter.mock.calls.map(([value]) => value);
    return { ...result, maskSizes };
  } finally {
    maskSizeSetter.mockRestore();
  }
}

function expectEnabledMask(container: HTMLElement, edge: Edge) {
  const mask = getMask(container, edge);
  const opaquePosition =
    edge === "top" ? "bottom" : edge === "bottom" ? "top" : edge === "left" ? "right" : "left";

  expect(mask.style.maskImage).toBe(
    normalizeMaskImage(container, `${buildExpectedGradient(edge)}, ${OPAQUE_MASK}`),
  );
  expect(mask.style.maskPosition).toBe(`${edge}, ${opaquePosition}`);
  expect(mask.style.maskRepeat).toBe("no-repeat");
}

function expectOpaqueMask(container: HTMLElement, edge: Edge) {
  const mask = getMask(container, edge);

  expect(mask.style.maskImage).toBe(normalizeMaskImage(container, OPAQUE_MASK));
  expect(mask.style.maskPosition).toBe("top left");
  expect(mask.style.maskRepeat).toBe("no-repeat");
  expect(mask.style.maskSize).toBe("100% 100%");
}

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.firstElementChild;
  if (!root || root.tagName.toLowerCase() !== "view") {
    throw new Error("root view가 렌더되어야 합니다.");
  }
  return root as HTMLElement;
}

function getMask(container: HTMLElement, edge: Edge): HTMLElement {
  const index = (Object.keys(DIRECTIONS) as Edge[]).indexOf(edge);
  const mask = container.querySelectorAll("view").item(index + 1);
  if (!mask) {
    throw new Error(`${edge} mask view가 렌더되어야 합니다.`);
  }
  return mask as unknown as HTMLElement;
}

function getScrollViews(container: HTMLElement): [HTMLElement, HTMLElement] {
  const scrollViews = Array.from(container.querySelectorAll("scroll-view"));
  if (scrollViews.length !== 2) {
    throw new Error("vertical 및 horizontal scroll-view가 렌더되어야 합니다.");
  }
  return scrollViews as [HTMLElement, HTMLElement];
}

describe("ScrollFog", () => {
  it("exposes view props without native scroll-view or main-thread props", () => {
    type MainThreadProp = Extract<keyof ScrollFogProps, `main-thread:${string}`>;
    type ScrollViewOnlyProp = Extract<
      keyof ScrollFogProps,
      "bounces" | "bindscroll" | "fading-edge-length" | "scroll-orientation"
    >;

    expectTypeOf<MainThreadProp>().toEqualTypeOf<never>();
    expectTypeOf<ScrollViewOnlyProp>().toEqualTypeOf<never>();
    expectTypeOf<ScrollFogProps>().toHaveProperty("bindtap");
  });

  it("renders the default top and bottom Rootage masks with a 20px size", () => {
    const { container, maskSizes } = renderWithMaskSizeAssignments(<ScrollFog />);

    expectEnabledMask(container, "top");
    expectEnabledMask(container, "bottom");
    expectOpaqueMask(container, "left");
    expectOpaqueMask(container, "right");
    expect(maskSizes).toEqual([
      expectedMaskSize("top", "20px"),
      expectedMaskSize("bottom", "20px"),
      "100% 100%",
      "100% 100%",
    ]);
  });

  it("supports arbitrary and four-direction placements", () => {
    const arbitrary = renderWithMaskSizeAssignments(<ScrollFog placement={["bottom", "left"]} />);

    expectOpaqueMask(arbitrary.container, "top");
    expectEnabledMask(arbitrary.container, "bottom");
    expectEnabledMask(arbitrary.container, "left");
    expectOpaqueMask(arbitrary.container, "right");
    expect(arbitrary.maskSizes).toEqual([
      "100% 100%",
      expectedMaskSize("bottom", "20px"),
      expectedMaskSize("left", "20px"),
      "100% 100%",
    ]);
    arbitrary.unmount();

    const allDirections = renderWithMaskSizeAssignments(
      <ScrollFog placement={["top", "bottom", "left", "right"]} />,
    );
    for (const edge of Object.keys(DIRECTIONS) as Edge[]) {
      expectEnabledMask(allDirections.container, edge);
    }
    expect(allDirections.maskSizes).toEqual(
      (Object.keys(DIRECTIONS) as Edge[]).map((edge) => expectedMaskSize(edge, "20px")),
    );
  });

  it("converts numeric sizes to px and preserves string sizes", () => {
    const numeric = renderWithMaskSizeAssignments(<ScrollFog placement={["top"]} size={32} />);
    expectEnabledMask(numeric.container, "top");
    expect(numeric.maskSizes[0]).toBe(expectedMaskSize("top", "32px"));
    numeric.unmount();

    const string = renderWithMaskSizeAssignments(<ScrollFog placement={["top"]} size="1.5rem" />);
    expectEnabledMask(string.container, "top");
    expect(string.maskSizes[0]).toBe(expectedMaskSize("top", "1.5rem"));
  });

  it("applies edge size overrides and falls back to the global size for zero", () => {
    const { container, maskSizes } = renderWithMaskSizeAssignments(
      <ScrollFog
        placement={["top", "bottom", "left", "right"]}
        size={40}
        sizes={{ top: 12, left: 0 }}
      />,
    );

    expectEnabledMask(container, "top");
    expectEnabledMask(container, "bottom");
    expectEnabledMask(container, "left");
    expectEnabledMask(container, "right");
    expect(maskSizes).toEqual([
      expectedMaskSize("top", "12px"),
      expectedMaskSize("bottom", "40px"),
      expectedMaskSize("left", "40px"),
      expectedMaskSize("right", "40px"),
    ]);
  });

  it("keeps mask layers out of hit testing and both scroll axes interactive", () => {
    const { container } = render(<ScrollFog />);
    const masks = (Object.keys(DIRECTIONS) as Edge[]).map((edge) => getMask(container, edge));
    const [vertical, horizontal] = getScrollViews(container);

    expect(masks).toHaveLength(4);
    for (const mask of masks) {
      expect(mask).toHaveStyle({ pointerEvents: "none" });
    }
    expect(vertical).toHaveStyle({ pointerEvents: "auto" });
    expect(horizontal).toHaveStyle({ pointerEvents: "auto" });
    expect(vertical).toHaveStyle({ width: "100%", height: "100%" });
    expect(horizontal).toHaveStyle({ width: "100%" });
    expect(horizontal).not.toHaveStyle({ height: "100%" });
    expect(vertical).toHaveAttribute("scroll-orientation", "vertical");
    expect(horizontal).toHaveAttribute("scroll-orientation", "horizontal");
    expect(vertical).toContainElement(horizontal);
  });

  it("shows or hides both native scrollbars", () => {
    const visible = render(<ScrollFog />);
    for (const scrollView of getScrollViews(visible.container)) {
      expect(scrollView).toHaveAttribute("scroll-bar-enable", "true");
      expect(scrollView).not.toHaveAttribute("fading-edge-length");
    }
    visible.unmount();

    const hidden = render(<ScrollFog hideScrollBar />);
    for (const scrollView of getScrollViews(hidden.container)) {
      expect(scrollView).toHaveAttribute("scroll-bar-enable", "false");
    }
  });

  it("forwards class, style, allowed view props, events, and ref to the root view", () => {
    const bindtap = vi.fn();
    const rootRef = createRef<NodesRef>();
    const { container } = render(
      <ScrollFog
        ref={rootRef}
        id="scroll-fog"
        accessibility-label="Scrollable content"
        className="custom-scroll"
        style={{ height: "100px" }}
        bindtap={bindtap}
      >
        <text>Content</text>
      </ScrollFog>,
    );

    const root = getRoot(container);
    expect(root).toHaveAttribute("id", "scroll-fog");
    expect(root).toHaveAttribute("accessibility-label", "Scrollable content");
    expect(root).toHaveClass("custom-scroll");
    expect(root).toHaveStyle({ height: "100px" });
    expect(root.querySelector("text")?.textContent).toBe("Content");
    expect(root.querySelector("scroll-view")).not.toHaveAttribute("id");
    expect(rootRef.current).not.toBeNull();
    expect(Array.from(root.attributes).some(({ name }) => name.startsWith("react-ref-"))).toBe(
      true,
    );
    for (const scrollView of getScrollViews(container)) {
      expect(
        Array.from(scrollView.attributes).some(({ name }) => name.startsWith("react-ref-")),
      ).toBe(false);
    }

    fireEvent.tap(root);
    expect(bindtap).toHaveBeenCalledTimes(1);
  });
});
