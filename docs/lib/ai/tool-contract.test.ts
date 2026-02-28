import { describe, expect, it } from "bun:test";
import { getToolDedupeKey, getToolPolicy, shouldDropFencedCodeFromText } from "./tool-contract";

describe("tool-contract", () => {
  it("returns section metadata for known tools", () => {
    expect(getToolPolicy("showComponentExample").section).toBe("examples");
    expect(getToolPolicy("showInstallation").section).toBe("installations");
    expect(getToolPolicy("showReactTypeTable").section).toBe("props");
  });

  it("builds stable dedupe keys from canonical inputs", () => {
    const exampleKey = getToolDedupeKey(
      "showComponentExample",
      { component: "alert-dialog" },
      { previewName: "react/alert-dialog/preview" },
      "fallback",
    );
    const installKey = getToolDedupeKey(
      "showInstallation",
      { name: "alert-dialog" },
      { component: "alert-dialog" },
      "fallback",
    );
    expect(exampleKey).toBe("example:react/alert-dialog/preview");
    expect(installKey).toBe("install:alert-dialog");
  });

  it("marks code-capable tool sets to drop fenced code from plain text", () => {
    expect(shouldDropFencedCodeFromText(["showComponentExample"])).toBe(true);
    expect(shouldDropFencedCodeFromText(["showInstallation"])).toBe(true);
    expect(shouldDropFencedCodeFromText(["unknown-tool"])).toBe(false);
  });
});
