import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, describe, expect, it } from "bun:test";
import type { ReactElement } from "react";

import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  type AccordionRootProps,
} from "./Accordion";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function ThreeItemAccordion(props: Partial<AccordionRootProps> = {}) {
  return (
    <AccordionRoot {...(props as AccordionRootProps)}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>Trigger 1</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Trigger 2</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionHeader>
          <AccordionTrigger>Trigger 3</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

function NestedAccordion() {
  return (
    <AccordionRoot>
      <AccordionItem value="outer-1">
        <AccordionHeader>
          <AccordionTrigger>Outer Trigger 1</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <AccordionRoot>
            <AccordionItem value="inner-1">
              <AccordionHeader>
                <AccordionTrigger>Inner Trigger 1</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>Inner Content 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="inner-2">
              <AccordionHeader>
                <AccordionTrigger>Inner Trigger 2</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>Inner Content 2</AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="outer-2">
        <AccordionHeader>
          <AccordionTrigger>Outer Trigger 2</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Outer Content 2</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

function NestedAccordionWithContentBeforeHeader() {
  return (
    <AccordionRoot>
      <AccordionItem value="outer-1">
        <AccordionContent>
          <AccordionRoot>
            <AccordionItem value="inner-1">
              <AccordionHeader>
                <AccordionTrigger>Inner Trigger 1</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>Inner Content 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="inner-2">
              <AccordionHeader>
                <AccordionTrigger>Inner Trigger 2</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>Inner Content 2</AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </AccordionContent>
        <AccordionHeader>
          <AccordionTrigger>Outer Trigger 1</AccordionTrigger>
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem value="outer-2">
        <AccordionHeader>
          <AccordionTrigger>Outer Trigger 2</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Outer Content 2</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

function RootDisabledAccordion() {
  return (
    <AccordionRoot disabled={true}>
      <AccordionItem value="item-1" disabled={false}>
        <AccordionHeader>
          <AccordionTrigger>Trigger 1</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

describe("Accordion", () => {
  const originalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = ResizeObserver;

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  describe("structure", () => {
    it("renders Root, Header, Trigger, Content", () => {
      const { getByText, getAllByRole } = setUp(<ThreeItemAccordion />);
      expect(getByText("Trigger 1")).toBeInTheDocument();
      expect(getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });

    it("renders the requested heading level", () => {
      const { getByRole } = setUp(
        <AccordionRoot>
          <AccordionItem value="item-1">
            <AccordionHeader headingLevel={4}>
              <AccordionTrigger>Trigger 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </AccordionRoot>,
      );

      expect(getByRole("heading", { level: 4 })).toBeInTheDocument();
    });
  });

  describe("ARIA", () => {
    it("links trigger id to content via aria-labelledby", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValues={["item-1"]} />);
      const trigger = getByText("Trigger 1");
      const content = getByText("Content 1");
      const triggerId = trigger.getAttribute("id");
      expect(triggerId).toBeTruthy();
      expect(content.getAttribute("aria-labelledby")).toBe(triggerId);
    });

    it("links trigger aria-controls to content id", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValues={["item-1"]} />);
      const trigger = getByText("Trigger 1");
      const content = getByText("Content 1");
      const contentId = content.getAttribute("id");
      expect(contentId).toBeTruthy();
      expect(trigger.getAttribute("aria-controls")).toBe(contentId);
    });

    it("sets role=region on content", () => {
      const { getByText } = setUp(<ThreeItemAccordion defaultValues={["item-1"]} />);
      expect(getByText("Content 1")).toHaveAttribute("role", "region");
    });

    it("aria-expanded reflects open state", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger = getByText("Trigger 1");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("click interaction", () => {
    it("toggles open state on trigger click", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion type="single" />);
      const trigger = getByText("Trigger 1");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus with ArrowDown (wraps around)", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger2 = getByText("Trigger 2");
      const trigger3 = getByText("Trigger 3");

      trigger1.focus();
      await user.keyboard("{ArrowDown}");
      expect(trigger2).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(trigger3).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(trigger1).toHaveFocus();
    });

    it("moves focus with ArrowUp (wraps around)", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger3 = getByText("Trigger 3");

      trigger1.focus();
      await user.keyboard("{ArrowUp}");
      expect(trigger3).toHaveFocus();
    });

    it("jumps to first/last with Home/End", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger1 = getByText("Trigger 1");
      const trigger2 = getByText("Trigger 2");
      const trigger3 = getByText("Trigger 3");

      trigger2.focus();
      await user.keyboard("{End}");
      expect(trigger3).toHaveFocus();

      await user.keyboard("{Home}");
      expect(trigger1).toHaveFocus();
    });

    it("keeps roving focus scoped to the nearest accordion", async () => {
      const { getByText, user } = setUp(<NestedAccordion />);
      const outerTrigger1 = getByText("Outer Trigger 1");
      const outerTrigger2 = getByText("Outer Trigger 2");
      const innerTrigger1 = getByText("Inner Trigger 1");
      const innerTrigger2 = getByText("Inner Trigger 2");

      await user.click(outerTrigger1);
      innerTrigger1.focus();

      await user.keyboard("{ArrowDown}");
      expect(innerTrigger2).toHaveFocus();
      expect(outerTrigger2).not.toHaveFocus();
    });

    it("uses item values to avoid matching nested accordion triggers", async () => {
      const { getByText, user } = setUp(<NestedAccordionWithContentBeforeHeader />);
      const outerTrigger1 = getByText("Outer Trigger 1");
      const outerTrigger2 = getByText("Outer Trigger 2");

      outerTrigger1.focus();
      await user.keyboard("{ArrowDown}");
      expect(outerTrigger2).toHaveFocus();
    });
  });

  describe("disabled", () => {
    it("does not allow an item to override root disabled={true}", async () => {
      const { getByText, user } = setUp(<RootDisabledAccordion />);
      const trigger = getByText("Trigger 1");

      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("data attributes", () => {
    it("sets data-value on trigger", () => {
      const { getByText } = setUp(<ThreeItemAccordion />);
      expect(getByText("Trigger 1")).toHaveAttribute("data-value", "item-1");
    });

    it("sets data-open when item is open", async () => {
      const { getByText, user } = setUp(<ThreeItemAccordion />);
      const trigger = getByText("Trigger 1");
      expect(trigger).not.toHaveAttribute("data-open");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-open");
    });
  });
});
