import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { SwitchControl, SwitchLabel, SwitchRoot, SwitchThumb } from "../Switch";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
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

  it("leaves the 16px control offset to the recipe class", () => {
    render(
      <SwitchRoot size="16">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>OffOff</SwitchLabel>
      </SwitchRoot>,
    );

    const control = getRenderedRoot().querySelector(".seed-switchmark__root");

    expect((control as HTMLElement).className.split(" ")).toContain(
      "seed-switchmark__root--size_16",
    );
    expect((control as HTMLElement).style.getPropertyValue("margin-top")).toBe("");
  });

  it("forwards explicit control style", () => {
    render(
      <SwitchRoot size="16">
        <SwitchControl style={{ marginTop: "10px" }}>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>OffOff</SwitchLabel>
      </SwitchRoot>,
    );

    const control = getRenderedRoot().querySelector(".seed-switchmark__root");

    expect((control as HTMLElement).style.getPropertyValue("margin-top")).toBe("10px");
  });
});
