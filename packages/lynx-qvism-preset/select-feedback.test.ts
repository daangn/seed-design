import { describe, expect, it } from "bun:test";
import { selectItem, selectTrigger } from "./src/recipes/select";
import { selectItem as itemVars, selectTrigger as triggerVars } from "./src/vars/component";

describe("Select feedback", () => {
  it("gates trigger active background on both disabled and readOnly", () => {
    const active = selectTrigger.compoundVariants.find(
      (entry) => entry.css.root?.["&:active .seed-select-trigger__pressedOverlay"],
    );
    expect(active).toMatchObject({ disabled: false, readOnly: false });
    expect(active?.css.root?.["&:active .seed-select-trigger__pressedOverlay"]).toEqual({
      backgroundColor: triggerVars.base.pressed.root.color,
    });
    expect(selectTrigger.base.pressedOverlay.transitionProperty).toBe("background-color");
  });

  it("matches React's background and inset transitions without scaling the background", () => {
    expect(selectItem.base.pressedOverlay).toMatchObject({
      left: 0,
      right: 0,
      backgroundColor: "transparent",
      transitionProperty: "background-color, left, right",
      transitionDuration: `${itemVars.base.enabled.root.colorDuration}, ${itemVars.base.enabled.root.marginDuration}, ${itemVars.base.enabled.root.marginDuration}`,
      transitionTimingFunction: `${itemVars.base.enabled.root.colorTimingFunction}, ${itemVars.base.enabled.root.marginTimingFunction}, ${itemVars.base.enabled.root.marginTimingFunction}`,
    });
    const pressed = selectItem.compoundVariants.find((entry) => entry.pressed);
    expect(
      selectItem.variants.disabled.false.root["&:active .seed-select-item__pressedOverlay"],
    ).toEqual(pressed?.css.pressedOverlay);
    expect(selectItem.variants.disabled.true).not.toHaveProperty("root");
  });
});
