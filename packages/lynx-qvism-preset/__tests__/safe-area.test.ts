import { expect, test } from "bun:test";

import { globalCss } from "../src/global";
import bottomSheet from "../src/recipes/bottom-sheet";

test("globalCss does not define safe area variables with :root env fallback", () => {
  expect(globalCss[":root"]?.["--seed-safe-area-top"]).toBeUndefined();
  expect(globalCss[":root"]?.["--seed-safe-area-bottom"]).toBeUndefined();
});

test("bottom sheet content uses the root safe area CSS variable", () => {
  expect(bottomSheet.base.content?.paddingBottom).toBe("var(--seed-safe-area-bottom, 0px)");
});
