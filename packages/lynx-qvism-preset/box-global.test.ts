import { describe, expect, it } from "bun:test";

import { globalCss } from "./src/global";

const boxSelectors = (pattern: RegExp) =>
  Object.keys(globalCss).filter((selector) => pattern.test(selector));

describe("Lynx Box global rules", () => {
  it("declares spacing rules from all sides to one side, with margin after bleed", () => {
    expect(boxSelectors(/^\.seed-box\.seed-box-(padding|bleed|margin)/)).toEqual([
      ".seed-box.seed-box-padding",
      ".seed-box.seed-box-padding-x",
      ".seed-box.seed-box-padding-y",
      ".seed-box.seed-box-padding-top",
      ".seed-box.seed-box-padding-right",
      ".seed-box.seed-box-padding-bottom",
      ".seed-box.seed-box-padding-left",
      ".seed-box.seed-box-bleed",
      ".seed-box.seed-box-bleed-x",
      ".seed-box.seed-box-bleed-y",
      ".seed-box.seed-box-bleed-top",
      ".seed-box.seed-box-bleed-right",
      ".seed-box.seed-box-bleed-bottom",
      ".seed-box.seed-box-bleed-left",
      ".seed-box.seed-box-margin",
      ".seed-box.seed-box-margin-x",
      ".seed-box.seed-box-margin-y",
      ".seed-box.seed-box-margin-top",
      ".seed-box.seed-box-margin-right",
      ".seed-box.seed-box-margin-bottom",
      ".seed-box.seed-box-margin-left",
    ]);
  });

  it("declares border shorthands before their sides and corners", () => {
    expect(boxSelectors(/^\.seed-box\.seed-box-border-(.+-)?(width|radius)$/)).toEqual([
      ".seed-box.seed-box-border-width",
      ".seed-box.seed-box-border-top-width",
      ".seed-box.seed-box-border-right-width",
      ".seed-box.seed-box-border-bottom-width",
      ".seed-box.seed-box-border-left-width",
      ".seed-box.seed-box-border-radius",
      ".seed-box.seed-box-border-top-left-radius",
      ".seed-box.seed-box-border-top-right-radius",
      ".seed-box.seed-box-border-bottom-right-radius",
      ".seed-box.seed-box-border-bottom-left-radius",
    ]);
  });

  it("negates bleed in the stylesheet", () => {
    expect(globalCss[".seed-box.seed-box-bleed-x"]).toEqual({
      marginLeft: "calc(var(--seed-box-bleed-x) * -1)",
      marginRight: "calc(var(--seed-box-bleed-x) * -1)",
    });
  });
});
