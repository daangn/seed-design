import { expect, test } from "bun:test";
import {
  Authoring,
  Exchange,
  buildContext,
  css,
  exchange,
  getSourceFiles,
  getTokenCollectionDeclarations,
  getTokenDeclarations,
  jsonschema,
  resolveToken,
  tailwind3,
  tailwind4,
  typescript,
  validate,
} from "../..";

const primitive = { type: "haptic", value: { sharpness: 0, intensity: 1 } } as const;
const preset = { type: "haptic", value: { system: "success" } } as const;
const document: Authoring.TokensModel = {
  kind: "Tokens",
  metadata: { id: "haptic", name: "Haptic" },
  data: {
    collection: "global",
    tokens: {
      "$haptic.primitive": { values: { day: primitive, night: primitive } },
      "$haptic.preset": { values: { day: preset, night: preset } },
      "$haptic.alias": { values: { day: "$haptic.primitive", night: "$haptic.preset" } },
      "$haptic.mixed": { values: { day: "$haptic.primitive", night: preset } },
    },
  },
};

const ctx = buildContext([
  {
    fileName: "collections.yaml",
    ast: Authoring.fromObject({
      kind: "TokenCollections",
      metadata: { id: "collections", name: "Collections" },
      data: [{ name: "global", modes: [{ id: "day" }, { id: "night" }] }],
    }),
  },
  { fileName: "haptic.yaml", ast: Authoring.parseTokensDocument(document) },
]);

test("haptic values round-trip through exchange and preserve aliases per mode", () => {
  expect(validate(ctx).valid).toBe(true);
  const ast = getSourceFiles(ctx).find((file) => file.ast.kind === "TokensDocument")?.ast;
  if (ast?.kind !== "TokensDocument") throw new Error("Missing token document");
  const model = exchange.getTokensModel(ast);
  expect(model.data.tokens["$haptic.primitive"]!.values.day).toEqual(primitive);
  expect(model.data.tokens["$haptic.preset"]!.values.day).toEqual(preset);
  expect(model.data.tokens["$haptic.mixed"]!.values).toEqual({
    day: { type: "haptic", value: "$haptic.primitive" },
    night: preset,
  });
  expect(exchange.getTokensModel(Exchange.parseTokensDocument(model))).toEqual(model);
  expect(resolveToken(ctx, "$haptic.alias", { global: "night" }).value).toEqual({
    kind: "HapticLit",
    value: preset.value,
  });
});

test.each([
  null,
  {},
  { sharpness: 0.5 },
  { intensity: 0.5 },
  { sharpness: -0.1, intensity: 1 },
  { sharpness: 0, intensity: 1.1 },
  { sharpness: Number.NaN, intensity: 0 },
  { sharpness: "0.5", intensity: 1 },
  { system: "unknown" },
  { system: "select", sharpness: 0, intensity: 1 },
])("rejects invalid haptic payload %j in authoring and exchange", (value) => {
  const input = {
    ...document,
    data: {
      collection: "global",
      tokens: {
        "$haptic.invalid": {
          values: { default: { type: "haptic", value } },
        },
      },
    },
  };
  const json = JSON.stringify(input);
  expect(() => Authoring.fromString(json)).toThrow();
  expect(() => Exchange.fromString(json)).toThrow();
});

test("rejects modes mixing haptic and numeric values before generating an artifact", () => {
  const model = (night: unknown) =>
    JSON.stringify({
      ...document,
      data: {
        collection: "global",
        tokens: { "$haptic.invalid": { values: { day: primitive, night } } },
      },
    });
  expect(() => Authoring.fromString(model(10))).toThrow("different value types across modes");
  expect(() => Exchange.fromString(model({ type: "number", value: 10 }))).toThrow(
    "different value types across modes",
  );
});

test("haptic declarations and aliases stay out of style outputs", () => {
  const tokens = getTokenDeclarations(ctx);
  const tokenCollections = getTokenCollectionDeclarations(ctx);
  const selectors = { global: { day: ":root", night: ".dark" } };
  expect(css.getTokenCss({ tokens, tokenCollections }, { selectors })).toBe("");
  expect(typescript.createStringifier().getTokenMjs(tokens)).toEqual([]);
  expect(typescript.createStringifier().getTokenDts(tokens)).toEqual([]);
  expect(tailwind3.getTailwind3PluginCode(tokens, [])).toBe(
    tailwind3.getTailwind3PluginCode([], []),
  );
  expect(tailwind4.getTailwind4CompleteThemeCode(tokens, [])).toBe(
    tailwind4.getTailwind4CompleteThemeCode([], []),
  );
  expect(JSON.parse(jsonschema.getJsonSchema(tokens)).definitions.tokenRef.anyOf).toEqual([false]);
});
