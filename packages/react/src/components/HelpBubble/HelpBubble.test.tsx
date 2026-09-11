import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import {
  HelpBubbleRoot,
  HelpBubbleTrigger,
  HelpBubblePositionerPortal,
  HelpBubbleContent,
  HelpBubbleBody,
  HelpBubbleCloseButton,
} from "./HelpBubble";

describe("HelpBubble", () => {
  it("keeps its existing composition connected to a dialog without moving focus", async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(
      <HelpBubbleRoot>
        <HelpBubbleTrigger>Help</HelpBubbleTrigger>
        <HelpBubblePositionerPortal aria-label="Help">
          <HelpBubbleContent>
            <HelpBubbleBody>Information</HelpBubbleBody>
            <HelpBubbleCloseButton>Close</HelpBubbleCloseButton>
          </HelpBubbleContent>
        </HelpBubblePositionerPortal>
      </HelpBubbleRoot>,
    );
    await act(async () => {});
    const trigger = getByText("Help");
    const content = getByText("Information");

    await user.click(trigger);

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-controls", getByRole("dialog").id);
    expect(getByRole("dialog")).toContainElement(content);

    await user.click(getByText("Close"));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(getByText("Information")).toBe(content);
  });
});
