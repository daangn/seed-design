import { describe, expect, it } from "bun:test";
import { renderWithHandler } from "../render-test-utils";
import {
  type ArtifactTokensModel,
  type ArtifactValue,
  createTokenReferenceHandler,
  formatTokenValue,
} from "./token-reference";

// 실제 rootage artifact 대신 쓰는 합성 토큰. 아티팩트 이름부터 모드 이름까지 rootage에 없는
// 형태라, 표에 찍힌 값이 실데이터에서 왔는지 읽는 사람이 되짚을 일이 없다.
const alphaTokens: ArtifactTokensModel["data"]["tokens"] = {
  "$fixture-alpha.solid.one": {
    values: {
      "mode-one": { type: "color", value: "#0a0b0c" },
      "mode-two": { type: "color", value: "#0d0e0f" },
    },
  },
  "$fixture-alpha.solid.two": {
    values: {
      "mode-one": { type: "color", value: "$fixture-alpha.solid.one" },
      "mode-two": { type: "color", value: "$fixture-alpha.solid.one" },
    },
  },
  "$fixture-alpha.hollow.one": {
    values: {
      "mode-one": { type: "dimension", value: { value: 7, unit: "px" } },
      "mode-two": { type: "dimension", value: { value: 0.5, unit: "rem" } },
    },
  },
};

const betaTokens: ArtifactTokensModel["data"]["tokens"] = {
  "$fixture-beta.solid.one": {
    values: {
      "mode-one": { type: "number", value: 3 },
      "mode-two": { type: "number", value: 5 },
    },
  },
  "$fixture-beta.plain.one": {
    values: {
      "mode-one": { type: "duration", value: { value: 250, unit: "ms" } },
      "mode-two": { type: "duration", value: { value: 1, unit: "s" } },
    },
  },
};

const fixtureAlpha: ArtifactTokensModel = {
  kind: "Tokens",
  metadata: { id: "fixture-alpha", name: "Fixture Alpha" },
  data: { collection: "fixture-alpha", tokens: alphaTokens },
};

const fixtureBeta: ArtifactTokensModel = {
  kind: "Tokens",
  metadata: { id: "fixture-beta", name: "Fixture Beta" },
  data: { collection: "fixture-beta", tokens: betaTokens },
};

// 합성 아티팩트로 만든 핸들러라 출력 전체를 그대로 단언할 수 있다.
const render = (mdx: string) =>
  renderWithHandler(createTokenReferenceHandler([fixtureAlpha, fixtureBeta]), mdx);

const alphaTable = [
  "| Token | mode-one | mode-two |",
  "| --- | --- | --- |",
  "| $fixture-alpha.solid.one | #0a0b0c | #0d0e0f |",
  "| $fixture-alpha.solid.two | $fixture-alpha.solid.one | $fixture-alpha.solid.one |",
  "| $fixture-alpha.hollow.one | 7px | 0.5rem (8px) |",
].join("\n");

const solidTable = [
  "| Token | mode-one | mode-two |",
  "| --- | --- | --- |",
  "| $fixture-alpha.solid.one | #0a0b0c | #0d0e0f |",
  "| $fixture-alpha.solid.two | $fixture-alpha.solid.one | $fixture-alpha.solid.one |",
  "| $fixture-beta.solid.one | 3 | 5 |",
].join("\n");

describe("token reference handler", () => {
  it("narrows the table to the group named by an expression attribute", async () => {
    expect(await render(`<TokenReference groups={["fixture-alpha"]} />`)).toBe(alphaTable);
  });

  // 조인이 깨져 `$fixture-alpha.` 로 좁혀지면 `$fixture-alpha.hollow.*` 까지 딸려 나온다.
  it("joins a multi-part group with dots so a sibling group cannot leak in", async () => {
    expect(await render(`<TokenReference groups={["fixture-alpha", "solid"]} />`)).toBe(
      [
        "| Token | mode-one | mode-two |",
        "| --- | --- | --- |",
        "| $fixture-alpha.solid.one | #0a0b0c | #0d0e0f |",
        "| $fixture-alpha.solid.two | $fixture-alpha.solid.one | $fixture-alpha.solid.one |",
      ].join("\n"),
    );
  });

  it("reads an HTML-escaped groups attribute", async () => {
    expect(await render(`<TokenReference groups="[&#x22;fixture-alpha&#x22;]" />`)).toBe(
      alphaTable,
    );
  });

  it("keeps exactly the tokens the regex attribute matches across every artifact", async () => {
    expect(await render(String.raw`<TokenReference regex={/\.solid\./} />`)).toBe(solidTable);
  });

  // HTML-escaped 짝이 없는 이유: escapeMdxAttributeValue는 `"`만 `&#x22;`로 바꾸는데, 토큰 id를
  // 겨냥한 정규식에 `"`가 들어갈 일이 없다. groups는 배열 리터럴이라 따옴표가 늘 escape된다.
  it("reads a quoted regex attribute", async () => {
    expect(await render(String.raw`<TokenReference regex="/\.solid\./" />`)).toBe(solidTable);
  });

  it("emits one titled section per token artifact when no group is given", async () => {
    expect(await render("<TokenReference />")).toBe(
      [
        "## Fixture Alpha",
        "",
        alphaTable,
        "",
        "## Fixture Beta",
        "",
        "| Token | mode-one | mode-two |",
        "| --- | --- | --- |",
        "| $fixture-beta.solid.one | 3 | 5 |",
        "| $fixture-beta.plain.one | 250ms | 1s |",
      ].join("\n"),
    );
  });

  // 태그를 남기는 경로는 원문을 그대로 돌려주는 게 아니라 노드를 다시 직렬화한다. 표현식
  // 속성이 문자열 속성으로 바뀌어 나오는 건 그래서다 — 표가 비었을 때 자리가 남는다는 게
  // 요점이라 이 형태로 굳혀 둔다.
  it("keeps the tag when the group is unknown", async () => {
    expect(await render(`<TokenReference groups={["fixture-gamma"]} />`)).toBe(
      `<TokenReference groups="[&#x22;fixture-gamma&#x22;]" />`,
    );
  });

  it("keeps the tag when the regex matches nothing", async () => {
    expect(await render(String.raw`<TokenReference regex={/\.nonexistent\./} />`)).toBe(
      String.raw`<TokenReference regex="/\.nonexistent\./" />`,
    );
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<SomethingElse />")).toBe("<SomethingElse />");
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
            color: "#0a0b0c21",
            offsetX: { value: 0, unit: "px" },
            offsetY: { value: 2, unit: "px" },
            blur: { value: 8, unit: "px" },
            spread: { value: 0, unit: "px" },
          },
        ],
      },
      '[{"color":"#0a0b0c21","offsetX":{"value":0,"unit":"px"},"offsetY":{"value":2,"unit":"px"},"blur":{"value":8,"unit":"px"},"spread":{"value":0,"unit":"px"}}]',
    ],
    [
      "a gradient as JSON",
      {
        type: "gradient",
        value: [
          { color: "#0a0b0c", position: 0 },
          { color: "#0d0e0f", position: 1 },
        ],
      },
      '[{"color":"#0a0b0c","position":0},{"color":"#0d0e0f","position":1}]',
    ],
    ["a color literal", { type: "color", value: "#0a0b0c" }, "#0a0b0c"],
    [
      "a token reference",
      { type: "color", value: "$fixture-alpha.solid.one" },
      "$fixture-alpha.solid.one",
    ],
    ["an enum", { type: "enum", value: "bold" }, "bold"],
  ];

  for (const [label, value, expected] of cases) {
    it(`formats ${label}`, () => {
      expect(formatTokenValue(value)).toBe(expected);
    });
  }
});
