import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import {
  PopoverBody,
  PopoverContent,
  PopoverPositionerPortal,
  PopoverRoot,
  PopoverTrigger,
  type PopoverRootProps,
} from "./Popover";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

/**
 * happy-dom reports 0 for every layout metric, so a scroll box has to be faked. The scroll
 * event is what makes PopoverBody re-measure — ResizeObserver never fires here because no
 * box ever changes size.
 */
function setScrollMetrics(
  element: HTMLElement,
  metrics: { scrollTop?: number; scrollHeight: number; clientHeight: number },
) {
  Object.defineProperty(element, "scrollTop", {
    value: metrics.scrollTop ?? 0,
    configurable: true,
  });
  Object.defineProperty(element, "scrollHeight", {
    value: metrics.scrollHeight,
    configurable: true,
  });
  Object.defineProperty(element, "clientHeight", {
    value: metrics.clientHeight,
    configurable: true,
  });

  fireEvent.scroll(element);
}

function BasicPopover(props: Omit<PopoverRootProps, "children">) {
  return (
    <PopoverRoot {...props}>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverPositionerPortal>
        <PopoverContent aria-label="Popover">
          <PopoverBody data-testid="body">Body</PopoverBody>
        </PopoverContent>
      </PopoverPositionerPortal>
    </PopoverRoot>
  );
}

describe("PopoverRoot", () => {
  // The px values behind `gutter`/`overflowPadding` are mirrored by hand from `popover.yaml`
  // (`$dimension.x2` / `$dimension.x4`), so nothing else would catch the two drifting apart.
  // Only `gutter` is observable here — `overflowPadding` feeds the size middleware, which
  // clamps to 0 against happy-dom's zero-sized viewport.
  it("offsets the positioner by the spec gutter", async () => {
    const { getByLabelText } = render(<BasicPopover defaultOpen />);
    await waitForPositioning();

    expect(getByLabelText("Popover").parentElement).toHaveStyle({
      transform: "translate(0px, 8px)",
    });
  });

  it("lets a caller override the seeded gutter", async () => {
    const { getByLabelText } = render(<BasicPopover defaultOpen gutter={0} />);
    await waitForPositioning();

    expect(getByLabelText("Popover").parentElement).toHaveStyle({
      transform: "translate(0px, 0px)",
    });
  });
});

describe("PopoverBody", () => {
  // The bottom fade and the padding it needs hang off data-overflow, so a body that fits
  // must not carry the attribute — otherwise short content fades into the surface with no
  // scroll available to clear it.
  it("leaves a body that fits unflagged", async () => {
    const { getByTestId } = render(<BasicPopover defaultOpen />);
    await waitForPositioning();

    expect(getByTestId("body")).not.toHaveAttribute("data-overflow");
  });

  // `lazyMount` keeps the content subtree out of the DOM until the first open, so the body
  // node attaches after PopoverBody's own mount would have run. Measurement has to start
  // from the node, not from a mount effect that already came and went.
  it("measures a body that mounts only on the first open", async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId, queryByTestId } = render(<BasicPopover />);
    await waitForPositioning();

    expect(queryByTestId("body")).toBeNull();

    await user.click(getByText("Open Popover"));

    const body = getByTestId("body");
    setScrollMetrics(body, { scrollHeight: 400, clientHeight: 200 });

    expect(body).toHaveAttribute("data-overflow");
  });

  it("drops the flag once the body fits again", async () => {
    const { getByTestId } = render(<BasicPopover defaultOpen />);
    await waitForPositioning();

    const body = getByTestId("body");
    setScrollMetrics(body, { scrollHeight: 400, clientHeight: 200 });
    expect(body).toHaveAttribute("data-overflow");

    setScrollMetrics(body, { scrollHeight: 200, clientHeight: 200 });
    expect(body).not.toHaveAttribute("data-overflow");
  });

  it("flags the body as scrolled once it leaves the top", async () => {
    const { getByTestId } = render(<BasicPopover defaultOpen />);
    await waitForPositioning();

    const body = getByTestId("body");
    expect(body).not.toHaveAttribute("data-scrolled");

    setScrollMetrics(body, { scrollTop: 40, scrollHeight: 400, clientHeight: 200 });
    expect(body).toHaveAttribute("data-scrolled");
  });
});
