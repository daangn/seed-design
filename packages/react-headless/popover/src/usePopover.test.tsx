import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";

import type * as React from "react";

import {
  PopoverPositioner,
  PopoverPositionerPortal,
  PopoverRoot,
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

/**
 * Stands in for an ancestor surface that owns a dismissible layer — a Dialog, a BottomSheet,
 * an AppScreen. What the popover owes it is a registration as its child in the shared stack,
 * so the raw layer is the mechanism under test rather than a stand-in for one.
 */
function AncestorLayer({
  enabled = true,
  onEscapeKeyDown = () => {},
  onPressOutside = () => {},
  children,
}: {
  enabled?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPressOutside?: (event: PointerEvent | TouchEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <DismissibleLayer
      enabled={enabled}
      onEscapeKeyDown={onEscapeKeyDown}
      onPressOutside={onPressOutside}
      onFocusOutside={() => {}}
      onCascadeDismiss={() => {}}
    >
      <div data-testid="ancestor">{children}</div>
    </DismissibleLayer>
  );
}

function BasicPopover({
  portalled = true,
  ...props
}: Omit<PopoverRootProps, "children"> & { portalled?: boolean }) {
  const Positioner = portalled ? PopoverPositionerPortal : PopoverPositioner;

  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <Positioner>
        <div>Content</div>
      </Positioner>
    </PopoverRoot>
  );
}

describe("usePopover", () => {
  describe("dismissal", () => {
    it("closes on Escape", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicPopover />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on an outside press", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <>
          <BasicPopover />
          <button type="button">Outside</button>
        </>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(getByText("Outside"));

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("stays open on a press inside", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicPopover />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(getByText("Content"));

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    // The trigger sits outside the popover's DOM, so a second press has to toggle it shut
    // once rather than dismiss it on pointerdown and reopen it on click.
    it("closes when the trigger is pressed again", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicPopover />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("keeps the popover open on an outside press when closeOnInteractOutside is off", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <>
          <BasicPopover closeOnInteractOutside={false} />
          <button type="button">Outside</button>
        </>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(getByText("Outside"));

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    // Opting out of outside presses is not opting out of dismissal: Escape is the keyboard
    // user's only way out, and the opt-out lives in the press handler alone.
    it("still closes on Escape when closeOnInteractOutside is off", async () => {
      const user = userEvent.setup();
      const { getByText } = render(<BasicPopover closeOnInteractOutside={false} />);
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);

      await user.keyboard("{Escape}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  // Dismissal resolves against the top-most layer, so a popover opened over a Dialog or a
  // BottomSheet closes on its own before the surface underneath it hears anything.
  describe.each([
    ["PopoverPositioner", false],
    ["PopoverPositionerPortal", true],
  ] as const)("layer stack (%s)", (_, portalled) => {
    it("takes the Escape without disturbing an ancestor layer", async () => {
      const user = userEvent.setup();
      const onAncestorEscapeKeyDown = jest.fn();
      const { getByText } = render(
        <AncestorLayer onEscapeKeyDown={onAncestorEscapeKeyDown}>
          <BasicPopover portalled={portalled} />
        </AncestorLayer>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await user.keyboard("{Escape}");

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(onAncestorEscapeKeyDown).not.toHaveBeenCalled();
    });

    it("hands the next Escape to the ancestor once it has closed", async () => {
      const user = userEvent.setup();
      const onAncestorEscapeKeyDown = jest.fn();
      const { getByText } = render(
        <AncestorLayer onEscapeKeyDown={onAncestorEscapeKeyDown}>
          <BasicPopover portalled={portalled} />
        </AncestorLayer>,
      );
      await waitForPositioning();

      await user.click(getByText("Open Popover"));
      await user.keyboard("{Escape}");
      await waitForPositioning();

      await user.keyboard("{Escape}");

      expect(onAncestorEscapeKeyDown).toHaveBeenCalledTimes(1);
    });

    it("takes an outside press without disturbing an ancestor layer", async () => {
      const user = userEvent.setup();
      const onAncestorPressOutside = jest.fn();
      const { getByText } = render(
        <>
          <button type="button">Outside</button>
          <AncestorLayer onPressOutside={onAncestorPressOutside}>
            <BasicPopover portalled={portalled} />
          </AncestorLayer>
        </>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(getByText("Outside"));

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(onAncestorPressOutside).not.toHaveBeenCalled();
    });

    it("leaves an ancestor layer alone on a press inside the popover", async () => {
      const user = userEvent.setup();
      const onAncestorPressOutside = jest.fn();
      const { getByText } = render(
        <AncestorLayer onPressOutside={onAncestorPressOutside}>
          <BasicPopover portalled={portalled} />
        </AncestorLayer>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);
      await waitForLayer();

      await user.click(getByText("Content"));

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(onAncestorPressOutside).not.toHaveBeenCalled();
    });

    it("closes when an ancestor layer is dismissed", async () => {
      const user = userEvent.setup();
      const { getByText, rerender } = render(
        <AncestorLayer>
          <BasicPopover portalled={portalled} />
        </AncestorLayer>,
      );
      await waitForPositioning();

      const trigger = getByText("Open Popover");
      await user.click(trigger);

      rerender(
        <AncestorLayer enabled={false}>
          <BasicPopover portalled={portalled} />
        </AncestorLayer>,
      );

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
