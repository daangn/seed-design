import { describe, expect, it } from "bun:test";

import checkmark from "./src/recipes/checkmark";
import { checkmark as vars } from "./src/vars/component";

describe("Lynx checkmark recipe", () => {
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
