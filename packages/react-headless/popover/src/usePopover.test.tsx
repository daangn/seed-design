import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";

import type * as React from "react";

import {
  PopoverCloseButton,
  PopoverContent,
  PopoverDescription,
  PopoverPositionerPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  type PopoverRootProps,
} from "./index";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

// The layer stack registers its outside-press listener a tick after the layer mounts, so a
// press has to wait for that timer before it counts as a dismissal.
const waitForLayer = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

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

/**
 * Stands in for an ancestor surface that owns a dismissible layer — a Dialog, a BottomSheet,
 * an AppScreen. What the popover owes it is a registration below it in the shared stack, so
 * the raw layer is the mechanism under test rather than a stand-in for one.
 */
function AncestorLayer({
  enabled = true,
  onEscapeKeyDown = () => {},
  children,
}: {
  enabled?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <DismissibleLayer
      enabled={enabled}
      onEscapeKeyDown={onEscapeKeyDown}
      onPressOutside={() => {}}
      onFocusOutside={() => {}}
      onCascadeDismiss={() => {}}
    >
      <div data-testid="ancestor">{children}</div>
    </DismissibleLayer>
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

describe("usePopover", () => {
  describe("aria", () => {
    it("wires the trigger and the content as a dialog popup", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(getByTestId("content")).toHaveAttribute("role", "dialog");
    });

    it("labels the content with the title that renders", async () => {
      const { getByText, getByTestId } = render(<BasicPopover />);
      await waitForPositioning();

      expect(getByTestId("content")).toHaveAttribute("aria-labelledby", getByText("Title").id);
    });

    it("describes the content with the description that renders", async () => {
      const { getByText, getByTestId } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverPositionerPortal>
            <PopoverContent data-testid="content">
              <PopoverDescription>Description</PopoverDescription>
            </PopoverContent>
          </PopoverPositionerPortal>
        </PopoverRoot>,
      );
      await waitForPositioning();

      expect(getByTestId("content")).toHaveAttribute(
        "aria-describedby",
        getByText("Description").id,
      );
    });

    // Emitting the ids unconditionally would point the dialog at elements that are not in the
    // document, and `aria-labelledby` would win over the `aria-label` the consumer supplied
    // precisely because there is no title.
    it("leaves both references off when neither part renders", async () => {
      const { getByTestId } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverPositionerPortal>
            <PopoverContent data-testid="content" aria-label="Popover" />
          </PopoverPositionerPortal>
        </PopoverRoot>,
      );
      await waitForPositioning();

      expect(getByTestId("content")).not.toHaveAttribute("aria-labelledby");
      expect(getByTestId("content")).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("state attributes", () => {
    // The positioner never unmounts — it is the element floating-ui measures — so while the
    // popover is closed this attribute is the only thing keeping an empty box off the page.
    it("marks the positioner hidden while the popover is closed", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover />);
      await waitForPositioning();

      expect(getByTestId("positioner")).toHaveAttribute("data-hidden");

      await user.click(getByText("Open Popover"));

      expect(getByTestId("positioner")).not.toHaveAttribute("data-hidden");
    });

    it("publishes the resolved side on the parts", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover placement="top" />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));

      expect(getByTestId("positioner")).toHaveAttribute("data-side", "top");
      expect(getByTestId("content")).toHaveAttribute("data-side", "top");
    });
  });

  // Every close path reports why it happened, so a consumer can tell a deliberate dismissal
  // from one the surrounding UI forced, and reach the event that caused it.
  describe("open change reasons", () => {
    it("reports the trigger's own event on both edges of a toggle", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByText } = render(<BasicPopover onOpenChange={onOpenChange} />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      expect(onOpenChange).toHaveBeenLastCalledWith(
        true,
        expect.objectContaining({ reason: "trigger", event: expect.any(MouseEvent) }),
      );

      await user.click(trigger);
      expect(onOpenChange).toHaveBeenLastCalledWith(
        false,
        expect.objectContaining({ reason: "trigger", event: expect.any(MouseEvent) }),
      );
    });

    it("reports the close button's click", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByText } = render(<BasicPopover onOpenChange={onOpenChange} />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      onOpenChange.mockClear();

      await user.click(getByText("Close"));

      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ reason: "closeButton", event: expect.any(MouseEvent) }),
      );
    });

    it("reports the Escape keypress", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByText } = render(<BasicPopover onOpenChange={onOpenChange} />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      onOpenChange.mockClear();

      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ reason: "escapeKeyDown", event: expect.any(KeyboardEvent) }),
      );
    });

    it("reports the pointer event behind an outside press", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByText } = render(
        <>
          <BasicPopover onOpenChange={onOpenChange} />
          <button type="button">Outside</button>
        </>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForLayer();
      onOpenChange.mockClear();

      await user.click(getByText("Outside"));

      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ reason: "interactOutside", event: expect.any(PointerEvent) }),
      );
    });

    it("reports the parent layer that cascade-dismissed it", async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { getByText, getByTestId, rerender } = render(
        <AncestorLayer>
          <BasicPopover onOpenChange={onOpenChange} />
        </AncestorLayer>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForLayer();
      onOpenChange.mockClear();

      const ancestor = getByTestId("ancestor");
      rerender(
        <AncestorLayer enabled={false}>
          <BasicPopover onOpenChange={onOpenChange} />
        </AncestorLayer>,
      );

      expect(onOpenChange).toHaveBeenCalledWith(
        false,
        expect.objectContaining({ reason: "cascadeDismiss", dismissedParent: ancestor }),
      );
    });
  });

  describe("dismissal", () => {
    it("keeps the popover open on an outside press when closeOnInteractOutside is off", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(
        <>
          <BasicPopover closeOnInteractOutside={false} />
          <button type="button">Outside</button>
        </>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await waitForLayer();

      await user.click(getByText("Outside"));

      expect(getByTestId("content")).toHaveAttribute("data-open");
    });

    // Opting out of outside presses is not opting out of dismissal: Escape is the keyboard
    // user's only way out, and the opt-out lives in the press handler alone.
    it("still closes on Escape when closeOnInteractOutside is off", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(<BasicPopover closeOnInteractOutside={false} />);
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      expect(getByTestId("content")).toHaveAttribute("data-open");

      await user.keyboard("{Escape}");

      expect(getByTestId("content")).not.toHaveAttribute("data-open");
    });

    it("stays open when a consumer prevents the close button's click", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverPositionerPortal>
            <PopoverContent data-testid="content" aria-label="Popover">
              <PopoverCloseButton onClick={(event) => event.preventDefault()}>
                Close
              </PopoverCloseButton>
            </PopoverContent>
          </PopoverPositionerPortal>
        </PopoverRoot>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await user.click(getByText("Close"));

      expect(getByTestId("content")).toHaveAttribute("data-open");
    });
  });

  // Dismissal resolves against the top-most layer, so a popover opened over a Dialog or a
  // BottomSheet closes on its own before the surface underneath it hears anything.
  describe("layer stack", () => {
    it("takes the Escape without disturbing an ancestor layer", async () => {
      const user = userEvent.setup();
      const onAncestorEscapeKeyDown = jest.fn();
      const { getByText, getByTestId } = render(
        <AncestorLayer onEscapeKeyDown={onAncestorEscapeKeyDown}>
          <BasicPopover />
        </AncestorLayer>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await user.keyboard("{Escape}");

      expect(getByTestId("content")).not.toHaveAttribute("data-open");
      expect(onAncestorEscapeKeyDown).not.toHaveBeenCalled();
    });

    it("hands the next Escape to the ancestor once it has closed", async () => {
      const user = userEvent.setup();
      const onAncestorEscapeKeyDown = jest.fn();
      const { getByText } = render(
        <AncestorLayer onEscapeKeyDown={onAncestorEscapeKeyDown}>
          <BasicPopover />
        </AncestorLayer>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await user.keyboard("{Escape}");
      await waitForPositioning();

      await user.keyboard("{Escape}");

      expect(onAncestorEscapeKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
