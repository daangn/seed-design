import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import type * as LynxReact from "@lynx-js/react";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { Count } from "../Count";
import { PrefixIcon } from "../Icon";
import { ReactionButton } from "./ReactionButton";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxReact>();

  return {
    ...actual,
    runOnMainThread: () => () => undefined,
  };
});

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getReactionButtonRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-reaction-button__root")) return root;

  const reactionButtonRoot = root.querySelector<HTMLElement>(".seed-reaction-button__root");
  if (!reactionButtonRoot) throw new Error("Expected ReactionButton root to exist.");

  return reactionButtonRoot;
}

const MockIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => {
  const { className, style, ...rest } = props;

  return (
    <image
      {...rest}
      {...(ref ? { "main-thread:ref": ref as React.Ref<MainThread.Element> } : {})}
      className={className}
      style={style}
    />
  );
});
MockIcon.displayName = "MockIcon";

describe("ReactionButton", () => {
  it("composes slots and toggles uncontrolled selected state", () => {
    const onPressedChange = vi.fn();
    render(
      <ReactionButton onPressedChange={onPressedChange}>
        <PrefixIcon icon={<MockIcon />} />
        좋아요
        <Count>12</Count>
      </ReactionButton>,
    );

    const root = getReactionButtonRoot();
    const queries = getQueriesForElement(getRenderedRoot());

    expect(root).toHaveClass("seed-reaction-button__root--size_small");
    expect(root.querySelector(".seed-prefix-icon-slot")).toHaveClass(
      "seed-reaction-button__prefixIcon",
    );
    expect(queries.getByText("좋아요")).toHaveClass("seed-reaction-button__label");
    expect(queries.getByText("12")).toHaveClass("seed-count", "seed-reaction-button__count");

    fireEvent.tap(root);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(getReactionButtonRoot()).toHaveClass("seed-reaction-button__root--selected_true");
    expect(getReactionButtonRoot()).toHaveAttribute("accessibility-traits", "selected");
  });

  it("does not toggle when disabled", () => {
    const onPressedChange = vi.fn();
    render(
      <ReactionButton disabled onPressedChange={onPressedChange}>
        좋아요
      </ReactionButton>,
    );

    const root = getReactionButtonRoot();
    fireEvent.tap(root);

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("seed-reaction-button__root--disabled_true");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("keeps content mounted but ignores taps while loading", () => {
    const onPressedChange = vi.fn();
    const onTap = vi.fn();
    render(
      <ReactionButton loading onPressedChange={onPressedChange} bindtap={onTap}>
        좋아요
        <Count>12</Count>
      </ReactionButton>,
    );

    const root = getReactionButtonRoot();
    const queries = getQueriesForElement(getRenderedRoot());
    const content = root.querySelector(".seed-reaction-button__content");

    expect(content).toHaveClass("seed-reaction-button__content--loading_true");
    expect(queries.getByText("좋아요")).toBeInTheDocument();
    expect(queries.getByText("12")).toBeInTheDocument();
    expect(root.querySelector(".seed-reaction-button__loadingIndicator")).toBeInTheDocument();
    expect(root.querySelector(".seed-progress-circle__root")).toBeInTheDocument();

    fireEvent.tap(root);

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
  });

  it("renders the label alone when no Count is given", () => {
    render(<ReactionButton>좋아요</ReactionButton>);

    const content = getReactionButtonRoot().querySelector(".seed-reaction-button__content");

    expect(content?.children).toHaveLength(1);
    expect(content?.children[0]).toHaveClass("seed-reaction-button__label");
    expect(content?.children[0].textContent).toBe("좋아요");
    expect(content?.querySelector(".seed-count")).toBeNull();
  });

  it("moves every Count child after the label into the count slot", () => {
    render(
      <ReactionButton>
        <Count>1</Count>
        좋아요
        <Count className="custom-count">2</Count>
      </ReactionButton>,
    );

    const content = getReactionButtonRoot().querySelector(".seed-reaction-button__content");
    const [label, first, second] = Array.from(content?.children ?? []);

    expect(content?.children).toHaveLength(3);
    expect(label).toHaveClass("seed-reaction-button__label");
    expect(label.textContent).toBe("좋아요");
    expect(first).toHaveClass("seed-count", "seed-reaction-button__count");
    expect(first.textContent).toBe("1");
    expect(second).toHaveClass("seed-count", "seed-reaction-button__count", "custom-count");
    expect(second.textContent).toBe("2");
  });

  it("shows a conditional Count only while it is rendered", () => {
    function Example({ count }: { count?: number }) {
      return (
        <ReactionButton>
          좋아요
          {count !== undefined && <Count>{count}</Count>}
        </ReactionButton>
      );
    }

    const { rerender } = render(<Example />);

    expect(getReactionButtonRoot().querySelector(".seed-count")).toBeNull();

    rerender(<Example count={3} />);

    const count = getReactionButtonRoot().querySelector(".seed-count");
    expect(count).toHaveClass("seed-reaction-button__count");
    expect(count?.textContent).toBe("3");
  });

  it("keeps a Count wrapped in a Fragment inside the label", () => {
    render(
      <ReactionButton>
        좋아요
        <>
          <Count>4</Count>
        </>
      </ReactionButton>,
    );

    const label = getReactionButtonRoot().querySelector(".seed-reaction-button__label");
    const count = label?.querySelector(".seed-count");

    expect(count?.textContent).toBe("4");
    expect(count).not.toHaveClass("seed-reaction-button__count");
  });
});
