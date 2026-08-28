import { describe, expect, it } from "bun:test";

import checkmark from "./src/recipes/checkmark";
import { checkmark as vars } from "./src/vars/component";

describe("Lynx checkmark recipe", () => {
  it("transitions ghost press feedback with an opacity overlay", () => {
    expect(checkmark.slots).toEqual(["root", "background", "icon"]);
    expect(checkmark.base["root"]).not.toHaveProperty("transition");
    expect(checkmark.base["background"]).toEqual({
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0,
      transition: `opacity ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    });
    expect(checkmark.variants["variant"]["square"]["root"]).toHaveProperty(
      "transition",
      `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    );
    expect(checkmark.variants["variant"]["ghost"]).not.toHaveProperty("root.transition");
    expect(checkmark.variants["variant"]["ghost"]["background"]).toEqual({
      backgroundColor: vars.variantGhost.pressed.root.color,
    });
    expect(checkmark.variants["variant"]["ghost"]["icon"]).not.toHaveProperty("transition");
    expect(checkmark.compoundVariants).toContainEqual({
      variant: "ghost",
      pressed: true,
      disabled: false,
      css: { background: { opacity: 1 } },
    });
    expect(
      checkmark.compoundVariants.some(
        (compound) => compound.variant === "ghost" && "root" in compound.css,
      ),
    ).toBe(false);
  });

  it("keeps the latched selected overlay color when disabled changes", () => {
    expect(checkmark.compoundVariants).toContainEqual({
      variant: "ghost",
      tone: "brand",
      checked: true,
      css: {
        background: {
          backgroundColor: vars.variantGhostToneBrand.pressedSelected.root.color,
        },
      },
    });
    expect(checkmark.compoundVariants).toContainEqual({
      variant: "ghost",
      tone: "neutral",
      indeterminate: true,
      css: {
        background: {
          backgroundColor: vars.variantGhostToneNeutral.pressedSelected.root.color,
        },
      },
    });
  });

  it("uses selected icon colors for indeterminate ghost states", () => {
    expect(checkmark.compoundVariants).toContainEqual({
      variant: "ghost",
      tone: "brand",
      indeterminate: true,
      disabled: false,
      css: {
        icon: { color: vars.variantGhostToneBrand.enabledSelected.icon.color },
      },
    });
    expect(checkmark.compoundVariants).toContainEqual({
      variant: "ghost",
      indeterminate: true,
      disabled: true,
      css: {
        icon: { color: vars.variantGhost.disabledSelected.icon.color },
      },
    });
  });
});
