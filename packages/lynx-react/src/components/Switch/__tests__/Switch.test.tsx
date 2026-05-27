import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import { SwitchControl, SwitchLabel, SwitchRoot, SwitchThumb } from "../Switch";

const currentDir = dirname(fileURLToPath(import.meta.url));
const lynxCssRecipesDir = join(currentDir, "..", "..", "..", "..", "..", "lynx-css", "recipes");
const switchCss = readFileSync(join(lynxCssRecipesDir, "switch.css"), "utf8");
const switchmarkCss = readFileSync(join(lynxCssRecipesDir, "switchmark.css"), "utf8");

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRootView() {
  const root = getRenderedRoot();
  return root.matches("view") ? root : root.querySelector("view")!;
}

describe("Switch", () => {
  it.each(["16", "24", "32"] as const)("includes selected thumb class for size %s", (size) => {
    const classNames = switchmark({
      tone: "brand",
      size,
      checked: true,
      disabled: false,
    });

    expect(classNames.thumb.split(" ")).toContain(
      `seed-switchmark__thumb--size_${size}-checked_true`,
    );
  });

  it("aligns Lynx switch content with flex center instead of margin compensation", () => {
    expect(switchCss).toContain("align-items: center");
    expect(switchCss).not.toContain("justify-content: space-between");
    expect(switchCss).not.toContain("--switchmark-margin-top");
    expect(switchmarkCss).not.toContain("--switchmark-margin-top");
  });

  it("uses recipe className as the styling source of truth", () => {
    render(
      <SwitchRoot defaultChecked size="24">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>알림</SwitchLabel>
      </SwitchRoot>,
    );

    getRenderedQueries().getByText("알림");
    const root = getRootView();

    expect(root).toHaveClass("seed-switch__root");
    expect(root).not.toHaveClass("ui-checked");
    expect(getRenderedRoot().querySelector(".seed-switchmark__root")).toHaveClass(
      switchmark({
        tone: "brand",
        size: "24",
        checked: true,
        disabled: false,
      }).root,
    );
  });

  it("keeps checked/defaultChecked/onCheckedChange behavior through headless state", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>알림</SwitchLabel>
      </SwitchRoot>,
    );

    getRenderedQueries().getByText("알림");
    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).not.toHaveClass("ui-checked");
    expect(getRenderedRoot().querySelector(".seed-switchmark__root")).toHaveClass(
      switchmark({
        tone: "brand",
        size: "32",
        checked: true,
        disabled: false,
      }).root,
    );
  });

  it("does not change disabled switch on tap", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot disabled defaultChecked={false} onCheckedChange={onCheckedChange}>
        <SwitchLabel>알림</SwitchLabel>
      </SwitchRoot>,
    );

    getRenderedQueries().getByText("알림");
    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).not.toHaveClass("ui-disabled");
    expect(root).not.toHaveClass("ui-checked");
  });
});
