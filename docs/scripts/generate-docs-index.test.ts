import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { docsIndexSchema, type DocsIndex } from "../../packages/cli/src/schema";

const docsIndex: DocsIndex = docsIndexSchema.parse(
  JSON.parse(readFileSync(path.join(import.meta.dir, "../public/__docs__/index.json"), "utf-8")),
);

function findItem(categoryId: string, sectionId: string, itemId: string) {
  const category = docsIndex.categories.find((item) => item.id === categoryId);
  const section = category?.sections.find((item) => item.id === sectionId);

  return section?.items.find((item) => item.id === itemId);
}

describe("generated docs index snippet keys", () => {
  it("React content uses react/ui registry snippets", () => {
    expect(findItem("react", "components", "action-button")?.snippetKey).toBe(
      "react/ui:action-button",
    );
  });

  it("Breeze content uses react/breeze registry snippets", () => {
    expect(findItem("breeze", "components", "animate-number")?.snippetKey).toBe(
      "react/breeze:animate-number",
    );
  });

  it("Lynx content uses lynx/ui registry snippets", () => {
    expect(findItem("lynx", "components", "checkbox")?.snippetKey).toBe("lynx/ui:checkbox");
  });

  it("Lynx content does not fall back to React snippets with the same id", () => {
    expect(findItem("lynx", "components", "action-button")?.snippetKey).toBeUndefined();
  });
});

describe("generated docs index order", () => {
  it("uses the document URL as a stable tie-breaker for duplicate item IDs", () => {
    const react = docsIndex.categories.find((category) => category.id === "react");
    const components = react?.sections.find((section) => section.id === "components");
    const compositionUrls = components?.items
      .filter((item) => item.id === "composition")
      .map((item) => item.docUrl);

    expect(compositionUrls).toEqual([
      "/react/components/concepts/composition",
      "/react/components/iconography/composition",
    ]);
  });
});
