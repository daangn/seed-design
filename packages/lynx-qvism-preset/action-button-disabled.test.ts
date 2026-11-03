import { describe, expect, it } from "bun:test";

import actionButton from "./src/recipes/action-button";
import { actionButton as tokens } from "./src/vars/component";

const variants = [
  "variantBrandSolid",
  "variantNeutralSolid",
  "variantNeutralWeak",
  "variantCriticalSolid",
  "variantBrandOutline",
  "variantNeutralOutline",
  "variantGhost",
] as const;

describe("ActionButton shared disabled foreground", () => {
  it("only shares foreground while all supported variants have the same token values", () => {
    for (const variant of variants) {
      expect(actionButton.variants.disabled.true).toEqual({
        text: { color: tokens[variant].disabled.label.color },
        prefixIcon: { color: tokens[variant].disabled.prefixIcon.color },
        suffixIcon: { color: tokens[variant].disabled.suffixIcon.color },
        icon: { color: tokens[variant].disabled.icon.color },
      });
    }
  });

  it("retains variant-specific disabled root styles", () => {
    const disabledRules = actionButton.compoundVariants.filter(
      (rule) => "disabled" in rule && rule.disabled === true,
    );
    expect(disabledRules.map((rule) => Object.keys(rule.css))).toEqual(
      Array.from({ length: 7 }, () => ["root"]),
    );
    expect(disabledRules.map((rule) => rule.css.root)).toEqual([
      { background: tokens.variantBrandSolid.disabled.root.color },
      { background: tokens.variantNeutralSolid.disabled.root.color },
      { background: tokens.variantNeutralWeak.disabled.root.color },
      { background: tokens.variantCriticalSolid.disabled.root.color },
      {
        background: tokens.variantBrandOutline.disabled.root.color,
        borderColor: tokens.variantBrandOutline.disabled.root.strokeColor,
      },
      {
        background: tokens.variantNeutralOutline.disabled.root.color,
        borderColor: tokens.variantNeutralOutline.disabled.root.strokeColor,
      },
      { background: tokens.variantGhost.disabled.root.color },
    ]);
  });
});
