import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const checkmarkCssPath = join(currentDir, "../../../..", "lynx-css", "recipes", "checkmark.css");

describe("generated Lynx checkmark CSS", () => {
  it("keeps React-parity color transitions", () => {
    const css = readFileSync(checkmarkCssPath, "utf8");
    const rootRule = css.match(/\.seed-checkmark__root\s*\{[^}]*\}/)?.[0] ?? "";
    const ghostIconRule = css.match(/\.seed-checkmark__icon--variant_ghost\s*\{[^}]*\}/)?.[0] ?? "";

    expect(rootRule).toContain("transition:");
    expect(rootRule).toContain("background-color");
    expect(ghostIconRule).toContain("transition:");
    expect(ghostIconRule).toContain("color");
  });

  it("uses background shorthand for generated root color states", () => {
    const css = readFileSync(checkmarkCssPath, "utf8");
    const stateRules = [
      ".seed-checkmark__root--variant_square-tone_brand-checked_true-disabled_false",
      ".seed-checkmark__root--variant_ghost-pressed_true-checked_false-indeterminate_false-disabled_false",
      ".seed-checkmark__root--variant_ghost-tone_neutral-pressed_true-checked_true-disabled_false",
      ".seed-checkmark__root--variant_ghost-tone_brand-pressed_true-checked_true-disabled_false",
    ];

    for (const selector of stateRules) {
      const rule = css.match(new RegExp(`${selector}\\s*\\{[^}]*\\}`))?.[0] ?? "";

      expect(rule).toContain("background:");
      expect(rule).not.toContain("background-color:");
    }
  });
});
