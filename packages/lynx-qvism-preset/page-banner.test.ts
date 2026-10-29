import { describe, expect, it } from "bun:test";

import pageBanner from "./src/recipes/page-banner";

describe("Lynx PageBanner safe area background", () => {
  it("paints a single continuous background when extended, including pressed states", () => {
    const compounds = pageBanner.compoundVariants;
    // These overrides must follow tone and pressed rules with the same specificity.
    expect(compounds.slice(-2)).toEqual([
      {
        extendSafeAreaX: true,
        css: { root: { backgroundColor: "transparent", backgroundImage: "none" } },
      },
      {
        extendSafeAreaX: true,
        interactive: true,
        css: {
          root: {
            "&:active": { backgroundColor: "transparent", backgroundImage: "none" },
          },
        },
      },
    ]);

    for (const compound of compounds) {
      if (!compound.tone) continue;
      const { root, background } = compound.css;
      if (compound.interactive) {
        expect(root?.["&:active .seed-page-banner__background"]).toEqual(root?.["&:active"]);
      } else {
        // Both paths retain identical tone/pressed colors; only extended roots stop painting.
        expect(background).toEqual(root);
      }
    }
    expect(pageBanner.defaultVariants.extendSafeAreaX).toBe(false);
    expect(pageBanner.base.background.pointerEvents).toBe("none");
  });
});
