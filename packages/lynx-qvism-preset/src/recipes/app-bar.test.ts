import { describe, expect, it } from "vitest";

import { appBar } from "./app-bar";

describe("appBar recipe", () => {
  it("aligns side slots to the navigation content height for each theme", () => {
    expect(appBar.variants.theme.cupertino.left).toMatchObject({
      height: "44px",
    });
    expect(appBar.variants.theme.cupertino.right).toMatchObject({
      height: "44px",
    });
    expect(appBar.variants.theme.android.left).toMatchObject({
      height: "56px",
    });
    expect(appBar.variants.theme.android.right).toMatchObject({
      height: "56px",
    });
  });
});
