import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import * as React from "react";

import { TooltipPositioner, TooltipRoot, TooltipTrigger, type TooltipRootProps } from "./Tooltip";

function setUp(jsx: ReactElement) {
  return render(jsx);
}

const Tooltip = React.forwardRef<HTMLButtonElement, Omit<TooltipRootProps, "children">>(
  (props, ref) => (
    <TooltipRoot {...props}>
      <TooltipTrigger ref={ref}>trigger</TooltipTrigger>
      <TooltipPositioner data-testid="positioner" />
    </TooltipRoot>
  ),
);

describe("useTooltip a11y contract", () => {
  // floating-ui owns the interaction behavior (hover/focus timing, dismiss, positioning).
  // What it does NOT guarantee is that *we* wired this up as a tooltip rather than a dialog,
  // so that is the one thing worth locking down here.
  it("renders as a tooltip and links the trigger via aria-describedby — never dialog aria", async () => {
    const { findByTestId, getByRole } = setUp(<Tooltip open />);

    // Await a query first so floating-ui's positioning/transition effects flush inside act.
    const positioner = await findByTestId("positioner");
    const trigger = getByRole("button", { name: "trigger" });

    // The floating element is a tooltip, not a dialog.
    expect(positioner).toHaveAttribute("role", "tooltip");

    // The trigger is described by the tooltip, with no dialog-style aria.
    expect(positioner.id).toBeTruthy();
    expect(trigger).toHaveAttribute("aria-describedby", positioner.id);
    expect(trigger).not.toHaveAttribute("aria-haspopup");
    expect(trigger).not.toHaveAttribute("aria-expanded");
  });
});

describe("useTooltip content pointer-events", () => {
  // floating-ui hands us positioning styles; the decision to *also* block pointer
  // events on the content (so hovering it can't keep the tooltip open) is ours.
  it("blocks pointer events on the content by default", async () => {
    const { findByTestId } = setUp(<Tooltip open />);

    const positioner = await findByTestId("positioner");

    expect(positioner.style.pointerEvents).toBe("none");
  });

  it("leaves pointer events untouched when keepOpenOnContentHover is set", async () => {
    const { findByTestId } = setUp(<Tooltip open keepOpenOnContentHover />);

    const positioner = await findByTestId("positioner");

    expect(positioner.style.pointerEvents).toBe("");
  });
});

describe("useTooltip state data-attributes", () => {
  // Mapping floating-ui's placement/transition status onto our data-* contract is
  // our glue, so lock the mapping itself — not floating-ui's positioning behavior.
  it("maps placement onto data-side / data-alignment", async () => {
    const { findByTestId } = setUp(<Tooltip open placement="right-start" />);

    const positioner = await findByTestId("positioner");

    expect(positioner).toHaveAttribute("data-side", "right");
    expect(positioner).toHaveAttribute("data-alignment", "start");
  });

  it("sets data-open and clears data-hidden while open", async () => {
    const { findByTestId } = setUp(<Tooltip open />);

    const positioner = await findByTestId("positioner");

    expect(positioner).toHaveAttribute("data-open");
    expect(positioner).not.toHaveAttribute("data-hidden");
  });

  it("marks the content hidden while closed", async () => {
    const { findByTestId } = setUp(<Tooltip />);

    const positioner = await findByTestId("positioner");

    expect(positioner).not.toHaveAttribute("data-open");
    expect(positioner).toHaveAttribute("data-hidden");
  });
});
