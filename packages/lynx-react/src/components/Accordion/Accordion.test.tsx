import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as React from "@lynx-js/react";
import { describe, expect, it } from "vitest";

import { Accordion } from "./index";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
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
        <Accordion.Content className="first-content">
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
  it("renders the SEED pressed overlay hidden from accessibility", () => {
    render(<TestAccordion />);

    const trigger = getRenderedRoot().querySelector<HTMLElement>(".first-trigger");
    const pressedOverlay = trigger?.querySelector<HTMLElement>(".seed-accordion__pressedOverlay");
    expect(pressedOverlay).not.toBeNull();
    expect(pressedOverlay).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("wires a styled trigger tap to accessibility and measured content height", () => {
    render(<TestAccordion />);

    const root = getRenderedRoot();
    const trigger = root.querySelector<HTMLElement>(".first-trigger");
    const content = root.querySelector<HTMLElement>(".first-content");
    const contentInner = content?.querySelector<HTMLElement>(".seed-accordion__contentInner");

    expect(trigger).toHaveAttribute("accessibility-value", "접힘");
    expect(content).toHaveStyle({ height: "0px" });
    act(() => {
      fireEvent.layoutchange(contentInner as HTMLElement, { height: 84 });
    });
    fireEvent.tap(trigger as HTMLElement);
    expect(trigger).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(content).toHaveStyle({ height: "84px" });
    fireEvent.tap(trigger as HTMLElement);
    expect(trigger).toHaveAttribute("accessibility-value", "접힘");
    expect(content).toHaveStyle({ height: "0px" });
  });

  it("renders a divider only between items", () => {
    render(<TestAccordion />);

    const items = getRenderedRoot().querySelectorAll(".seed-accordion__item");
    expect(items).toHaveLength(2);
    expect(items[0].querySelector(".seed-accordion__divider")).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
    expect(items[1].querySelector(".seed-accordion__divider")).toBeNull();
  });
});
