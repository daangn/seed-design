import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const hookSourcePath = join(currentDir, "..", "use-icon-color.ts");

describe("useIconColor", () => {
  it("keeps a next-frame tint sync for class-driven color changes", () => {
    const source = readFileSync(hookSourcePath, "utf8");

    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain("syncTintColorOnce");
  });
});
