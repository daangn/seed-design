import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Callout from "./Callout.namespace";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getCalloutRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-callout__root")) return root;

  const calloutRoot = root.querySelector<HTMLElement>(".seed-callout__root");
  if (!calloutRoot) {
    throw new Error("Expected Callout root to exist.");
  }

  return calloutRoot;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

describe("Callout", () => {
  it("renders compound slots with the default neutral tone", () => {
    render(
      <Callout.Root>
        <Callout.Content>
          <Callout.Title>Title</Callout.Title>
          <Callout.Description>Description</Callout.Description>
          <Callout.Link bindtap={() => undefined}>Learn more</Callout.Link>
        </Callout.Content>
        <Callout.CloseButton accessibility-label="Close" />
      </Callout.Root>,
    );

    const root = getCalloutRoot();

    expect(root).toHaveClass("seed-callout__root--tone_neutral");
    expect(root.querySelector(".seed-callout__content")?.tagName.toLowerCase()).toBe("text");
    expect(root.querySelector(".seed-callout__title")).toHaveClass(
      "seed-callout__title--tone_neutral",
    );
    expect(root.querySelector(".seed-callout__description")).toHaveClass(
      "seed-callout__description--tone_neutral",
    );
    expect(root.querySelector(".seed-callout__link")).toHaveAttribute(
      "accessibility-traits",
      "link",
    );
    expect(root.querySelector(".seed-callout__closeButton")).toHaveAttribute(
      "accessibility-label",
      "Close",
    );
  });

  it("applies an explicit tone to every visual slot", () => {
    render(
      <Callout.Root tone="critical">
        <Callout.Content>
          <Callout.Title>Title</Callout.Title>
          <Callout.Description>Description</Callout.Description>
          <Callout.Link>Link</Callout.Link>
        </Callout.Content>
      </Callout.Root>,
    );

    const root = getCalloutRoot();

    expect(root).toHaveClass("seed-callout__root--tone_critical");
    expect(root.querySelector(".seed-callout__title")).toHaveClass(
      "seed-callout__title--tone_critical",
    );
    expect(root.querySelector(".seed-callout__description")).toHaveClass(
      "seed-callout__description--tone_critical",
    );
    expect(root.querySelector(".seed-callout__link")).toHaveClass(
      "seed-callout__link--tone_critical",
    );
  });

  it("tracks pressed state and maps actionable accessibility", () => {
    const onTap = vi.fn();

    render(
      <Callout.Root tone="positive" bindtap={onTap}>
        <Callout.Content>
          <Callout.Description>Actionable</Callout.Description>
        </Callout.Content>
      </Callout.Root>,
    );

    const root = getCalloutRoot();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");

    fireEvent.touchstart(root, {});
    expect(root).toHaveClass("seed-callout__root--tone_positive-pressed_true");

    fireEvent.tap(root);
    expect(onTap).toHaveBeenCalledTimes(1);

    fireEvent.touchend(root, {});
    expect(root).not.toHaveClass("seed-callout__root--tone_positive-pressed_true");
  });

  it("does not render when defaultOpen is false", () => {
    render(<Callout.Root defaultOpen={false} />);

    expect(getRenderedRoot().querySelector(".seed-callout__root")).not.toBeInTheDocument();
  });

  it("dismisses an uncontrolled callout", () => {
    const onDismiss = vi.fn();

    render(
      <Callout.Root onDismiss={onDismiss}>
        <Callout.Content>
          <Callout.Description>Dismissible</Callout.Description>
        </Callout.Content>
        <Callout.CloseButton accessibility-label="Close" />
      </Callout.Root>,
    );

    const closeButton = getCalloutRoot().querySelector(".seed-callout__closeButton");
    if (!closeButton) throw new Error("Expected close button to exist.");

    fireEvent.tap(closeButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getRenderedRoot().querySelector(".seed-callout__root")).not.toBeInTheDocument();
  });

  it("notifies without hiding a controlled callout", () => {
    const onDismiss = vi.fn();

    render(
      <Callout.Root open onDismiss={onDismiss}>
        <Callout.Content>
          <Callout.Description>Controlled</Callout.Description>
        </Callout.Content>
        <Callout.CloseButton accessibility-label="Close" />
      </Callout.Root>,
    );

    const closeButton = getCalloutRoot().querySelector(".seed-callout__closeButton");
    if (!closeButton) throw new Error("Expected close button to exist.");

    fireEvent.tap(closeButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getCalloutRoot()).toBeInTheDocument();
    expect(getRenderedQueries().getByText("Controlled")).toBeInTheDocument();

    fireEvent.tap(closeButton);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("composes the close button tap handler with dismiss", () => {
    const onTap = vi.fn();
    const onDismiss = vi.fn();

    render(
      <Callout.Root onDismiss={onDismiss}>
        <Callout.CloseButton bindtap={onTap} accessibility-label="Close" />
      </Callout.Root>,
    );

    const closeButton = getCalloutRoot().querySelector(".seed-callout__closeButton");
    if (!closeButton) throw new Error("Expected close button to exist.");

    fireEvent.tap(closeButton);

    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
