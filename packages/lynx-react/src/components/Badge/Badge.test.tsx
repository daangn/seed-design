import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Badge from "./Badge.namespace";

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("Badge", () => {
  it("renders label text in the label slot with default variant classes", () => {
    render(
      <Badge.Root>
        <Badge.Label>거래중</Badge.Label>
      </Badge.Root>,
    );

    const { getByText } = getRenderedQueries();
    const root = getRenderedRoot();
    const badgeRoot = root.querySelector(".seed-badge__root");
    const label = getByText("거래중");

    expect(badgeRoot).toBeInTheDocument();
    expect(badgeRoot).toHaveClass("seed-badge__root--size_medium");
    expect(badgeRoot).toHaveClass("seed-badge__root--variant_solid");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_neutral");
    expect(label).toHaveClass("seed-badge__label");
  });

  it("applies variant classes and preserves user className", () => {
    render(
      <Badge.Root className="custom-badge" size="large" variant="outline" tone="brand">
        <Badge.Label>추천</Badge.Label>
      </Badge.Root>,
    );

    const root = getRenderedRoot();
    const badgeRoot = root.querySelector(".seed-badge__root");

    expect(badgeRoot).toBeInTheDocument();
    expect(badgeRoot).toHaveClass("custom-badge");
    expect(badgeRoot).toHaveClass("seed-badge__root--size_large");
    expect(badgeRoot).toHaveClass("seed-badge__root--variant_outline");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_brand");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_brand-variant_outline");
  });

  it("renders the prefix slot class", () => {
    render(
      <Badge.Root>
        <Badge.Prefix>인증</Badge.Prefix>
        <Badge.Label>판매자</Badge.Label>
      </Badge.Root>,
    );

    const prefix = getRenderedRoot().querySelector(".seed-badge__prefix");

    expect(prefix).toHaveTextContent("인증");
    expect(prefix).toHaveClass("seed-badge__prefix");
  });

  it("renders the action slot and handles press interactions", () => {
    const onTap = vi.fn();

    render(
      <Badge.Root>
        <Badge.Label>알림</Badge.Label>
        <Badge.Action bindtap={onTap}>닫기</Badge.Action>
      </Badge.Root>,
    );

    const action = getRenderedRoot().querySelector(".seed-badge__action");

    expect(action).toHaveTextContent("닫기");
    expect(action).toHaveClass("seed-badge__action");

    fireEvent.touchstart(action as HTMLElement, {});
    expect(action).toHaveClass("seed-badge__action--pressed_true");

    fireEvent.tap(action as HTMLElement);
    expect(onTap).toHaveBeenCalledOnce();
    expect(action).toHaveClass("seed-badge__action--pressed_false");
  });

  it("renders a prefix and action together", () => {
    render(
      <Badge.Root>
        <Badge.Prefix>인증</Badge.Prefix>
        <Badge.Action>닫기</Badge.Action>
      </Badge.Root>,
    );

    expect(getRenderedRoot().querySelector(".seed-badge__prefix")).toHaveTextContent("인증");
    expect(getRenderedRoot().querySelector(".seed-badge__action")).toHaveTextContent("닫기");
  });
});
