import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import {
  type ArtifactTokensModel,
  type ArtifactValue,
  formatTokenValue,
  generateMarkdownTable,
  tokenReferenceRule,
} from "./token-reference-rule";

// 실제 rootage artifact 대신 쓰는 합성 토큰. 토큰을 재생성해도 이 기대값은 흔들리지 않는다.
const tokens: ArtifactTokensModel["data"]["tokens"] = {
  "$color.palette.gray-00": {
    values: {
      "theme-light": { type: "color", value: "#ffffff" },
      "theme-dark": { type: "color", value: "#000000" },
    },
  },
  "$color.bg.neutral": {
    values: {
      "theme-light": { type: "color", value: "$color.palette.gray-00" },
      "theme-dark": { type: "color", value: "$color.palette.gray-00" },
    },
  },
  "$radius.r1": {
    values: {
      "theme-light": { type: "dimension", value: { value: 4, unit: "px" } },
      "theme-dark": { type: "dimension", value: { value: 4, unit: "px" } },
    },
  },
};

describe("generateMarkdownTable", () => {
  it("keeps only the tokens under the group prefix and names a column per theme", () => {
    expect(generateMarkdownTable(tokens, ["radius"])).toBe(
      [
        "| Token | theme-light | theme-dark |",
        "| --- | --- | --- |",
        "| $radius.r1 | 4px | 4px |",
      ].join("\n"),
    );
  });

  // 조인이 깨져 `$color.` 로 좁혀지면 `$color.bg.*` 까지 딸려 나온다.
  it("joins a multi-part group with dots so a sibling group cannot leak in", () => {
    expect(generateMarkdownTable(tokens, ["color", "palette"])).toBe(
      [
        "| Token | theme-light | theme-dark |",
        "| --- | --- | --- |",
        "| $color.palette.gray-00 | #ffffff | #000000 |",
      ].join("\n"),
    );
  });

  it("returns an empty string when no token matches the prefix", () => {
    expect(generateMarkdownTable(tokens, ["nonexistent"])).toBe("");
  });
});

describe("formatTokenValue", () => {
  const cases: [label: string, value: ArtifactValue, expected: string][] = [
    ["a number", { type: "number", value: 2 }, "2"],
    [
      "a rem dimension with its px equivalent",
      { type: "dimension", value: { value: 1.5, unit: "rem" } },
      "1.5rem (24px)",
    ],
    ["a px dimension", { type: "dimension", value: { value: 4, unit: "px" } }, "4px"],
    ["a duration in ms", { type: "duration", value: { value: 200, unit: "ms" } }, "200ms"],
    ["a duration in s", { type: "duration", value: { value: 1, unit: "s" } }, "1s"],
    [
      "a cubic-bezier",
      { type: "cubicBezier", value: [0, 0, 0.15, 1] },
      "cubic-bezier(0, 0, 0.15, 1)",
    ],
    [
      "a shadow as JSON",
      {
        type: "shadow",
        value: [
          {
            color: "#00000021",
            offsetX: { value: 0, unit: "px" },
            offsetY: { value: 2, unit: "px" },
            blur: { value: 8, unit: "px" },
            spread: { value: 0, unit: "px" },
          },
        ],
      },
      '[{"color":"#00000021","offsetX":{"value":0,"unit":"px"},"offsetY":{"value":2,"unit":"px"},"blur":{"value":8,"unit":"px"},"spread":{"value":0,"unit":"px"}}]',
    ],
    [
      "a gradient as JSON",
      {
        type: "gradient",
        value: [
          { color: "#ffffff", position: 0 },
          { color: "#000000", position: 1 },
        ],
      },
      '[{"color":"#ffffff","position":0},{"color":"#000000","position":1}]',
    ],
    ["a color literal", { type: "color", value: "#ffffff" }, "#ffffff"],
    [
      "a token reference",
      { type: "color", value: "$color.palette.gray-00" },
      "$color.palette.gray-00",
    ],
    ["an enum", { type: "enum", value: "bold" }, "bold"],
  ];

  for (const [label, value, expected] of cases) {
    it(`formats ${label}`, () => {
      expect(formatTokenValue(value)).toBe(expected);
    });
  }
});

// 아래는 transform 고유의 책임인 속성 파싱과 노드 라우팅만 검증한다.
// 표 생성 자체는 위의 generateMarkdownTable 테스트가 합성 입력으로 덮는다.
describe("tokenReferenceRule", () => {
  it("reads a groups expression attribute", () => {
    const input = `<TokenReference groups={["radius"]} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`
      "| Token | default |
      | --- | --- |
      | $radius.r0_5 | 2px |
      | $radius.r1 | 4px |
      | $radius.r1_5 | 6px |
      | $radius.r2 | 8px |
      | $radius.r2_5 | 10px |
      | $radius.r3 | 12px |
      | $radius.r3_5 | 14px |
      | $radius.r4 | 16px |
      | $radius.r5 | 20px |
      | $radius.r6 | 24px |
      | $radius.full | 9999px |"
    `);
  });

  it("reads an HTML-escaped groups attribute", () => {
    const input = `<TokenReference groups="[&#x22;radius&#x22;]" />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`
      "| Token | default |
      | --- | --- |
      | $radius.r0_5 | 2px |
      | $radius.r1 | 4px |
      | $radius.r1_5 | 6px |
      | $radius.r2 | 8px |
      | $radius.r2_5 | 10px |
      | $radius.r3 | 12px |
      | $radius.r3_5 | 14px |
      | $radius.r4 | 16px |
      | $radius.r5 | 20px |
      | $radius.r6 | 24px |
      | $radius.full | 9999px |"
    `);
  });

  it("reads a regex expression attribute", () => {
    const input = String.raw`<TokenReference regex={/\$radius\.r[12]$/} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`
      "| Token | default |
      | --- | --- |
      | $radius.r1 | 4px |
      | $radius.r2 | 8px |"
    `);
  });

  it("reads an HTML-escaped regex attribute", () => {
    const input = String.raw`<TokenReference regex="/\$radius\.r[12]$/" />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`
      "| Token | default |
      | --- | --- |
      | $radius.r1 | 4px |
      | $radius.r2 | 8px |"
    `);
  });

  it("keeps the original node when the group is unknown", () => {
    const input = `<TokenReference groups={["nonexistent"]} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`"<TokenReference groups={["nonexistent"]} />"`);
  });

  it("keeps the original node when the regex matches nothing", () => {
    const input = String.raw`<TokenReference regex={/\$nonexistent\..*/} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toMatchInlineSnapshot(`"<TokenReference regex={/\\$nonexistent\\..*/} />"`);
  });

  // 실제 artifact 목록에 묶이는 유일한 단언이라, 표 내용이 아니라 섹션 헤딩만 완전 일치로 본다.
  it("emits one titled section per token artifact when no group is given", () => {
    const input = "<TokenReference />";

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual.match(/^## .+$/gm)).toMatchInlineSnapshot(`
      [
        "## Color",
        "## Dimension",
        "## Duration",
        "## Font Size",
        "## Font Weight",
        "## Gradient",
        "## Line Height",
        "## Radius",
        "## Scale",
        "## Shadow",
        "## Timing Function",
      ]
    `);
  });
});
