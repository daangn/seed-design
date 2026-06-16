import { describe, expect, test } from "bun:test";

import { engaged, pseudo } from "../src/utils/pseudo";
import sidePanel from "../src/recipes/side-panel";

describe("sidePanel recipe", () => {
  test("close button changes icon color without adding a background when engaged", () => {
    const closeButton = sidePanel.base.closeButton as unknown as Record<
      string,
      Record<string, unknown>
    >;
    const engagedStyles = closeButton[pseudo(engaged)];

    expect(engagedStyles).toMatchObject({
      "--seed-icon-color": "var(--seed-color-fg-neutral)",
    });
    expect(engagedStyles).not.toHaveProperty("background");
  });
});
