import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { Icon, PrefixIcon, SuffixIcon } from "../Icon";
import { ActionButton } from "./ActionButton";
import { AccessibilityElementScope } from "../../utils/accessibility";

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

function getActionButtonRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-action-button__root")) {
    return root;
  }

  const actionButtonRoot = root.querySelector<HTMLElement>(".seed-action-button__root");

  if (!actionButtonRoot) {
    throw new Error("Expected ActionButton root to exist.");
  }

  return actionButtonRoot;
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

describe("ActionButton", () => {
  it("applies bleed as negative root margins without forwarding bleed props", () => {
    render(
      <ActionButton bleedX="8px" bleedY="4px">
        Submit
      </ActionButton>,
    );

    const root = getActionButtonRoot();
    expect(root.style.marginTop).toBe("calc(-4px)");
    expect(root.style.marginRight).toBe("calc(-8px)");
    expect(root.style.marginBottom).toBe("calc(-4px)");
    expect(root.style.marginLeft).toBe("calc(-8px)");
    expect(root).not.toHaveAttribute("bleedX");
    expect(root).not.toHaveAttribute("bleedY");
  });

  it("rejects dimension tokens as bleed values", () => {
    // @ts-expect-error Lynx drops an inline calc() that contains a token's var().
    const invalid = <ActionButton bleedX="x4">Submit</ActionButton>;
    expect(invalid).toBeDefined();
  });

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
    expect(getActionButtonRoot()).toHaveAttribute("accessibility-label", "Submit");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "true");
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

    expect(root.querySelector(".seed-prefix-icon-slot")).toHaveClass(
      "seed-action-button__prefixIcon",
    );
    expect(root.querySelector(".seed-suffix-icon-slot")).toHaveClass(
      "seed-action-button__suffixIcon",
    );
    expect(root.querySelector(".seed-prefix-icon-slot image")).toHaveStyle({
      width: "100%",
      height: "100%",
    });
    expect(getByText("Submit")).toHaveClass("seed-action-button__text");
  });

  it("supports icon-only child slot", () => {
    render(
      <ActionButton layout="iconOnly" accessibility-label="Add">
        <Icon icon={<MockIcon />} />
      </ActionButton>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector(".seed-icon-slot")).toHaveClass("seed-action-button__icon");
  });

  it("maps accessibility props to the root view", () => {
    render(
      <ActionButton layout="iconOnly" accessibility-label="Add">
        <Icon icon={<MockIcon />} />
      </ActionButton>,
    );

    const root = getActionButtonRoot();

    expect(root).toHaveAttribute("accessibility-label", "Add");
    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");
  });

  it("derives its accessible name from text without exposing the label twice", () => {
    const { getByText } = render(<ActionButton>Open</ActionButton>);
    const root = getActionButtonRoot();

    expect(root).toHaveAttribute("accessibility-label", "Open");
    expect(root).toHaveAttribute("flatten", "false");
    expect(getByText("Open")).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(getByText("Open")).toHaveAttribute("accessibility-element", "false");
  });

  it("keeps the consumer name instead of deriving a name from children", () => {
    render(<ActionButton accessibility-label="Submit order">Submit</ActionButton>);
    expect(getActionButtonRoot()).toHaveAttribute("accessibility-label", "Submit order");
  });

  it("leaves accessibility ownership to an enclosing element", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { getByText } = render(
      <AccessibilityElementScope>
        <ActionButton>Open</ActionButton>
        <ActionButton layout="iconOnly">
          <Icon icon={<MockIcon />} />
        </ActionButton>
        <ActionButton accessibility-element={true} accessibility-label="Explicit">
          Named
        </ActionButton>
      </AccessibilityElementScope>,
    );

    const root = (getByText("Open") as HTMLElement).parentElement;
    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).not.toHaveAttribute("accessibility-label");
    expect(getByText("Open")).toHaveAttribute("accessibility-elements-hidden", "true");
    expect((getByText("Named") as HTMLElement).parentElement).toHaveAttribute(
      "accessibility-element",
      "true",
    );
    expect(
      warn.mock.calls.filter(([message]) => String(message).startsWith("ActionButton:")),
    ).toHaveLength(0);
    warn.mockRestore();
  });

  it("warns when an accessible text button has no name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<ActionButton />);
    expect(
      warn.mock.calls.filter(([message]) => String(message).startsWith("ActionButton:")),
    ).toHaveLength(1);
    warn.mockRestore();
  });

  it("keeps the icon-only accessibility warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <ActionButton layout="iconOnly">
        <Icon icon={<MockIcon />} />
      </ActionButton>,
    );
    expect(warn).toHaveBeenCalledWith(
      'ActionButton: `layout="iconOnly"` requires `accessibility-label` for accessibility.',
    );
    warn.mockRestore();
  });

  it("honors native overrides while keeping disabled tap callbacks blocked", () => {
    const onTap = vi.fn();
    render(
      <ActionButton disabled flatten={true} accessibility-traits="link" bindtap={onTap}>
        Submit
      </ActionButton>,
    );

    const root = getActionButtonRoot();
    expect(root).toHaveAttribute("flatten", "true");
    expect(root).toHaveAttribute("accessibility-traits", "link");
    fireEvent.tap(root);
    expect(onTap).not.toHaveBeenCalled();
  });

  it("throws in development when icon-only layout has no Icon child", () => {
    expect(() => {
      render(
        <ActionButton layout="iconOnly" accessibility-label="Add">
          Add
        </ActionButton>,
      );
    }).toThrow(/must render <Icon \/> as a child/);
  });

  it("throws in development when icon-only layout has multiple Icon children", () => {
    expect(() => {
      render(
        <ActionButton layout="iconOnly" accessibility-label="Add">
          <Icon icon={<MockIcon />} />
          <Icon icon={<MockIcon />} />
        </ActionButton>,
      );
    }).toThrow(/must render only one <Icon \/>/);
  });
});
