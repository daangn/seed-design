import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const lynxCssRecipesDir = join(currentDir, "..", "..", "..", "..", "lynx-css", "recipes");
const switchCss = readFileSync(join(lynxCssRecipesDir, "switch.css"), "utf8");
const switchmarkCss = readFileSync(join(lynxCssRecipesDir, "switchmark.css"), "utf8");

describe("Switch", () => {
  it.each(["16", "24", "32"] as const)(
    "includes selected thumb class for size %s",
    (size) => {
      const classNames = switchmark({
        tone: "brand",
        size,
        checked: true,
        disabled: false,
      });

      expect(classNames.thumb.split(" ")).toContain(
        `seed-switchmark__thumb--size_${size}-checked_true`,
      );
    },
  );

  it("aligns Lynx switch content with flex center instead of margin compensation", () => {
    expect(switchCss).toContain("align-items: center");
    expect(switchCss).not.toContain("--switchmark-margin-top");
    expect(switchmarkCss).not.toContain("--switchmark-margin-top");
  });
});
