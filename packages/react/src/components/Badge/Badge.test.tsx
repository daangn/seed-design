import { badge } from "@seed-design/css/recipes/badge";
import { SCALE_FEEDBACK_CLASS_NAME } from "@seed-design/css/scale-feedback";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { BadgeAction, BadgeLabel, BadgePrefix, BadgeRoot } from "./Badge";

function SwappableAccessory() {
  const [showAction, setShowAction] = React.useState(true);

  return showAction ? (
    <BadgeAction aria-label="Show prefix" onClick={() => setShowAction(false)} />
  ) : (
    <BadgePrefix>New</BadgePrefix>
  );
}

describe("Badge", () => {
  it("applies root and label classes", () => {
    const classNames = badge();
    const { container } = render(
      <BadgeRoot>
        <BadgeLabel>New</BadgeLabel>
      </BadgeRoot>,
    );

    expect(container.firstElementChild).toHaveClass(classNames.root);
    expect(container.querySelector("span span")).toHaveClass(classNames.label);
  });

  it("renders prefix without an action", () => {
    const classNames = badge();
    const { container } = render(
      <BadgeRoot>
        <BadgePrefix>New</BadgePrefix>
      </BadgeRoot>,
    );

    expect(container.querySelector("span span")).toHaveClass(classNames.prefix);
  });

  it("renders action without a prefix", () => {
    const classNames = badge();
    const { getByRole } = render(
      <BadgeRoot>
        <BadgeAction aria-label="Dismiss" />
      </BadgeRoot>,
    );

    const action = getByRole("button", { name: "Dismiss" });
    expect(action).toHaveClass(classNames.action, SCALE_FEEDBACK_CLASS_NAME);
    expect(action).toHaveAttribute("type", "button");
  });

  it("allows replacing an action with a prefix", () => {
    const { getByRole, getByText } = render(
      <BadgeRoot>
        <SwappableAccessory />
      </BadgeRoot>,
    );

    fireEvent.click(getByRole("button", { name: "Show prefix" }));

    expect(getByText("New")).toHaveClass(badge().prefix);
  });

  it("rejects a prefix and action together", () => {
    expect(() =>
      render(
        <BadgeRoot>
          <BadgePrefix>New</BadgePrefix>
          <BadgeAction aria-label="Dismiss" />
        </BadgeRoot>,
      ),
    ).toThrow("Badge.Prefix and Badge.Action cannot be used together.");
  });
});
