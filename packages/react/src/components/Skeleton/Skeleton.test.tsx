import { vars } from "@seed-design/css/vars";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { createRef } from "react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it.each(["t4", "t4Static"] as const)("resolves lineHeight.%s", (token) => {
    const { getByTestId } = render(
      <Skeleton data-testid="skeleton" height={`lineHeight.${token}`} />,
    );

    expect(getByTestId("skeleton").style.getPropertyValue("--seed-box-height-base")).toBe(
      vars.$lineHeight[token],
    );
  });

  it("supports line-height and dimension tokens in responsive heights", () => {
    const { getByTestId } = render(
      <Skeleton
        data-testid="skeleton"
        height={{ base: "lineHeight.t4", sm: undefined, md: "lineHeight.t5", lg: "x8" }}
      />,
    );
    const { style } = getByTestId("skeleton");

    expect(style.getPropertyValue("--seed-box-height-base")).toBe(vars.$lineHeight.t4);
    expect(style.getPropertyValue("--seed-box-height-sm")).toBe("");
    expect(style.getPropertyValue("--seed-box-height-md")).toBe(vars.$lineHeight.t5);
    expect(style.getPropertyValue("--seed-box-height-lg")).toBe(vars.$dimension.x8);
  });

  it.each([
    [undefined, ""],
    ["x4", vars.$dimension.x4],
    ["24px", "24px"],
    ["var(--custom-height)", "var(--custom-height)"],
    ["lineHeight.invalid", "lineHeight.invalid"],
    ["lineHeight.constructor", "lineHeight.constructor"],
  ])("preserves existing height %s", (height, expected) => {
    const { getByTestId } = render(<Skeleton data-testid="skeleton" height={height} />);

    expect(getByTestId("skeleton").style.getPropertyValue("--seed-box-height-base")).toBe(expected);
  });

  it("preserves styles, className and ref with asChild", () => {
    const ref = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Skeleton
        ref={ref}
        asChild
        height="lineHeight.t4"
        width="x8"
        className="custom"
        style={{ height: "32px" }}
      >
        <div data-testid="skeleton" />
      </Skeleton>,
    );
    const element = getByTestId("skeleton");

    expect(ref.current).toBe(element);
    expect(element).toHaveClass("custom");
    expect(element.style.height).toBe("32px");
    expect(element.style.getPropertyValue("--seed-box-width-base")).toBe(vars.$dimension.x8);
    expect(element).not.toHaveAttribute("height");
  });
});
