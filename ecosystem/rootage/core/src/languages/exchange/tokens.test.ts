import { describe, expect, it } from "bun:test";

import YAML from "yaml";
import { getTokensModel } from "./index";
import { type AST, Authoring } from "../../parser";
import { buildContext, getSourceFiles } from "../../analyzer";

const parse = (yaml: string) => getTokensModel(Authoring.parseTokensDocument(YAML.parse(yaml)));

describe("getTokensModel", () => {
  it("should transform literal and alias color values", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
  lastUpdated: 26-01-01
data:
  collection: color
  tokens:
    $color.palette.gray-00:
      values:
        light: "#ffffff"
        dark: "#000000"
    $color.bg.layer-1:
      values:
        light: "#f7f8f9"
        dark: $color.palette.gray-00
`);

    expect(transformed).toEqual({
      kind: "Tokens",
      metadata: {
        id: "test",
        name: "Test",
        lastUpdated: "26-01-01",
      },
      data: {
        collection: "color",
        tokens: {
          "$color.palette.gray-00": {
            values: {
              light: { type: "color", value: "#ffffff" },
              dark: { type: "color", value: "#000000" },
            },
          },
          "$color.bg.layer-1": {
            values: {
              light: { type: "color", value: "#f7f8f9" },
              dark: { type: "color", value: "$color.palette.gray-00" },
            },
          },
        },
      },
    });
  });

  it("should pass token descriptions through", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: color
  tokens:
    $color.bg.a:
      description: 배경 색상입니다.
      values:
        light: "#ffffff"
`);

    expect(transformed.data.tokens["$color.bg.a"]!.description).toBe("배경 색상입니다.");
  });

  it("should transform dimension, number, and duration values", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: global
  tokens:
    $dimension.x1:
      values:
        default: 4px
    $scale.s95:
      values:
        default: 0.95
    $duration.t1:
      values:
        default: 300ms
`);

    expect(transformed.data.tokens).toEqual({
      "$dimension.x1": {
        values: { default: { type: "dimension", value: { value: 4, unit: "px" } } },
      },
      "$scale.s95": {
        values: { default: { type: "number", value: 0.95 } },
      },
      "$duration.t1": {
        values: { default: { type: "duration", value: { value: 300, unit: "ms" } } },
      },
    });
  });

  it("should transform cubicBezier values", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: global
  tokens:
    $timing-function.easing:
      values:
        default:
          type: cubicBezier
          value: [0.25, 0.1, 0.25, 1]
`);

    expect(transformed.data.tokens["$timing-function.easing"]!.values).toEqual({
      default: { type: "cubicBezier", value: [0.25, 0.1, 0.25, 1] },
    });
  });

  it("should transform shadow values", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: color
  tokens:
    $shadow.s1:
      values:
        light:
          type: shadow
          value:
            - color: "#000000"
              offsetX: 0px
              offsetY: 1px
              blur: 4px
              spread: 0px
`);

    expect(transformed.data.tokens["$shadow.s1"]!.values).toEqual({
      light: {
        type: "shadow",
        value: [
          {
            color: "#000000",
            offsetX: { value: 0, unit: "px" },
            offsetY: { value: 1, unit: "px" },
            blur: { value: 4, unit: "px" },
            spread: { value: 0, unit: "px" },
          },
        ],
      },
    });
  });

  it("should transform gradient values", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: color
  tokens:
    $gradient.g1:
      values:
        light:
          type: gradient
          value:
            - color: "#ff0000"
              position: 0
            - color: "#00ff00"
              position: 1
`);

    expect(transformed.data.tokens["$gradient.g1"]!.values).toEqual({
      light: {
        type: "gradient",
        value: [
          { color: "#ff0000", position: 0 },
          { color: "#00ff00", position: 1 },
        ],
      },
    });
  });

  it("should throw for unresolved token declarations", () => {
    // 모든 모드 값이 참조인 토큰은 파스 시점에 타입이 정해지지 않으므로,
    // getSourceFiles/getTokenDeclarations로 resolve하지 않고 직접 넘기면 던진다.
    expect(() =>
      parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: color
  tokens:
    $color.bg.a:
      values:
        light: $color.palette.gray-00
`),
    ).toThrow("Cannot convert unresolved token declaration");
  });

  it("should exclude tokens marked excludeFromExchange", () => {
    const transformed = parse(`
kind: Tokens
metadata:
  id: test
  name: Test
data:
  collection: color
  tokens:
    $color.bg.a:
      values:
        light: "#ffffff"
    $color.bg.b:
      description: kept for compatibility
      excludeFromExchange: true
      values:
        light: "#000000"
`);

    expect(Object.keys(transformed.data.tokens)).toEqual(["$color.bg.a"]);
  });

  it("should preserve excludeFromExchange through reference resolution", () => {
    const collectionsYaml = `
kind: TokenCollections
metadata:
  id: collections
  name: collections
data:
  - name: color
    modes:
      - id: light
`;
    const tokensYaml = `
kind: Tokens
metadata:
  id: test
  name: test
data:
  collection: color
  tokens:
    $color.palette.gray-00:
      values:
        light: "#ffffff"
    $color.bg.a:
      values:
        light: $color.palette.gray-00
    $color.bg.b:
      excludeFromExchange: true
      values:
        light: $color.palette.gray-00
`;

    const ctx = buildContext([
      {
        fileName: "collections.yaml",
        ast: Authoring.fromObject(YAML.parse(collectionsYaml)),
      },
      {
        fileName: "tokens.yaml",
        ast: Authoring.fromObject(YAML.parse(tokensYaml)),
      },
    ]);

    const tokensAst = getSourceFiles(ctx)
      .map((file) => file.ast)
      .find((ast): ast is AST.TokensDocument => ast.kind === "TokensDocument");
    if (!tokensAst) throw new Error("tokens document not found");

    const transformed = getTokensModel(tokensAst);

    expect(Object.keys(transformed.data.tokens)).toEqual(["$color.palette.gray-00", "$color.bg.a"]);
  });
});
