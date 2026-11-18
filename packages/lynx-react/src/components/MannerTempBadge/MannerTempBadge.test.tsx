import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import { MannerTempBadge } from "./MannerTempBadge";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("MannerTempBadge", () => {
  it("renders the label with the selected level and preserves className", () => {
    render(
      <MannerTempBadge className="custom-manner-temp-badge" level="l10">
        80°C
      </MannerTempBadge>,
    );

    const root = getRenderedRoot();
    const { getByText } = getQueriesForElement(root);
    const badgeRoot = root.querySelector(".seed-manner-temp-badge__root");
    const label = getByText("80°C");

    expect(badgeRoot).toHaveClass("custom-manner-temp-badge");
    expect(badgeRoot).toHaveClass("seed-manner-temp-badge__root--level_l10");
    expect(label).toHaveClass("seed-manner-temp-badge__label");
    expect(label).toHaveClass("seed-manner-temp-badge__label--level_l10");
  });

  it("defaults to l1 and keeps the ref and native props on the root", () => {
    const rootRef = createRef<NodesRef>();

    render(
      <MannerTempBadge
        ref={rootRef}
        accessibility-label="매너온도 36.5도"
        style={{ marginTop: "4px" }}
      >
        36.5°C
      </MannerTempBadge>,
    );

    const root = getRenderedRoot();
    const badgeRoot = root.querySelector(".seed-manner-temp-badge__root");
    const label = getQueriesForElement(root).getByText("36.5°C");

    expect(badgeRoot).toHaveClass("seed-manner-temp-badge__root--level_l1");
    expect(label).toHaveClass("seed-manner-temp-badge__label--level_l1");
    expect(badgeRoot).toHaveAttribute("accessibility-label", "매너온도 36.5도");
    expect(badgeRoot).toHaveStyle({ marginTop: "4px" });
    expect(rootRef.current).not.toBeNull();
    expect(
      Array.from(badgeRoot?.attributes ?? []).some(({ name }) => name.startsWith("react-ref-")),
    ).toBe(true);
    expect(Array.from(label.attributes).some(({ name }) => name.startsWith("react-ref-"))).toBe(
      false,
    );
  });

  it("forwards native view props and invokes the supplied tap handler", () => {
    const onTap = vi.fn();
    function handleMainThreadTap() {
      "main thread";
    }

    render(
      <>
        <MannerTempBadge
          id="temperature-badge"
          bindtap={onTap}
          accessibility-label="매너온도"
          data-foo="native-value"
        >
          36.5°C
        </MannerTempBadge>
        <MannerTempBadge main-thread:bindtap={handleMainThreadTap}>40°C</MannerTempBadge>
      </>,
    );

    const badgeRoot = getRenderedRoot().querySelector(".seed-manner-temp-badge__root");

    expect(badgeRoot).toHaveAttribute("id", "temperature-badge");
    expect(badgeRoot).toHaveAttribute("accessibility-label", "매너온도");
    expect(badgeRoot).toHaveAttribute("data-foo", "native-value");
    fireEvent.tap(badgeRoot as Element);
    expect(onTap).toHaveBeenCalledTimes(1);
  });
});
