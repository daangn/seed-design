import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { vars } from "@seed-design/lynx-css/vars";
import { describe, expect, expectTypeOf, it } from "vitest";

import { Skeleton, type SkeletonProps } from "./Skeleton";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getSkeletonRoot() {
  const root = getRenderedRoot().querySelector<HTMLElement>(".seed-skeleton__root");

  if (!root) {
    throw new Error("Expected Skeleton root to exist.");
  }

  return root;
}

describe("Skeleton", () => {
  it("renders root and shimmer slots with default variant classes", () => {
    render(<Skeleton />);

    const root = getSkeletonRoot();
    const shimmer = root.querySelector<HTMLElement>(".seed-skeleton__shimmer");

    expect(root.tagName.toLowerCase()).toBe("view");
    expect(root).toHaveClass("seed-skeleton__root--radius_8");
    expect(root).toHaveClass("seed-skeleton__root--tone_neutral");
    expect(shimmer).toBeInTheDocument();
    expect(shimmer?.tagName.toLowerCase()).toBe("view");
    expect(shimmer).toHaveClass("seed-skeleton__shimmer--tone_neutral");
  });

  it("applies radius and tone variants and preserves user className", () => {
    render(<Skeleton className="custom-skeleton" radius="full" tone="magic" />);

    const root = getSkeletonRoot();
    const shimmer = root.querySelector<HTMLElement>(".seed-skeleton__shimmer");

    expect(root).toHaveClass("custom-skeleton");
    expect(root).toHaveClass("seed-skeleton__root--radius_full");
    expect(root).toHaveClass("seed-skeleton__root--tone_magic");
    expect(shimmer).toHaveClass("seed-skeleton__shimmer--tone_magic");
  });

  it("preserves width, height, style, and decorative accessibility semantics", () => {
    render(<Skeleton width="48px" height="16px" style={{ opacity: 0.5 }} />);

    const root = getSkeletonRoot();
    const shimmer = root.querySelector<HTMLElement>(".seed-skeleton__shimmer");

    expect(root).toHaveStyle({ width: "48px", height: "16px", opacity: "0.5" });
    expect(root).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(shimmer).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it.each(["t4", "t4Static"] as const)("resolves height lineHeight.%s", (token) => {
    render(<Skeleton height={`lineHeight.${token}`} />);

    expect(getSkeletonRoot()).toHaveStyle({ height: vars.$lineHeight[token] });
  });

  it.each([
    ["x4", vars.$dimension.x4],
    ["24px", "24px"],
  ])("preserves existing height %s", (height, expected) => {
    render(<Skeleton height={height} />);

    expect(getSkeletonRoot()).toHaveStyle({ height: expected });
  });

  it("lets user style override width and height props and forwards ref to the root", () => {
    const ref = createRef<NodesRef>();

    render(<Skeleton ref={ref} width="x8" height="lineHeight.t4" style={{ height: "32px" }} />);

    expect(getSkeletonRoot()).toHaveStyle({ width: vars.$dimension.x8, height: "32px" });
    expect(ref.current).not.toBeNull();
  });

  it("exposes only static presentation props", () => {
    expectTypeOf<keyof SkeletonProps>().toEqualTypeOf<
      "className" | "style" | "width" | "height" | "radius" | "tone"
    >();
  });
});
