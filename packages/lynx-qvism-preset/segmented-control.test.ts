import { describe, expect, it } from "bun:test";

import segmentedControl from "./src/recipes/segmented-control";

describe("Lynx segmented control recipe", () => {
  it("uses intrinsic root width without forcing labels onto one line", () => {
    expect(segmentedControl.base.root).toMatchObject({
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "1fr",
      width: "max-content",
      maxWidth: "100%",
    });
    expect(segmentedControl.base.label).toMatchObject({ textAlign: "center" });
    expect(segmentedControl.base.label).not.toHaveProperty("whiteSpace");
  });
});
