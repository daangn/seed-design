import { describe, expect, it } from "vitest";

import { handleBleed } from "./styled";

describe("handleBleed", () => {
  it("negates zero and px lengths", () => {
    expect(handleBleed(0, "0px")).toBe("calc(0px * -1)");
    expect(handleBleed("16px", "0px")).toBe("calc(16px * -1)");
  });

  it("negates the safe area inset it is given", () => {
    expect(handleBleed("safeArea", "59px")).toBe("calc(59px * -1)");
    expect(handleBleed("safeArea", "env(safe-area-inset-left)")).toBe(
      "calc(env(safe-area-inset-left) * -1)",
    );
  });

  it("returns undefined without a bleed value", () => {
    expect(handleBleed(undefined, "59px")).toBeUndefined();
  });
});
