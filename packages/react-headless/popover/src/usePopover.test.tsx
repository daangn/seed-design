import { FocusScope } from "@radix-ui/react-focus-scope";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type * as React from "react";

import {
  PopoverCloseButton,
  PopoverContent,
  PopoverPositionerPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  type PopoverRootProps,
} from "./index";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

// Flush rAF-deferred focus from FloatingFocusManager. happy-dom mocks rAF with
// setImmediate, so a short timer is needed for enqueueFocus() in @floating-ui/react
// to land.
const waitForFocus = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

/**
 * Stands in for a modal ancestor (Dialog, Drawer, AppScreen). Those are all thin
 * wrappers over exactly this scope, and what the popover owes them is entry in Radix's
 * focusScopesStack — so the raw scope is the mechanism under test, not a stand-in for
 * one. Using it directly also keeps the ancestor free of the scroll locking, aria-hidden
 * and presence gating those components would drag in.
 */
function TrappedAncestor({ children }: { children: React.ReactNode }) {
  return (
    <FocusScope trapped onMountAutoFocus={(event) => event.preventDefault()}>
      {children}
    </FocusScope>
  );
}

function BasicPopover(props: Omit<PopoverRootProps, "children">) {
  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverPositionerPortal data-testid="positioner">
        <PopoverContent data-testid="content">
          <PopoverTitle>Title</PopoverTitle>
          <input aria-label="Note" />
          <PopoverCloseButton>Close</PopoverCloseButton>
        </PopoverContent>
      </PopoverPositionerPortal>
    </PopoverRoot>
  );
}

describe("PopoverContent", () => {
  // The content stays mounted while closing so the exit transition can play, and it has
  // to keep the very same DOM nodes: a remount throws away whatever the user typed and
  // hands the transition a scroll container starting at scrollTop 0. Both assertions ride
  // on DOM state React never renders — exactly what a remount discards.
  it("keeps the content's DOM through a close", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText, getByTestId } = render(<BasicPopover />);
    await waitForPositioning();

    const trigger = getByText("Open Popover");
    await user.click(trigger);

    const content = getByTestId("content");
    content.scrollTop = 120;
    await user.type(getByLabelText("Note"), "draft");

    await user.click(trigger);
    expect(getByTestId("content")).not.toHaveAttribute("data-open");
    expect(getByTestId("content")).toBe(content);
    expect(getByTestId("content").scrollTop).toBe(120);
    expect(getByLabelText("Note")).toHaveValue("draft");
  });

  describe("focus", () => {
    it("focuses the content container rather than its first tabbable on open", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForFocus();

      expect(getByTestId("content")).toHaveFocus();
    });

    // Non-modal: focus is managed, not trapped, so a keyboard user is never walled in.
    it("lets focus leave the popover while it is open", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <>
          <BasicPopover />
          <button type="button">Outside</button>
        </>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForFocus();

      act(() => getByText("Outside").focus());
      await waitForFocus();

      expect(getByText("Outside")).toHaveFocus();
    });

    it("returns focus to the trigger on close", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicPopover />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForFocus();

      await user.click(getByText("Close"));
      await waitForFocus();

      expect(getByText("Open Popover")).toHaveFocus();
    });
  });

  // The positioner is floating-ui's floating element. Every assertion below re-checks that it
  // is still in the document, because unmounting it would leave `autoUpdate` and the position
  // middleware measuring a detached node.
  describe("presence", () => {
    it("skips the content until the first open under lazyMount", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId, queryByTestId } = render(<BasicPopover lazyMount />);
      await waitForPositioning();

      expect(queryByTestId("content")).toBeNull();
      expect(getByTestId("positioner")).toBeInTheDocument();

      await user.click(getByText("Open Popover"));

      expect(getByTestId("content")).toBeInTheDocument();
      expect(getByTestId("positioner")).toBeInTheDocument();
    });

    // The content element only exists from the microtask FloatingFocusManager defers its
    // initial focus into, so lazy mounting is the case where that ordering can break.
    it("still focuses the content on a lazily mounted first open", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover lazyMount />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForFocus();

      expect(getByTestId("content")).toHaveFocus();
    });

    it("drops the content once the exit finishes under unmountOnExit", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId, queryByTestId } = render(<BasicPopover unmountOnExit />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      expect(getByTestId("content")).toBeInTheDocument();

      await user.click(trigger);

      expect(queryByTestId("content")).toBeNull();
      expect(getByTestId("positioner")).toBeInTheDocument();
    });

    // Both flags default off, so a consumer that opts out of neither keeps today's behaviour:
    // the content is in the DOM from first render and stays there forever.
    it("keeps the content mounted throughout by default", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover />);
      await waitForPositioning();

      expect(getByTestId("content")).toBeInTheDocument();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await user.click(trigger);

      expect(getByTestId("content")).toBeInTheDocument();
      expect(getByTestId("positioner")).toBeInTheDocument();
    });
  });

  describe("focus scope participation", () => {
    it("pauses a trapped ancestor while open", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(
        <TrappedAncestor>
          <BasicPopover />
        </TrappedAncestor>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForFocus();

      expect(getByTestId("content")).toHaveFocus();
    });

    // Pause and resume are one contract: the scope has to leave the stack when the popover
    // closes, or the ancestor stays paused forever and its trap never comes back.
    it("lets a trapped ancestor resume once closed", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <>
          <button type="button">Outside</button>
          <TrappedAncestor>
            <BasicPopover />
          </TrappedAncestor>
        </>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await user.click(trigger);
      await waitForFocus();

      // With the ancestor trap active again, focus cannot settle outside its container.
      act(() => getByText("Outside").focus());
      expect(getByText("Outside")).not.toHaveFocus();
    });
  });
});
