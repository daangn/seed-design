import { switchmark } from "@seed-design/lynx-css/recipes/switchmark";
import { describe, expect, it } from "vitest";

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
});
