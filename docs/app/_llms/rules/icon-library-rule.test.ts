import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import {
  type IconRow,
  type RawIconData,
  buildSection,
  buildTable,
  iconLibraryRule,
  toRow,
} from "./icon-library-rule";

// 실제 @karrotmarket/icon-data 대신 쓰는 합성 아이콘. 아이콘 패키지를 올려도 이 기대값은 흔들리지 않는다.
const icon: RawIconData = {
  name: "chevron_right_fill",
  metadatas: ["arrow", "service:market", "tag:filled"],
  figma: { name: "chevron/right/fill" },
};

describe("toRow", () => {
  it("upper-cases each underscore-separated part to build the React component name", () => {
    expect(toRow(icon).reactComponentName).toBe("ChevronRightFill");
  });

  it("routes metadata by prefix, trims the value, and drops duplicates and blanks", () => {
    const actual = toRow({
      name: "star",
      metadatas: [
        "favorite",
        "favorite",
        "service:  market  ",
        "service:market",
        "tag:outlined",
        "service:",
        "   ",
      ],
    });

    expect(actual).toEqual({
      name: "star",
      reactComponentName: "Star",
      figmaName: "",
      keywords: ["favorite"],
      services: ["market"],
      tags: ["outlined"],
    });
  });

  it("falls back to an empty Figma name when the icon has no figma entry", () => {
    expect(toRow({ name: "star", metadatas: [] }).figmaName).toBe("");
  });
});

describe("buildTable", () => {
  it("renders the header, the separator, and one row per icon with lists joined by commas", () => {
    expect(buildTable([toRow(icon)])).toBe(
      [
        "| Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |",
        "| --- | --- | --- | --- | --- | --- |",
        "| chevron_right_fill | ChevronRightFill | chevron/right/fill | arrow | market | filled |",
      ].join("\n"),
    );
  });

  it("escapes pipes so an icon name cannot break the table", () => {
    const row: IconRow = {
      name: "a|b",
      reactComponentName: "AB",
      figmaName: "",
      keywords: [],
      services: [],
      tags: [],
    };

    expect(buildTable([row]).split("\n").at(-1)).toBe("| a\\|b | AB |  |  |  |  |");
  });
});

describe("buildSection", () => {
  it("titles the table with a level-two heading", () => {
    expect(buildSection("Monochrome Icons", [toRow(icon)])).toBe(
      `## Monochrome Icons\n\n${buildTable([toRow(icon)])}`,
    );
  });

  // 섹션이 비면 transform이 원본 노드를 그대로 돌려주는 분기로 이어진다.
  it("returns null when there is no icon to show", () => {
    expect(buildSection("Monochrome Icons", [])).toBeNull();
  });
});

// 실제 아이콘 데이터에 묶이는 유일한 단언이라, 표 내용이 아니라 섹션 구성만 완전 일치로 본다.
// 표 렌더링 자체는 위의 buildTable 테스트가 합성 입력으로 덮는다.
describe("iconLibraryRule", () => {
  it("emits the monochrome and multicolor sections in order", () => {
    const actual = normalizeLLMBodyWithRules("<IconLibrary />\n", [iconLibraryRule]);

    expect(actual.match(/^## .+$/gm)).toEqual(["## Monochrome Icons", "## Multicolor Icons"]);
  });
});
