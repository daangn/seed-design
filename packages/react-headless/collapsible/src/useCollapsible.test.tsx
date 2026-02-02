import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  type CollapsibleRootProps,
} from "./Collapsible";

/**
 * @see https://github.com/ZeeCoder/use-resize-observer/issues/40#issuecomment-644536259
 * useCollapsible에서 사용하는 ResizeObserver를 mock으로 대체합니다.
 */
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

function Collapsible(props: CollapsibleRootProps) {
  return (
    <CollapsibleRoot {...props}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </CollapsibleRoot>
  );
}

describe("useCollapsible", () => {
  const originalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = ResizeObserver;

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("should render the collapsible correctly", () => {
    const { getByRole, getByText } = setUp(<Collapsible />);

    const trigger = getByRole("button");
    const content = getByText("Content");

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("hidden");
  });

  it("should render the collapsible with defaultOpen=true", () => {
    const { getByRole, getByText } = setUp(<Collapsible defaultOpen={true} />);

    const trigger = getByRole("button");
    const content = getByText("Content");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).not.toHaveAttribute("hidden");
  });

  it("should render the collapsible with defaultOpen=false", () => {
    const { getByRole, getByText } = setUp(<Collapsible defaultOpen={false} />);

    const trigger = getByRole("button");
    const content = getByText("Content");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("hidden");
  });

  it("should toggle open state when trigger is clicked", async () => {
    const { getByRole, getByText, user } = setUp(<Collapsible />);

    const trigger = getByRole("button");
    const content = getByText("Content");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("hidden");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).not.toHaveAttribute("hidden");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("should call onOpenChange when toggle is clicked", async () => {
    const handleOpenChange = mock(() => {});

    const { getByRole, user } = setUp(<Collapsible onOpenChange={handleOpenChange} />);
    const trigger = getByRole("button");

    await user.click(trigger);
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    await user.click(trigger);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("should have correct aria-controls attribute", () => {
    const { getByRole, getByText } = setUp(<Collapsible />);

    const trigger = getByRole("button");
    const content = getByText("Content");

    const contentId = content.getAttribute("id");
    expect(trigger).toHaveAttribute("aria-controls", contentId);
  });

  it("should have data-open attribute when open", async () => {
    const { getByRole, user } = setUp(<Collapsible />);

    const trigger = getByRole("button");

    expect(trigger).not.toHaveAttribute("data-open");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-open");
  });

  describe("disabled prop test", () => {
    it("should have aria-disabled when disabled prop is true", () => {
      const { getByRole } = setUp(<Collapsible disabled={true} />);
      const trigger = getByRole("button");

      expect(trigger).toHaveAttribute("aria-disabled", "true");
    });

    it("should not toggle when trigger is clicked while disabled", async () => {
      const { getByRole, user } = setUp(<Collapsible disabled={true} />);
      const trigger = getByRole("button");

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("should not call onOpenChange when clicked while disabled", async () => {
      const handleOpenChange = mock(() => {});

      const { getByRole, user } = setUp(
        <Collapsible disabled={true} onOpenChange={handleOpenChange} />,
      );
      const trigger = getByRole("button");

      await user.click(trigger);
      expect(handleOpenChange).not.toHaveBeenCalled();
    });

    it("should have data-disabled attribute when disabled", () => {
      const { getByRole } = setUp(<Collapsible disabled={true} />);
      const trigger = getByRole("button");

      expect(trigger).toHaveAttribute("data-disabled");
    });
  });

  describe("controlled mode", () => {
    function ControlledCollapsible() {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
          <Collapsible open={open} onOpenChange={setOpen} />
        </div>
      );
    }

    it("should be controlled by external state", async () => {
      const { getByRole, getByText, user } = setUp(<ControlledCollapsible />);

      const trigger = getByRole("button", { name: "Toggle" });
      const openButton = getByText("Open");
      const closeButton = getByText("Close");

      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(openButton);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(closeButton);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
