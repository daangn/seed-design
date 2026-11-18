import { badge } from "@seed-design/css/recipes/badge";
import { SCALE_FEEDBACK_CLASS_NAME } from "@seed-design/css/scale-feedback";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { BadgeAction, BadgeLabel, BadgePrefix, BadgeRoot } from "./Badge";

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

  it("renders a prefix and action together", () => {
    const classNames = badge();
    const { getByRole, getByText } = render(
      <BadgeRoot>
        <BadgePrefix>New</BadgePrefix>
        <BadgeAction aria-label="Details" />
      </BadgeRoot>,
    );

    expect(getByText("New")).toHaveClass(classNames.prefix);
    expect(getByRole("button", { name: "Details" })).toHaveClass(classNames.action);
  });
});
