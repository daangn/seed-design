import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../../types";
import { Icon, PrefixIcon, SuffixIcon } from "../../Icon";
import { ActionButton } from "../ActionButton";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/react")>();

  return {
    ...actual,
    runOnMainThread: () => () => undefined,
  };
});

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

const MockIcon = React.forwardRef<unknown, LynxIconElementProps>((props, ref) => {
  const { className, style, ...rest } = props;

  return (
    <image
      {...rest}
      {...(ref ? { "main-thread:ref": ref as React.Ref<unknown> } : {})}
      className={className}
      style={style}
    />
  );
});
MockIcon.displayName = "MockIcon";

describe("ActionButton", () => {
  it("keeps the original label in the text slot while loading", () => {
    render(<ActionButton loading>Submit</ActionButton>);

    const { getByText } = getRenderedQueries();
    const label = getByText("Submit");
    const root = getRenderedRoot();

    expect(label).toHaveClass("seed-action-button__text");
    expect(label).toHaveClass("seed-action-button__text--size_medium-layout_withText");
    expect(root.querySelector(".seed-action-button__content")).toBeInTheDocument();
    expect(root.querySelector(".seed-action-button__loadingIndicator")).toBeInTheDocument();
    expect(root.querySelector(".seed-progress-circle__root")).toBeInTheDocument();
  });

  it("applies action button slot classes to child icon slots", () => {
    render(
      <ActionButton variant="brandSolid">
        <PrefixIcon icon={<MockIcon />} />
        Submit
        <SuffixIcon icon={<MockIcon />} />
      </ActionButton>,
    );

    const { getByText } = getRenderedQueries();
    const root = getRenderedRoot();

    expect(root.querySelector(".seed-prefix-icon")).toHaveClass("seed-action-button__prefixIcon");
    expect(root.querySelector(".seed-suffix-icon")).toHaveClass("seed-action-button__suffixIcon");
    expect(root.querySelector(".seed-prefix-icon image")).toHaveStyle({
      width: "100%",
      height: "100%",
    });
    expect(getByText("Submit")).toHaveClass("seed-action-button__text");
  });

  it("keeps existing icon props compatible with the new slot wrapper", () => {
    render(
      <ActionButton prefixIcon={<MockIcon />} suffixIcon={<MockIcon />}>
        Submit
      </ActionButton>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector(".seed-prefix-icon")).toHaveClass("seed-action-button__prefixIcon");
    expect(root.querySelector(".seed-suffix-icon")).toHaveClass("seed-action-button__suffixIcon");
  });

  it("supports icon-only child slot", () => {
    render(
      <ActionButton layout="iconOnly" aria-label="Add">
        <Icon icon={<MockIcon />} />
      </ActionButton>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector(".seed-icon")).toHaveClass("seed-action-button__icon");
  });

  it("keeps existing icon prop compatible with icon-only validation", () => {
    render(<ActionButton layout="iconOnly" aria-label="Add" icon={<MockIcon />} />);

    const root = getRenderedRoot();

    expect(root.querySelector(".seed-icon")).toHaveClass("seed-action-button__icon");
  });

  it("throws in development when icon-only layout has no Icon child", () => {
    expect(() => {
      render(
        <ActionButton layout="iconOnly" aria-label="Add">
          Add
        </ActionButton>,
      );
    }).toThrow(/must render <Icon \/> as a child/);
  });

  it("throws in development when icon-only layout has multiple Icon children", () => {
    expect(() => {
      render(
        <ActionButton layout="iconOnly" aria-label="Add">
          <Icon icon={<MockIcon />} />
          <Icon icon={<MockIcon />} />
        </ActionButton>,
      );
    }).toThrow(/must render only one <Icon \/>/);
  });
});
