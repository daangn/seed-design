import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import {
  HelpBubbleAnchor,
  HelpBubbleBody,
  HelpBubbleCloseButton,
  HelpBubbleContent,
  HelpBubbleDescription,
  HelpBubblePositioner,
  HelpBubblePositionerPortal,
  HelpBubbleRoot,
  HelpBubbleTitle,
  HelpBubbleTrigger,
  type HelpBubbleRootProps,
} from "./HelpBubble";

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

function BasicHelpBubble(props: Omit<HelpBubbleRootProps, "children">) {
  return (
    <HelpBubbleRoot {...props}>
      <HelpBubbleTrigger>Help</HelpBubbleTrigger>
      <HelpBubblePositioner data-testid="positioner">
        <HelpBubbleContent data-testid="content">
          <HelpBubbleBody>
            <HelpBubbleTitle>Title</HelpBubbleTitle>
            <HelpBubbleDescription>Description</HelpBubbleDescription>
          </HelpBubbleBody>
          <HelpBubbleCloseButton>Close</HelpBubbleCloseButton>
        </HelpBubbleContent>
      </HelpBubblePositioner>
    </HelpBubbleRoot>
  );
}

describe("HelpBubble", () => {
  it("wires the trigger and the content as a dialog popup", async () => {
    const { getByText, getByTestId, getByRole } = render(<BasicHelpBubble defaultOpen />);
    await waitForPositioning();

    expect(getByRole("dialog")).toBe(getByTestId("content"));
    expect(getByText("Help")).toHaveAttribute("aria-controls", getByTestId("content").id);
    expect(getByTestId("positioner")).not.toHaveAttribute("role");
  });

  it("names and describes the content while keeping the title and description elements", async () => {
    const { getByText, getByTestId } = render(<BasicHelpBubble defaultOpen />);
    await waitForPositioning();

    expect(getByText("Title").tagName).toBe("SPAN");
    expect(getByText("Description").tagName).toBe("DIV");
    expect(getByTestId("content")).toHaveAttribute("aria-labelledby", getByText("Title").id);
    expect(getByTestId("content")).toHaveAttribute("aria-describedby", getByText("Description").id);
  });

  it("moves focus into the content on open and back to the trigger on close", async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId } = render(<BasicHelpBubble />);
    await waitForPositioning();

    await user.click(getByText("Help"));
    await waitForFocus();
    expect(getByTestId("content")).toHaveFocus();

    await user.click(getByText("Close"));
    await waitForFocus();

    expect(getByTestId("content")).not.toHaveAttribute("data-open");
    expect(getByText("Help")).toHaveFocus();
  });

  it("moves focus into the content when it opens against an anchor", async () => {
    const { getByTestId } = render(
      <HelpBubbleRoot defaultOpen>
        <HelpBubbleAnchor>Anchor</HelpBubbleAnchor>
        <HelpBubblePositioner>
          <HelpBubbleContent data-testid="content">Content</HelpBubbleContent>
        </HelpBubblePositioner>
      </HelpBubbleRoot>,
    );
    await waitForPositioning();
    await waitForFocus();

    expect(getByTestId("content")).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId } = render(<BasicHelpBubble />);
    await waitForPositioning();

    await user.click(getByText("Help"));
    await user.keyboard("{Escape}");

    expect(getByTestId("content")).not.toHaveAttribute("data-open");
  });

  it("renders the Positioner in place and the PositionerPortal into the body", async () => {
    const { container, getByTestId } = render(
      <>
        <BasicHelpBubble />
        <HelpBubbleRoot>
          <HelpBubbleTrigger>Portal</HelpBubbleTrigger>
          <HelpBubblePositionerPortal data-testid="portal-positioner">
            <HelpBubbleContent>Content</HelpBubbleContent>
          </HelpBubblePositionerPortal>
        </HelpBubbleRoot>
      </>,
    );
    await waitForPositioning();

    expect(container).toContainElement(getByTestId("positioner"));
    expect(container).not.toContainElement(getByTestId("portal-positioner"));
    expect(document.body).toContainElement(getByTestId("portal-positioner"));
  });
});
