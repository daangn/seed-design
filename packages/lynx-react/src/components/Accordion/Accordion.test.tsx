import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import type * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function TestAccordion(props: React.ComponentProps<typeof Accordion.Root> = {}) {
  return (
    <Accordion.Root {...props}>
      <Accordion.Item value="first">
        <Accordion.Header>
          <Accordion.Trigger className="first-trigger" accessibility-label="첫 번째">
            <Accordion.Body>
              <Accordion.Title>첫 번째</Accordion.Title>
            </Accordion.Body>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <text>첫 번째 내용</text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="second">
        <Accordion.Header>
          <Accordion.Trigger className="second-trigger" accessibility-label="두 번째">
            <Accordion.Body>
              <Accordion.Title>두 번째</Accordion.Title>
            </Accordion.Body>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <text>두 번째 내용</text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe("Accordion", () => {
  it("opens and closes an item in uncontrolled mode", () => {
    render(<TestAccordion />);

    const trigger = getRenderedRoot().querySelector<HTMLElement>(".first-trigger");
    expect(trigger).not.toBeNull();
    expect(trigger).toHaveAttribute("accessibility-value", "접힘");

    fireEvent.tap(trigger as HTMLElement);
    expect(trigger).toHaveAttribute("accessibility-value", "펼쳐짐");

    fireEvent.tap(trigger as HTMLElement);
    expect(trigger).toHaveAttribute("accessibility-value", "접힘");
  });

  it("keeps one item open by default and supports multiple mode", () => {
    render(<TestAccordion multiple defaultValues={["first"]} />);

    const root = getRenderedRoot();
    const first = root.querySelector<HTMLElement>(".first-trigger");
    const second = root.querySelector<HTMLElement>(".second-trigger");

    expect(first).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(second).toHaveAttribute("accessibility-value", "접힘");

    fireEvent.tap(second as HTMLElement);
    expect(first).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(second).toHaveAttribute("accessibility-value", "펼쳐짐");
  });

  it("reports controlled value changes without mutating the rendered state", () => {
    const onValuesChange = vi.fn();
    render(<TestAccordion values={[]} onValuesChange={onValuesChange} />);

    const trigger = getRenderedRoot().querySelector<HTMLElement>(".first-trigger");
    fireEvent.tap(trigger as HTMLElement);

    expect(onValuesChange).toHaveBeenCalledWith(["first"]);
    expect(trigger).toHaveAttribute("accessibility-value", "접힘");
  });

  it("ignores tap when the root is disabled", () => {
    const onValuesChange = vi.fn();
    render(<TestAccordion disabled onValuesChange={onValuesChange} />);

    const trigger = getRenderedRoot().querySelector<HTMLElement>(".first-trigger");
    fireEvent.tap(trigger as HTMLElement);

    expect(onValuesChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute("accessibility-traits", "disabled");
    expect(getRenderedQueries().getByText("첫 번째 내용").parentElement).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
  });
});
