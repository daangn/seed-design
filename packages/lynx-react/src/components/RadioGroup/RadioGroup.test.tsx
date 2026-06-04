import "@testing-library/jest-dom";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("RadioGroup", () => {
  it("generates top-aligned radio and radiomark label correction styles", () => {
    const radioCss = readFileSync(join(process.cwd(), "../lynx-css/recipes/radio.css"), "utf8");
    const radiomarkCss = readFileSync(
      join(process.cwd(), "../lynx-css/recipes/radiomark.css"),
      "utf8",
    );

    expect(radioCss).toMatch(/\.seed-radio__root\s*\{[\s\S]*align-items:\s*flex-start/);
    expect(radioCss).toMatch(/\.seed-radio__root--size_medium\s*\{[\s\S]*--radiomark-margin-top:/);
    expect(radioCss).toMatch(/\.seed-radio__label--size_medium\s*\{[\s\S]*margin-top:\s*calc\(/);
    expect(radiomarkCss).toMatch(
      /\.seed-radiomark__root\s*\{[\s\S]*margin-top:\s*var\(--radiomark-margin-top, 0\)/,
    );
  });
});
