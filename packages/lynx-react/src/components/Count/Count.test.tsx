import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import * as React from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, expectTypeOf, it } from "vitest";

import { Count, type CountProps, isCountElement } from "./Count";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("Count", () => {
  it("renders children in a native text with the marker class, className, style and ref", () => {
    const countRef = createRef<NodesRef>();

    render(
      <Count ref={countRef} className="custom-count" style={{ marginLeft: "2px" }}>
        12
      </Count>,
    );

    const count = getRenderedRoot().querySelector(".seed-count");

    expect(count?.tagName.toLowerCase()).toBe("text");
    expect(count).toHaveClass("seed-count", "custom-count");
    expect(count).toHaveStyle({ marginLeft: "2px" });
    expect(count?.textContent).toBe("12");
    expect(countRef.current).not.toBeNull();
  });

  it("exposes native text props", () => {
    expectTypeOf<CountProps>().toHaveProperty("id");
    expectTypeOf<CountProps>().toHaveProperty("text-maxline");
  });
});

describe("isCountElement", () => {
  it("identifies only direct Count elements", () => {
    const CountWrapper = () => <Count>12</Count>;

    expect(isCountElement(<Count>12</Count>)).toBe(true);
    expect(isCountElement("12")).toBe(false);
    expect(isCountElement(12)).toBe(false);
    expect(isCountElement(null)).toBe(false);
    expect(isCountElement(<text>12</text>)).toBe(false);
    expect(isCountElement(<CountWrapper />)).toBe(false);
    expect(
      isCountElement(
        <>
          <Count>12</Count>
        </>,
      ),
    ).toBe(false);
  });

  it("keeps identifying Count after cloneElement", () => {
    expect(isCountElement(React.cloneElement(<Count>12</Count>, { className: "cloned" }))).toBe(
      true,
    );
  });
});
