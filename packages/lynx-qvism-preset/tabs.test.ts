import { describe, expect, it } from "bun:test";

import tabs from "./src/recipes/tabs";
import { tab as triggerVars, tablist as vars } from "./src/vars/component";

describe("Lynx tabs recipe", () => {
  it("defines an enabled label transition and disabled overrides", () => {
    expect(tabs.base["triggerLabel"]).toEqual({
      whiteSpace: "nowrap",
      color: triggerVars.base.enabled.label.color,
      transitionProperty: "color",
      transitionDuration: vars.base.enabled.indicator.transformDuration,
      transitionTimingFunction: vars.base.enabled.indicator.transformTimingFunction,
    });
    expect(tabs.variants["transitionEnabled"]["false"]["triggerLabel"]).toEqual({
      transitionDuration: "0s",
    });
    expect(tabs.variants["transitionEnabled"]["false"]["indicator"]).toEqual({
      transitionDuration: "0s",
    });
  });
});
