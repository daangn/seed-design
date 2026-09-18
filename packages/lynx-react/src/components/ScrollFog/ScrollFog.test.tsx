import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { ScrollFog, type ScrollFogProps } from "./ScrollFog";

type Edge = "top" | "bottom" | "left" | "right";

const EDGES: Edge[] = ["top", "bottom", "left", "right"];

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.firstElementChild;
  if (!root || root.tagName.toLowerCase() !== "view") {
    throw new Error("root view가 렌더되어야 합니다.");
  }
  return root as HTMLElement;
}

function getMask(container: HTMLElement, edge: Edge): HTMLElement {
  const mask = container.querySelector<HTMLElement>(`.seed-scroll-fog__${edge}Mask`);
  if (!mask) {
    throw new Error(`${edge} mask view가 렌더되어야 합니다.`);
  }
  return mask;
}

function getMasks(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[class*="seed-scroll-fog__"][class*="Mask"]'),
  );
}

function getScrollViews(container: HTMLElement): [HTMLElement, HTMLElement] {
  const vertical = container.querySelector<HTMLElement>(".seed-scroll-fog__verticalScroll");
  const horizontal = container.querySelector<HTMLElement>(".seed-scroll-fog__horizontalScroll");
  if (!vertical || !horizontal) {
    throw new Error("vertical 및 horizontal scroll-view가 렌더되어야 합니다.");
  }
  return [vertical, horizontal];
}

function expectEdgeVariant(container: HTMLElement, edge: Edge, enabled: boolean): void {
  expect(getMask(container, edge)).toHaveClass(`seed-scroll-fog__${edge}Mask--${edge}_${enabled}`);
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

  it("renders the default mask and scroll slots without internal inline styles", () => {
    const { container } = render(<ScrollFog />);
    const root = getRoot(container);
    const [vertical, horizontal] = getScrollViews(container);

    expect(root).toHaveClass("seed-scroll-fog__root", "seed-scroll-fog__root--top_true");
    expect(root).toHaveClass("seed-scroll-fog__root--bottom_true");
    expectEdgeVariant(container, "top", true);
    expectEdgeVariant(container, "bottom", true);
    expect(getMasks(container)).toHaveLength(2);
    expect(vertical).toContainElement(horizontal);

    for (const element of root.querySelectorAll("view, scroll-view")) {
      expect(element).not.toHaveAttribute("style");
    }
  });

  it("renders only the selected masks for an arbitrary placement", () => {
    const { container } = render(<ScrollFog placement={["bottom", "left"]} />);

    expectEdgeVariant(container, "bottom", true);
    expectEdgeVariant(container, "left", true);
    expect(container.querySelector(".seed-scroll-fog__topMask")).not.toBeInTheDocument();
    expect(container.querySelector(".seed-scroll-fog__rightMask")).not.toBeInTheDocument();
    expect(getMasks(container)).toHaveLength(2);
  });

  it("sets inherited edge-size variables and keeps the truthy zero fallback", () => {
    const { container } = render(
      <ScrollFog size="1.5rem" sizes={{ top: 12, bottom: 0, left: 32, right: 0 }} />,
    );
    const rootStyle = getRoot(container).style as CSSStyleDeclaration &
      Record<`--${string}`, string>;

    expect(rootStyle["--scroll-fog-size-top"]).toBe("12px");
    expect(rootStyle["--scroll-fog-size-bottom"]).toBe("1.5rem");
    expect(rootStyle["--scroll-fog-size-left"]).toBe("32px");
    expect(rootStyle["--scroll-fog-size-right"]).toBe("1.5rem");
  });

  it("keeps computed sizes ahead of conflicting object styles", () => {
    const { container } = render(
      <ScrollFog
        size="24px"
        sizes={{ top: 12 }}
        style={
          {
            "--scroll-fog-size-top": "99px",
            "--scroll-fog-size-bottom": "88px",
            height: "100px",
          } as ScrollFogProps["style"]
        }
      />,
    );
    const rootStyle = getRoot(container).style as CSSStyleDeclaration &
      Record<`--${string}`, string>;

    expect(rootStyle["--scroll-fog-size-top"]).toBe("12px");
    expect(rootStyle["--scroll-fog-size-bottom"]).toBe("24px");
    expect(rootStyle.height).toBe("100px");
  });

  it("keeps computed sizes ahead of conflicting string styles", () => {
    const { container } = render(
      <ScrollFog
        size="2rem"
        sizes={{ right: 32 }}
        style="--scroll-fog-size-left: 77px; --scroll-fog-size-right: 66px; width: 80px"
      />,
    );
    const rootStyle = getRoot(container).style as CSSStyleDeclaration &
      Record<`--${string}`, string>;

    expect(rootStyle.getPropertyValue("--scroll-fog-size-left")).toBe("2rem");
    expect(rootStyle.getPropertyValue("--scroll-fog-size-right")).toBe("32px");
    expect(rootStyle.width).toBe("80px");
  });

  it("keeps two nested scroll axes and controls both native scrollbars", () => {
    const visible = render(<ScrollFog />);
    const [visibleVertical, visibleHorizontal] = getScrollViews(visible.container);

    expect(visibleVertical).toHaveAttribute("scroll-orientation", "vertical");
    expect(visibleHorizontal).toHaveAttribute("scroll-orientation", "horizontal");
    expect(visibleVertical).toHaveAttribute("enable-nested-scroll", "true");
    expect(visibleHorizontal).toHaveAttribute("enable-nested-scroll", "true");
    expect(visibleVertical).toHaveAttribute("scroll-bar-enable", "true");
    expect(visibleHorizontal).toHaveAttribute("scroll-bar-enable", "true");
    expect(visibleVertical).toContainElement(visibleHorizontal);
    visible.unmount();

    const hidden = render(<ScrollFog hideScrollBar />);
    for (const scrollView of getScrollViews(hidden.container)) {
      expect(scrollView).toHaveAttribute("scroll-bar-enable", "false");
    }
  });

  it("forwards root props, merges class and style, and keeps children and ref on the root", () => {
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
    expect(root).toHaveClass("seed-scroll-fog__root", "custom-scroll");
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

  it("renders all four masks in canonical order regardless of placement order", () => {
    const { container } = render(<ScrollFog placement={["right", "left", "bottom", "top"]} />);

    for (const edge of EDGES) {
      expectEdgeVariant(container, edge, true);
    }
    expect(getMasks(container).map(({ classList }) => classList.item(0))).toEqual(
      EDGES.map((edge) => `seed-scroll-fog__${edge}Mask`),
    );
  });

  it("renders one mask for a single edge", () => {
    const { container } = render(<ScrollFog placement={["right"]} />);

    expectEdgeVariant(container, "right", true);
    expect(getMasks(container)).toHaveLength(1);
  });

  it("renders the scroll views without a mask wrapper for an empty placement", () => {
    const { container } = render(<ScrollFog placement={[]} />);
    const root = getRoot(container);
    const [vertical, horizontal] = getScrollViews(container);

    expect(getMasks(container)).toHaveLength(0);
    expect(root.firstElementChild).toBe(vertical);
    expect(vertical).toContainElement(horizontal);
  });
});
