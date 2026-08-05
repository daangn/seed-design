import { describe, expect, it } from "bun:test";
import { renderLLMMarkdown } from "../render-test-utils";

describe("icon library handler", () => {
  it("writes one table per icon set", async () => {
    const actual = await renderLLMMarkdown("<IconLibrary />");

    expect(actual).toContain(
      "## Monochrome Icons\n\n| Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |\n| --- | --- | --- | --- | --- | --- |",
    );
    expect(actual).toContain(
      "## Multicolor Icons\n\n| Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |\n| --- | --- | --- | --- | --- | --- |",
    );
    expect(actual).not.toContain("IconLibrary");
  });

  it("carries the icon's component name, Figma name and search metadata", async () => {
    const actual = await renderLLMMarkdown("<IconLibrary />");

    expect(actual).toContain(
      "| icon_animal_face | IconAnimalFace | 🟢 icon_animal_face | 반려동물, 동물, 강아지, 고양이, 얼굴, animal, cat, dog, face |  |  |",
    );
  });

  it("sorts each set by icon name", async () => {
    const actual = await renderLLMMarkdown("<IconLibrary />");

    for (const section of actual.split("## ").filter((part) => part.includes("| Icon Name |"))) {
      const names = section
        .split("\n")
        .filter((line) => line.startsWith("| icon_"))
        .map((line) => line.split(" | ")[0].slice(2));

      expect(names.length).toBeGreaterThan(10);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    }
  });

  it("keeps surrounding prose around the tables", async () => {
    const actual = await renderLLMMarkdown("앞 문단\n\n<IconLibrary />\n\n뒤 문단");

    expect(actual.startsWith("앞 문단\n\n## Monochrome Icons")).toBe(true);
    expect(actual.endsWith("뒤 문단")).toBe(true);
  });
});
