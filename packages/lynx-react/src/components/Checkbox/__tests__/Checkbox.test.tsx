import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as React from "@lynx-js/react";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../../types";
import { CheckboxControl, CheckboxIndicator, CheckboxLabel, CheckboxRoot } from "../Checkbox";

const currentDir = dirname(fileURLToPath(import.meta.url));
const lynxCssRecipesDir = join(currentDir, "..", "..", "..", "..", "..", "lynx-css", "recipes");
const checkboxCss = readFileSync(join(lynxCssRecipesDir, "checkbox.css"), "utf8");
const checkmarkCss = readFileSync(join(lynxCssRecipesDir, "checkmark.css"), "utf8");

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

const MockIcon = React.forwardRef<unknown, LynxIconElementProps>((props, ref) => {
  const { className, style, ...rest } = props;

  return (
    <image
      {...rest}
      {...(ref ? { "main-thread:ref": ref as React.Ref<unknown> } : {})}
      className={className}
      style={style}
    />
  );
});
MockIcon.displayName = "MockIcon";

describe("Checkbox", () => {
  it("merges parent and local variant props through context", () => {
    render(
      <CheckboxRoot defaultChecked size="large" weight="bold" tone="brand">
        <CheckboxControl tone="neutral" variant="ghost" />
        <CheckboxLabel>동의</CheckboxLabel>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();
    const { getByText } = getRenderedQueries();

    expect(root.querySelector(".seed-checkmark__root")).toHaveClass(
      checkmark({
        variant: "ghost",
        tone: "neutral",
        size: "large",
        checked: true,
        disabled: false,
        indeterminate: false,
        pressed: false,
      }).root,
    );
    expect(getByText("동의")).toHaveClass(
      checkbox({ size: "large", weight: "bold", disabled: false }).label,
    );
  });

  it("wraps a custom indicator icon with the final checkmark icon class", () => {
    render(
      <CheckboxRoot defaultChecked>
        <CheckboxControl>
          <CheckboxIndicator checked={<MockIcon />} />
        </CheckboxControl>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();
    const iconWrapper = root.querySelector(".seed-checkmark__icon");
    const image = iconWrapper?.querySelector("image");

    expect(iconWrapper).toBeInTheDocument();
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("top-aligns Lynx checkbox content and applies mark margin compensation", () => {
    expect(checkboxCss).toContain("align-items: flex-start");
    expect(checkboxCss).toContain("--checkmark-margin-top");
    expect(checkboxCss).toContain("margin-top:");
    expect(checkmarkCss).toContain("var(--checkmark-margin-top, 0)");
  });
});
