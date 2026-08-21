import { describe, expect, it } from "bun:test";
import { buildDocsPageMetadata } from "./seo";

describe("buildDocsPageMetadata", () => {
  it("emits an Open Graph + Twitter card even when the page has no cover image", () => {
    // Regression: components/docs/breeze routes previously returned a bare
    // { title, description } object, so their pages shipped no OG/Twitter image.
    const meta = buildDocsPageMetadata({ title: "Button", description: "A button." });

    expect(meta.metadataBase).toBeInstanceOf(URL);
    const ogImages = meta.openGraph?.images;
    expect(Array.isArray(ogImages) ? ogImages.length : 0).toBeGreaterThan(0);
    const twitter = meta.twitter;
    expect(twitter && "card" in twitter ? twitter.card : undefined).toBe("summary_large_image");
    expect(meta.title).toBe("Button");
  });

  it("appends a (Deprecated) suffix when deprecated", () => {
    const meta = buildDocsPageMetadata({ title: "Old Thing", deprecated: true });
    expect(meta.title).toBe("Old Thing (Deprecated)");
  });

  it("does not double-append when the title already carries (Deprecated)", () => {
    const meta = buildDocsPageMetadata({ title: "Old Thing (Deprecated)", deprecated: true });
    expect(meta.title).toBe("Old Thing (Deprecated)");
  });

  it("prefers the content heading over the frontmatter title for display", () => {
    const meta = buildDocsPageMetadata({ title: "Overview", heading: "Foundations" });
    expect(meta.title).toBe("Foundations");
  });
});
