import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, jest } from "bun:test";
import { ToggleTip, type ToggleTipRootProps } from "./index";

function Example(props: Omit<ToggleTipRootProps, "children">) {
  return (
    <>
      <ToggleTip.Root {...props}>
        <ToggleTip.Trigger>Help</ToggleTip.Trigger>
        <ToggleTip.PositionerPortal aria-label="Help" data-testid="positioner">
          <input aria-label="Note" />
          <ToggleTip.CloseButton>Close</ToggleTip.CloseButton>
        </ToggleTip.PositionerPortal>
      </ToggleTip.Root>
      <button type="button">Outside</button>
    </>
  );
}

describe("ToggleTip", () => {
  it("connects the trigger to the positioner dialog and preserves content across toggles", async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId, getByLabelText, getByRole } = render(<Example />);
    await act(async () => {});
    const positioner = getByTestId("positioner");
    const input = getByLabelText("Note");
    const trigger = getByText("Help");

    await user.click(trigger);

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-controls", positioner.id);
    expect(getByRole("dialog")).toBe(positioner);
    expect(positioner).not.toHaveAttribute("aria-modal", "true");

    await user.type(input, "draft");
    await user.click(getByText("Close"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(getByLabelText("Note")).toBe(input);

    await user.click(trigger);
    expect(input).toHaveValue("draft");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the bubble open when focus leaves", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<Example />);
    await act(async () => {});
    await user.click(getByText("Help"));

    act(() => getByText("Outside").focus());
    await act(async () => {});

    expect(getByText("Outside")).toHaveFocus();
    expect(getByText("Help")).toHaveAttribute("aria-expanded", "true");
  });

  it.each([
    true,
    false,
  ])("preserves closeOnInteractOutside=%s and Escape dismissal", async (closeOnInteractOutside) => {
    const user = userEvent.setup();
    const { getByText } = render(<Example closeOnInteractOutside={closeOnInteractOutside} />);
    await act(async () => {});
    const trigger = getByText("Help");
    await user.click(trigger);
    await user.click(getByText("Outside"));

    expect(trigger).toHaveAttribute("aria-expanded", String(!closeOnInteractOutside));
    if (closeOnInteractOutside) await user.click(trigger);

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("lets the owner control open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const { getByText, rerender } = render(<Example open={false} onOpenChange={onOpenChange} />);
    await act(async () => {});
    await user.click(getByText("Help"));

    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    expect(getByText("Help")).toHaveAttribute("aria-expanded", "false");

    rerender(<Example open onOpenChange={onOpenChange} />);
    await act(async () => {});
    expect(getByText("Help")).toHaveAttribute("aria-expanded", "true");
  });
});
