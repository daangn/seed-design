import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import {
  type IconRow,
  type RawIconData,
  buildSection,
  buildTable,
  createIconLibraryRule,
  toRow,
} from "./icon-library-rule";

// 이 파일의 아이콘은 전부 합성이다. 실제 @karrotmarket/icon-data에는 `fixture_` 아이콘이 없으므로
// 기대값이 아이콘 패키지 버전에 묶이지 않고, 값의 출처를 헷갈릴 일도 없다.
const icon: RawIconData = {
  name: "fixture_alpha_glyph",
  metadatas: ["fixture-keyword", "service:fixture-service", "tag:fixture-tag"],
  figma: { name: "fixture/alpha/glyph" },
};

describe("toRow", () => {
  it("upper-cases each underscore-separated part to build the React component name", () => {
    expect(toRow(icon).reactComponentName).toBe("FixtureAlphaGlyph");
  });

  it("routes metadata by prefix, trims the value, and drops duplicates and blanks", () => {
    const actual = toRow({
      name: "fixture_solo",
      metadatas: [
        "fixture-keyword",
        "fixture-keyword",
        "service:  fixture-service  ",
        "service:fixture-service",
        "tag:fixture-tag",
        "service:",
        "   ",
      ],
    });

    expect(actual).toEqual({
      name: "fixture_solo",
      reactComponentName: "FixtureSolo",
      figmaName: "",
      keywords: ["fixture-keyword"],
      services: ["fixture-service"],
      tags: ["fixture-tag"],
    });
  });

  it("falls back to an empty Figma name when the icon has no figma entry", () => {
    expect(toRow({ name: "fixture_solo", metadatas: [] }).figmaName).toBe("");
  });
});

describe("buildTable", () => {
  it("renders the header, the separator, and one row per icon with lists joined by commas", () => {
    expect(buildTable([toRow(icon)])).toBe(
      [
        "| Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |",
        "| --- | --- | --- | --- | --- | --- |",
        "| fixture_alpha_glyph | FixtureAlphaGlyph | fixture/alpha/glyph | fixture-keyword | fixture-service | fixture-tag |",
      ].join("\n"),
    );
  });

  it("escapes pipes so an icon name cannot break the table", () => {
    const row: IconRow = {
      name: "fixture|pipe",
      reactComponentName: "FixturePipe",
      figmaName: "",
      keywords: [],
      services: [],
      tags: [],
    };

    expect(buildTable([row]).split("\n").at(-1)).toBe(
      "| fixture\\|pipe | FixturePipe |  |  |  |  |",
    );
  });
});

describe("buildSection", () => {
  it("titles the table with a level-two heading", () => {
    expect(buildSection("Monochrome Icons", [toRow(icon)])).toBe(
      `## Monochrome Icons\n\n${buildTable([toRow(icon)])}`,
    );
  });

  it("returns null when there is no icon to show", () => {
    expect(buildSection("Monochrome Icons", [])).toBeNull();
  });
});

// 알파벳순 정렬이 룰 안에서 걸리는지 보려고 일부러 뒤집힌 순서로 넣는다.
const monochromeIcons: RawIconData[] = [
  {
    name: "fixture_zeta_glyph",
    metadatas: ["fixture-keyword", "service:fixture-service", "tag:fixture-tag"],
    figma: { name: "fixture/zeta/glyph" },
  },
  {
    name: "fixture_alpha_glyph",
    metadatas: [],
    figma: { name: "fixture/alpha/glyph" },
  },
];

const multicolorIcons: RawIconData[] = [
  {
    name: "fixture_hued_glyph",
    metadatas: ["fixture-keyword"],
    figma: { name: "fixture/hued/glyph" },
  },
];

describe("createIconLibraryRule", () => {
  it("emits the monochrome and multicolor sections in order, each sorted by icon name", () => {
    const rule = createIconLibraryRule(monochromeIcons, multicolorIcons);

    expect(normalizeLLMBodyWithRules("<IconLibrary />\n", [rule])).toMatchInlineSnapshot(`
      "## Monochrome Icons

      | Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |
      | --- | --- | --- | --- | --- | --- |
      | fixture_alpha_glyph | FixtureAlphaGlyph | fixture/alpha/glyph |  |  |  |
      | fixture_zeta_glyph | FixtureZetaGlyph | fixture/zeta/glyph | fixture-keyword | fixture-service | fixture-tag |

      ## Multicolor Icons

      | Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |
      | --- | --- | --- | --- | --- | --- |
      | fixture_hued_glyph | FixtureHuedGlyph | fixture/hued/glyph | fixture-keyword |  |  |"
    `);
  });

  it("omits the multicolor section when there is no multicolor icon", () => {
    const rule = createIconLibraryRule(monochromeIcons, []);

    expect(normalizeLLMBodyWithRules("<IconLibrary />\n", [rule])).toMatchInlineSnapshot(`
      "## Monochrome Icons

      | Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |
      | --- | --- | --- | --- | --- | --- |
      | fixture_alpha_glyph | FixtureAlphaGlyph | fixture/alpha/glyph |  |  |  |
      | fixture_zeta_glyph | FixtureZetaGlyph | fixture/zeta/glyph | fixture-keyword | fixture-service | fixture-tag |"
    `);
  });

  it("keeps the original node when both datasets are empty", () => {
    const rule = createIconLibraryRule([], []);

    expect(normalizeLLMBodyWithRules("<IconLibrary />\n", [rule])).toBe("<IconLibrary />");
  });
});
