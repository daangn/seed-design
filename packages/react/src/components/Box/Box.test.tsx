import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { Box } from "./Box";

describe("Box safeArea", () => {
  it("resolves pl and pr to the inline safe area insets", () => {
    render(<Box data-testid="box" pl="safeArea" pr="safeArea" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-padding-left-base")).toBe(
      "var(--seed-safe-area-left)",
    );
    expect(style.getPropertyValue("--seed-box-padding-right-base")).toBe(
      "var(--seed-safe-area-right)",
    );
  });

  it("keeps resolving other pl and pr values as dimensions", () => {
    render(<Box data-testid="box" pl="spacingX.globalGutter" pr="x4" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-padding-left-base")).toBe(
      "var(--seed-dimension-spacing-x-global-gutter)",
    );
    expect(style.getPropertyValue("--seed-box-padding-right-base")).toBe(
      "var(--seed-dimension-x4)",
    );
  });

  it("resolves safeArea per breakpoint", () => {
    render(<Box data-testid="box" pl={{ base: "safeArea", md: "x4" }} />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-padding-left-base")).toBe(
      "var(--seed-safe-area-left)",
    );
    expect(style.getPropertyValue("--seed-box-padding-left-md")).toBe("var(--seed-dimension-x4)");
  });

  it("prefers paddingLeft over pl", () => {
    render(<Box data-testid="box" paddingLeft="safeArea" pl="x4" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-padding-left-base")).toBe(
      "var(--seed-safe-area-left)",
    );
  });

  it("resolves directional bleed to the safe area inset and its negative margin", () => {
    render(<Box data-testid="box" bleedLeft="safeArea" bleedTop="safeArea" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-bleed-left-base")).toBe("var(--seed-safe-area-left)");
    expect(style.getPropertyValue("--seed-box-margin-left-base")).toBe(
      "calc(var(--seed-safe-area-left) * -1)",
    );
    expect(style.getPropertyValue("--seed-box-bleed-top-base")).toBe("var(--seed-safe-area-top)");
    expect(style.getPropertyValue("--seed-box-margin-top-base")).toBe(
      "calc(var(--seed-safe-area-top) * -1)",
    );
  });

  it("resolves bleedX and bleedY to each side's own inset", () => {
    render(<Box data-testid="box" bleedX="safeArea" bleedY="safeArea" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-bleed-left-base")).toBe("var(--seed-safe-area-left)");
    expect(style.getPropertyValue("--seed-box-bleed-right-base")).toBe(
      "var(--seed-safe-area-right)",
    );
    expect(style.getPropertyValue("--seed-box-margin-right-base")).toBe(
      "calc(var(--seed-safe-area-right) * -1)",
    );
    expect(style.getPropertyValue("--seed-box-bleed-top-base")).toBe("var(--seed-safe-area-top)");
    expect(style.getPropertyValue("--seed-box-bleed-bottom-base")).toBe(
      "var(--seed-safe-area-bottom)",
    );
  });

  it("lets a directional bleed override bleed", () => {
    render(<Box data-testid="box" bleed="safeArea" bleedBottom="x4" />);
    const { style } = screen.getByTestId("box");

    expect(style.getPropertyValue("--seed-box-bleed-top-base")).toBe("var(--seed-safe-area-top)");
    expect(style.getPropertyValue("--seed-box-bleed-left-base")).toBe("var(--seed-safe-area-left)");
    expect(style.getPropertyValue("--seed-box-bleed-bottom-base")).toBe("var(--seed-dimension-x4)");
  });
});
