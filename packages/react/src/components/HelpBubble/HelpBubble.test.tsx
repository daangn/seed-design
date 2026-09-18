import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";

import {
  DialogContent,
  DialogPositioner,
  DialogRoot,
  type DialogRootProps,
} from "../Dialog/Dialog";
import {
  HelpBubbleBody,
  HelpBubbleContent,
  HelpBubblePositionerPortal,
  HelpBubbleRoot,
  HelpBubbleTitle,
  HelpBubbleTrigger,
} from "./HelpBubble";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

// The layer stack registers its outside-press listener a tick after the layer mounts, so a
// press has to wait for that timer before it counts as a dismissal.
const waitForLayer = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

function DialogWithHelpBubble(props: Omit<DialogRootProps, "children">) {
  return (
    <DialogRoot {...props}>
      <DialogPositioner>
        <DialogContent aria-label="Dialog">
          <HelpBubbleRoot>
            <HelpBubbleTrigger>Help</HelpBubbleTrigger>
            <HelpBubblePositionerPortal>
              <HelpBubbleContent>
                <HelpBubbleBody>
                  <HelpBubbleTitle>Title</HelpBubbleTitle>
                </HelpBubbleBody>
              </HelpBubbleContent>
            </HelpBubblePositionerPortal>
          </HelpBubbleRoot>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}

describe("HelpBubble in a Dialog", () => {
  it("closes on Escape without closing the Dialog", async () => {
    const user = userEvent.setup();
    const onDialogOpenChange = jest.fn();
    const { getByText } = render(<DialogWithHelpBubble open onOpenChange={onDialogOpenChange} />);
    await waitForPositioning();

    const trigger = getByText("Help");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onDialogOpenChange).not.toHaveBeenCalled();
  });

  it("closes on an outside press without closing the Dialog", async () => {
    const user = userEvent.setup();
    const onDialogOpenChange = jest.fn();
    const { getByText } = render(
      <>
        <button type="button">Outside</button>
        <DialogWithHelpBubble open onOpenChange={onDialogOpenChange} />
      </>,
    );
    await waitForPositioning();

    const trigger = getByText("Help");
    await user.click(trigger);
    await waitForLayer();

    await user.click(getByText("Outside"));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onDialogOpenChange).not.toHaveBeenCalled();
  });

  // `unmountOnExit={false}` keeps the content mounted after close; unmounting it would take the
  // HelpBubble down whether or not it joined the layer stack.
  it("closes along with the Dialog", async () => {
    const user = userEvent.setup();
    const { getByText, rerender } = render(<DialogWithHelpBubble open unmountOnExit={false} />);
    await waitForPositioning();

    const trigger = getByText("Help");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    rerender(<DialogWithHelpBubble open={false} unmountOnExit={false} />);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
