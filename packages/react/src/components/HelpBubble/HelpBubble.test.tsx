import { act, render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import {
  HelpBubbleAnchor,
  HelpBubbleBody,
  HelpBubbleCloseButton,
  HelpBubbleContent,
  HelpBubbleDescription,
  HelpBubblePositioner,
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

  it("leaves focus where the page put it when it opens", async () => {
    const { getByTestId } = render(
      <>
        {/* biome-ignore lint/a11y/noAutofocus: reproduces a page that focuses a field on load */}
        <input data-testid="field" autoFocus />
        <BasicHelpBubble defaultOpen />
      </>,
    );
    await waitForPositioning();
    await waitForFocus();

    expect(getByTestId("field")).toHaveFocus();
  });

  it("stays open when the page focuses a field after it opens", async () => {
    const { getByTestId, getByText } = render(
      <>
        <input data-testid="field" />
        <BasicHelpBubble defaultOpen />
      </>,
    );
    await waitForPositioning();
    await waitForFocus();

    act(() => getByTestId("field").focus());
    await waitForFocus();

    expect(getByTestId("field")).toHaveFocus();
    expect(getByText("Help")).toHaveAttribute("aria-expanded", "true");
  });

  it("moves focus into the content when it opens against an anchor with autoFocus", async () => {
    const { getByTestId } = render(
      <HelpBubbleRoot defaultOpen autoFocus>
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
});
