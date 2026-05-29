import { expect, test } from "bun:test";

import { globalCss } from "./src/global";
import bottomSheet from "./src/recipes/bottom-sheet";

test("globalCss does not define safe area variables with :root env fallback", () => {
  expect(globalCss[":root"]?.["--seed-safe-area-top"]).toBeUndefined();
  expect(globalCss[":root"]?.["--seed-safe-area-bottom"]).toBeUndefined();
});

test("bottom sheet recipe does not depend on a runtime safe area CSS variable", () => {
  expect(bottomSheet.base.content?.paddingBottom).toBeUndefined();
});
