import { describe, expect, it } from "bun:test";
import { bundleLynxWebCoreStyles } from "./web-core-styles.js";

describe("Lynx Web Shadow DOM CSS", () => {
  it("web-core와 web-elements의 layout 규칙을 하나의 CSS로 묶는다", async () => {
    const css = await bundleLynxWebCoreStyles();

    expect(css).not.toContain("@import");
    expect(css).toContain("box-sizing: border-box");
    expect(css).toContain("var(--flex-direction)");
    expect(css).toContain('lynx-default-display-linear="false"');
    expect(css).toContain(
      ":host {\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}",
    );
    expect(css).toContain("x-textarea:defined::part(textarea) {\n  padding: 0;\n}");
    expect(css).toContain(".seed-radio__label--size_medium");
    expect(css).toContain(".seed-radio__label--size_large");
    expect(css).toContain(".seed-checkbox__label--size_medium");
    expect(css).toContain(".seed-checkbox__label--size_large");
  });
});
