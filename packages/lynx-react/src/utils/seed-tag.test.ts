import { describe, expect, it } from "vitest";

import { seedTag } from "./seed-tag";

const spec = {
  name: "ActionButton",
  axes: ["variant", "size", "layout"],
  defaults: { variant: "brandSolid", size: "medium", layout: "withText" },
};

describe("seedTag", () => {
  it("writes Rootage axes in spec order regardless of input order", () => {
    expect(seedTag(spec, { layout: "iconOnly", size: "small", variant: "ghost" })).toBe(
      "seed:ActionButton;variant=ghost;size=small;layout=iconOnly",
    );
  });

  it("drops states and keys outside the spec axes", () => {
    expect(seedTag(spec, { disabled: true, loading: true, pressed: true, bleed: 8 })).toBe(
      "seed:ActionButton;variant=brandSolid;size=medium;layout=withText",
    );
  });

  it("fills missing and null values from defaults and omits axes without a value", () => {
    expect(
      seedTag(
        { name: "Tablist", axes: ["layout", "size"], defaults: { size: "small" } },
        { layout: undefined, size: null },
      ),
    ).toBe("seed:Tablist;size=small");
  });

  it("writes only the name when the spec has no axes", () => {
    expect(seedTag({ name: "Float", axes: [], defaults: {} }, { placement: "top-start" })).toBe(
      "seed:Float",
    );
  });
});
