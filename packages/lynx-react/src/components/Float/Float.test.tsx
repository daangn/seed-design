import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import type { FloatProps } from "../../index";
import { Float } from "./Float";

function query() {
  const element = elementTree.root?.matches(".seed-float")
    ? elementTree.root
    : elementTree.root?.querySelector(".seed-float");
  if (!element) throw new Error("Missing Float view");
  return element as HTMLElement;
}

function offset(element: HTMLElement, axis: "x" | "y") {
  return Reflect.get(element.style, `--seed-float-offset-${axis}`);
}

describe("Float", () => {
  it("exports all nine React placements and resets offsets when props are removed", () => {
    const placements: FloatProps["placement"][] = [
      "top-start",
      "top-center",
      "top-end",
      "middle-start",
      "middle-center",
      "middle-end",
      "bottom-start",
      "bottom-center",
      "bottom-end",
    ];
    const { rerender } = render(<Float placement="top-start" offsetX="x4" offsetY="-12px" />);
    expect(offset(query(), "x")).toBe("var(--seed-dimension-x4)");
    expect(offset(query(), "y")).toBe("-12px");
    for (const placement of placements) {
      rerender(<Float placement={placement} />);
      expect(query()).toHaveClass(`seed-float--placement_${placement}`);
      expect(offset(query(), "x")).toBe("0px");
      expect(offset(query(), "y")).toBe("0px");
      expect(query()).not.toHaveAttribute("placement");
      expect(query()).not.toHaveAttribute("offsetX");
    }
  });

  it("forwards native props, children and refs while allowing style overrides", () => {
    const ref = React.createRef();
    const onTap = vi.fn();
    render(
      <Float
        ref={ref}
        placement="bottom-end"
        zIndex={3}
        className="custom-float"
        style={{ zIndex: 7, bottom: "20px" }}
        accessibility-label="Floating content"
        bindtap={onTap}
      >
        <text>Content</text>
      </Float>,
    );
    expect(ref.current).not.toBeNull();
    expect(query()).toHaveClass("custom-float");
    expect(query()).toHaveTextContent("Content");
    expect(query()).toHaveAttribute("accessibility-label", "Floating content");
    expect(query().style.zIndex).toBe("7");
    expect(query().style.bottom).toBe("20px");
    fireEvent(query(), new Event("bindEvent:tap"));
    expect(onTap).toHaveBeenCalledOnce();
  });

  it("requires placement and excludes the web-only polymorphic prop", () => {
    // @ts-expect-error placement is required, just as in React.
    const missingPlacement = <Float />;
    // @ts-expect-error Lynx Float always renders a native view.
    const polymorphic = <Float placement="top-start" as="div" />;
    expect(missingPlacement).toBeDefined();
    expect(polymorphic).toBeDefined();
  });
});
