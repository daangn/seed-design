import { describe, expect, it } from "bun:test";

import accordion from "./src/recipes/accordion";
import actionButton from "./src/recipes/action-button";
import callout from "./src/recipes/callout";
import checkbox from "./src/recipes/checkbox";
import pageBanner from "./src/recipes/page-banner";
import radio from "./src/recipes/radio";
import segmentedControl from "./src/recipes/segmented-control";
import { selectBox } from "./src/recipes/select-box";

describe("Lynx active feedback", () => {
  it("gates self feedback with enabled interaction variants", () => {
    expect(actionButton.compoundVariants).toContainEqual({
      variant: "brandSolid",
      disabled: false,
      loading: false,
      css: {
        root: expect.objectContaining({
          "&:active": expect.any(Object),
        }),
      },
    });
    expect(callout.compoundVariants).toContainEqual({
      tone: "neutral",
      interactive: true,
      css: {
        root: expect.objectContaining({
          "&:active": expect.any(Object),
        }),
      },
    });
  });

  it("targets content feedback from the enabled trigger", () => {
    expect(
      accordion.variants.disabled.false.trigger?.["&:active .seed-accordion__pressedOverlay"],
    ).toBeDefined();
    expect(checkbox.variants.disabled.false.root?.["&:active .seed-checkmark__root"]).toBeDefined();
    expect(radio.variants.disabled.false.root?.["&:active .seed-radiomark__root"]).toBeDefined();
  });

  it("transitions the page banner close button on the main thread", () => {
    expect(pageBanner.base.closeButton).toMatchObject({
      transition: expect.stringContaining("background-color"),
      "&:active": expect.objectContaining({ backgroundColor: expect.any(String) }),
    });
  });

  it("gates page banner active backgrounds and matches the pressed fallback", () => {
    expect(pageBanner.base.root).not.toHaveProperty("&:active");
    expect(pageBanner.variants.interactive.true).not.toHaveProperty("root");
    const compounds = pageBanner.compoundVariants ?? [];
    const pressedVariants = compounds.filter((variant) => variant.pressed === true);
    expect(pressedVariants).toHaveLength(11);
    for (const pressed of pressedVariants) {
      const active = compounds.find(
        (variant) =>
          variant.tone === pressed.tone &&
          variant.variant === pressed.variant &&
          variant.interactive === true,
      );
      expect(active?.css.root?.["&:active"]).toEqual(pressed.css.root);
      expect(Object.keys(active?.css.root?.["&:active"] ?? {})).toEqual([
        pressed.tone === "magic" ? "backgroundImage" : "backgroundColor",
      ]);
    }
    for (const variant of compounds) {
      if (variant.css.root?.["&:active"]) expect(variant.interactive).toBe(true);
    }
  });

  it("gates select box and segmented feedback with resolved disabled state", () => {
    expect(selectBox.variants.disabled.false.root["&:active"]).toBeDefined();
    expect(selectBox.variants.disabled.true.root).not.toHaveProperty("&:active");
    expect(
      segmentedControl.variants.disabled.false.item[
        "&:active .seed-segmented-control__itemBackground"
      ],
    ).toEqual({ opacity: 1 });
    expect(segmentedControl.variants.disabled.true).not.toHaveProperty("item");
    expect(segmentedControl.compoundVariants).toContainEqual({
      disabled: true,
      pressed: true,
      css: { itemBackground: { opacity: 0 } },
    });
  });
});
