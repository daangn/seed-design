import { describe, expect, it } from "bun:test";

import chipTabs from "./src/recipes/chip-tabs";
import contextualFloatingButton from "./src/recipes/contextual-floating-button";
import floatingActionButton from "./src/recipes/floating-action-button";
import helpBubble from "./src/recipes/help-bubble";
import { floatingActionButton as fabVars } from "./src/vars/component";

describe("Lynx minor component feedback", () => {
  it("matches every ChipTabs pressed background on the enabled Main Thread path", () => {
    const compounds = chipTabs.compoundVariants;
    const pressed = compounds.filter((variant) => variant.pressed === true);
    expect(pressed).toHaveLength(4);
    for (const fallback of pressed) {
      const active = compounds.find(
        (variant) =>
          variant.variant === fallback.variant &&
          variant.selected === fallback.selected &&
          variant.css.trigger?.["&:active"],
      );
      expect(active?.disabled).toBe(false);
      expect(active?.css.trigger?.["&:active"]).toEqual(fallback.css.trigger);
    }
    expect(chipTabs.base.trigger).not.toHaveProperty("&:active");
  });

  it("gates contextual floating button active feedback for disabled and loading states", () => {
    const compounds = contextualFloatingButton.compoundVariants;
    const pressed = compounds.filter((variant) => variant.pressed === true);
    expect(pressed).toHaveLength(2);
    for (const fallback of pressed) {
      const active = compounds.find(
        (variant) => variant.variant === fallback.variant && variant.css.root?.["&:active"],
      );
      expect(active).toMatchObject({ disabled: false, loading: false });
      expect(active?.css.root?.["&:active"]).toEqual(fallback.css.root);
    }
    expect(contextualFloatingButton.base.root).not.toHaveProperty("&:active");
  });

  it("gates FAB active feedback and keeps its color transition before label measurement", () => {
    expect(floatingActionButton.variants.disabled.false.root["&:active"]).toEqual(
      floatingActionButton.variants.pressed.true.root,
    );
    expect(floatingActionButton.variants.disabled.true).not.toHaveProperty("root");
    expect(floatingActionButton.base.root).not.toHaveProperty("&:active");
    expect(floatingActionButton.variants.transitionEnabled.false.root.transitionDuration).toBe(
      `${fabVars.base.enabled.root.colorDuration}, 0s, 0s, 0s, 0s, 0s`,
    );
    expect(floatingActionButton.base.root.transition.split(", ")[0]).toBe(
      `background-color ${fabVars.base.enabled.root.colorDuration} ${fabVars.base.enabled.root.colorTimingFunction}`,
    );
  });

  it("leaves HelpBubble close transform ownership to measured Scale Feedback", () => {
    expect(helpBubble.base.closeButton).not.toHaveProperty("transform");
    expect(helpBubble.base.closeButton).not.toHaveProperty("transition");
    expect(helpBubble.variants.pressed.true).not.toHaveProperty("closeButton");
  });
});
