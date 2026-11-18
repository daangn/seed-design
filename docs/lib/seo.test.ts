import { describe, expect, it } from "bun:test";
import { DEFAULT_OG_IMAGE, deprecatedTitle, docsPageOgImage } from "./seo";

describe("deprecatedTitle", () => {
  it("appends a (Deprecated) suffix when deprecated", () => {
    expect(deprecatedTitle("Old Thing", true)).toBe("Old Thing (Deprecated)");
  });

  it("does not double-append when the title already carries (Deprecated)", () => {
    expect(deprecatedTitle("Old Thing (Deprecated)", true)).toBe("Old Thing (Deprecated)");
  });
});

describe("docsPageOgImage", () => {
  it("falls back to the site card when the page has no cover and its section has no card", () => {
    // Regression: pages without a cover image previously shipped no OG/Twitter image.
    expect(docsPageOgImage({ url: "/components/button" }, () => false)).toEqual(DEFAULT_OG_IMAGE);
  });
});
