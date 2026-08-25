import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";

import * as Callout from "./Callout.namespace";

describe("Callout", () => {
  it("renders the compound slots", () => {
    render(
      <Callout.Root tone="informative">
        <Callout.Content>
          <Callout.Title>Title</Callout.Title>
          <Callout.Description>Description</Callout.Description>
        </Callout.Content>
      </Callout.Root>,
    );

    const root = elementTree.root;
    if (!root) throw new Error("Expected Lynx render root to exist.");
    const queries = getQueriesForElement(root);

    expect(queries.getByText("Title")).toHaveClass("seed-callout__title");
    expect(queries.getByText("Description")).toHaveClass("seed-callout__description");
    expect(root.querySelector(".seed-callout__root")).toHaveClass(
      "seed-callout__root--tone_informative",
    );
  });

  it("dismisses itself in uncontrolled mode", () => {
    const onDismiss = vi.fn();
    render(
      <Callout.Root onDismiss={onDismiss}>
        <Callout.Content>
          <Callout.Description>Description</Callout.Description>
        </Callout.Content>
        <Callout.CloseButton>Close</Callout.CloseButton>
      </Callout.Root>,
    );

    const root = elementTree.root;
    if (!root) throw new Error("Expected Lynx render root to exist.");
    const queries = getQueriesForElement(root);
    fireEvent.tap(queries.getByText("Close"));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(root.querySelector(".seed-callout__root")).not.toBeInTheDocument();
  });

  it("supports controlled open state", () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      <Callout.Root open onDismiss={onDismiss}>
        <Callout.Description>Description</Callout.Description>
        <Callout.CloseButton>Close</Callout.CloseButton>
      </Callout.Root>,
    );

    const root = elementTree.root;
    if (!root) throw new Error("Expected Lynx render root to exist.");
    const queries = getQueriesForElement(root);
    fireEvent.tap(queries.getByText("Close"));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(root.querySelector(".seed-callout__root")).toBeInTheDocument();

    rerender(
      <Callout.Root open={false} onDismiss={onDismiss}>
        <Callout.Description>Description</Callout.Description>
      </Callout.Root>,
    );
    expect(root.querySelector(".seed-callout__root")).not.toBeInTheDocument();
  });
});
