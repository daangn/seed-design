import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { ScrollFog, type ScrollFogProps } from "./ScrollFog";

type Edge = "top" | "bottom" | "left" | "right";

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

function expectEdgeVariant(container: HTMLElement, edge: Edge, enabled: boolean): void {
  expect(getMask(container, edge)).toHaveClass(`seed-scroll-fog__${edge}Mask--${edge}_${enabled}`);
}

describe("ScrollFog", () => {
  it("exposes view props and accepts edges from one scroll axis only", () => {
    type MainThreadProp = Extract<keyof ScrollFogProps, `main-thread:${string}`>;
    type Placement = NonNullable<ScrollFogProps["placement"]>;

    expectTypeOf<MainThreadProp>().toEqualTypeOf<never>();
    expectTypeOf<ScrollFogProps>().toHaveProperty("bindtap");
    expectTypeOf<ScrollFogProps>().not.toHaveProperty("hideScrollBar");
    expectTypeOf<["top", "bottom"]>().toExtend<Placement>();
    expectTypeOf<["left", "right"]>().toExtend<Placement>();
    expectTypeOf<["top", "left"]>().not.toExtend<Placement>();
  });

  it("wraps children in the default top and bottom masks without rendering a scroll host", () => {
    const { container } = render(
      <ScrollFog>
        <scroll-view scroll-orientation="vertical">
          <text>Content</text>
        </scroll-view>
      </ScrollFog>,
    );
    const root = getRoot(container);
    const bottomMask = getMask(container, "bottom");

    expect(root).toHaveClass("seed-scroll-fog__root", "seed-scroll-fog__root--top_true");
    expect(root).toHaveClass("seed-scroll-fog__root--bottom_true");
    expectEdgeVariant(container, "top", true);
    expectEdgeVariant(container, "bottom", true);
    expect(getMasks(container)).toHaveLength(2);
    expect(root.querySelectorAll("scroll-view")).toHaveLength(1);
    expect(bottomMask.firstElementChild?.tagName.toLowerCase()).toBe("scroll-view");

    for (const element of root.querySelectorAll("view")) {
      expect(element).not.toHaveAttribute("style");
    }
  });

  it("renders only the selected edges of the horizontal axis", () => {
    const { container } = render(<ScrollFog placement={["left", "right"]} />);

    expectEdgeVariant(container, "left", true);
    expectEdgeVariant(container, "right", true);
    expect(container.querySelector(".seed-scroll-fog__topMask")).not.toBeInTheDocument();
    expect(container.querySelector(".seed-scroll-fog__bottomMask")).not.toBeInTheDocument();
    expect(getMasks(container)).toHaveLength(2);
  });

  it("renders the same masks regardless of placement order", () => {
    const ordered = render(<ScrollFog placement={["top", "bottom"]} />);
    const orderedHtml = ordered.container.innerHTML;
    ordered.unmount();

    const reversed = render(<ScrollFog placement={["bottom", "top"]} />);

    expect(reversed.container.innerHTML).toBe(orderedHtml);
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
    expect(root.querySelector(".seed-scroll-fog__topMask")).not.toHaveAttribute("id");
    expect(rootRef.current).not.toBeNull();
    expect(Array.from(root.attributes).some(({ name }) => name.startsWith("react-ref-"))).toBe(
      true,
    );
    for (const mask of getMasks(container)) {
      expect(Array.from(mask.attributes).some(({ name }) => name.startsWith("react-ref-"))).toBe(
        false,
      );
    }

    fireEvent.tap(root);
    expect(bindtap).toHaveBeenCalledTimes(1);
  });

  it("renders one mask for a single edge", () => {
    const { container } = render(<ScrollFog placement={["bottom"]} />);

    expectEdgeVariant(container, "bottom", true);
    expect(getMasks(container)).toHaveLength(1);
  });

  it("renders children directly in the root for an empty placement", () => {
    const { container } = render(
      <ScrollFog placement={[]}>
        <text>Content</text>
      </ScrollFog>,
    );
    const root = getRoot(container);

    expect(getMasks(container)).toHaveLength(0);
    expect(root.firstElementChild?.tagName.toLowerCase()).toBe("text");
  });
});
