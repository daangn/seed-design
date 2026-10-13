import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as React from "@lynx-js/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
          <Accordion.Trigger className="first-trigger">
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
          <Accordion.Trigger className="second-trigger">
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
  afterEach(() => vi.restoreAllMocks());

  it("derives the trigger name and hides only trigger text slots", () => {
    render(
      <Accordion.Root defaultValues={["first"]}>
        <Accordion.Item value="first">
          <Accordion.Trigger className="first-trigger">
            <Accordion.Title>알림</Accordion.Title>
            <Accordion.Description>설정</Accordion.Description>
          </Accordion.Trigger>
          <Accordion.Content>
            <Accordion.Title className="content-title">내용 제목</Accordion.Title>
            <Accordion.Description className="content-description">내용 설명</Accordion.Description>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const root = getRenderedRoot();
    const trigger = root.querySelector(".first-trigger");
    expect(trigger).toHaveAttribute("accessibility-element", "true");
    expect(trigger).toHaveAttribute("accessibility-label", "알림 설정");
    expect(trigger).toHaveAttribute("flatten", "false");
    for (const slot of [".seed-accordion__title", ".seed-accordion__description"]) {
      expect(trigger?.querySelector(slot)).toHaveAttribute("accessibility-element", "false");
      expect(trigger?.querySelector(slot)).toHaveAttribute("accessibility-elements-hidden", "true");
    }
    expect(root.querySelector(".content-title")).not.toHaveAttribute(
      "accessibility-elements-hidden",
    );
    expect(root.querySelector(".content-description")).not.toHaveAttribute(
      "accessibility-elements-hidden",
    );
  });

  it("preserves explicit trigger names, flattening, and text slot visibility", () => {
    const { rerender } = render(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger className="first-trigger" accessibility-label="사용자 이름" flatten>
            <Accordion.Title accessibility-element accessibility-elements-hidden={false}>
              알림
            </Accordion.Title>
            <Accordion.Description accessibility-element accessibility-elements-hidden={false}>
              설정
            </Accordion.Description>
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = getRenderedRoot().querySelector(".first-trigger");
    expect(trigger).toHaveAttribute("accessibility-label", "사용자 이름");
    expect(trigger).toHaveAttribute("flatten", "true");
    for (const slot of [".seed-accordion__title", ".seed-accordion__description"]) {
      expect(trigger?.querySelector(slot)).toHaveAttribute("accessibility-element", "true");
      expect(trigger?.querySelector(slot)).toHaveAttribute(
        "accessibility-elements-hidden",
        "false",
      );
    }

    rerender(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger className="first-trigger" accessibility-element={false}>
            <Accordion.Title>알림</Accordion.Title>
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const nonElementTrigger = getRenderedRoot().querySelector(".first-trigger");
    expect(nonElementTrigger).toHaveAttribute("accessibility-label", "알림");
    expect(nonElementTrigger?.querySelector(".seed-accordion__title")).not.toHaveAttribute(
      "accessibility-elements-hidden",
    );
  });

  it("warns only for an unnamed standalone trigger accessibility element", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger />
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger className="first-trigger">
            <text>알림</text>
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(getRenderedRoot().querySelector(".first-trigger")).not.toHaveAttribute(
      "accessibility-label",
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    warn.mockClear();

    rerender(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger accessibility-element={false} />
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
    rerender(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger accessibility-label="외부 이름">
            <Accordion.Trigger />
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("accessibility-label"));
  });

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

  it("keeps open and disabled accessibility state over user native values", () => {
    render(
      <Accordion.Root defaultValues={["first"]}>
        <Accordion.Item value="first" disabled>
          <Accordion.Trigger
            className="first-trigger"
            accessibility-label="첫 번째"
            accessibility-role-description="섹션"
            {...{ "accessibility-value": "사용자 값", "accessibility-traits": "button" }}
          >
            <Accordion.Title>첫 번째</Accordion.Title>
          </Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = getRenderedRoot().querySelector<HTMLElement>(".first-trigger");
    expect(trigger).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(trigger).toHaveAttribute("accessibility-traits", "disabled");
    expect(trigger).toHaveAttribute("accessibility-role-description", "섹션");
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
