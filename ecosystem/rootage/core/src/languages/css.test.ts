import { expect, test } from "bun:test";
import { factory, Authoring } from "../parser";
import { createStringifier, getTokenCss } from "./css";

const { value, tokenReference, valueOrToken } = createStringifier({
  prefix: "test",
});

test("stringifier.tokenReference should stringify token expression", () => {
  const token = factory.createTokenLit("$color.bg.layer-1");

  const result = tokenReference(token);

  expect(result).toEqual("var(--test-color-bg-layer-1)");
});

test("stringifier.value should stringify shadow expression", () => {
  const shadow = factory.createShadowLit([
    factory.createShadowLayerLit(
      factory.createColorHexLit("#000000"),
      factory.createDimensionLit(2, "px"),
      factory.createDimensionLit(3, "px"),
      factory.createDimensionLit(4, "px"),
      factory.createDimensionLit(0, "px"),
    ),
  ]);

  const result = value(shadow);

  expect(result).toEqual("2px 3px 4px 0px #000000");
});

test("stringifier.value should stringify gradient expression", () => {
  const gradient = factory.createGradientLit([
    factory.createGradientStopLit(factory.createColorHexLit("#000000"), factory.createNumberLit(0)),
    factory.createGradientStopLit(factory.createColorHexLit("#ffffff"), factory.createNumberLit(1)),
  ]);

  const result = value(gradient);

  expect(result).toEqual("#000000 0%, #ffffff 100%");
});

test("stringifier.value should stringify enum expression", () => {
  const result = value(factory.createEnumLit("content"));

  expect(result).toEqual("content");
});

test("stringifier.value should stringify an enum parsed from a component spec", () => {
  const spec: Authoring.ComponentSpecModel = {
    kind: "ComponentSpec",
    metadata: { id: "test", name: "test" },
    data: {
      schema: {
        slots: {
          root: {
            properties: {
              scaleScope: { type: "enum", values: ["self", "content"] },
            },
          },
        },
      },
      rules: [{ slots: { root: { scaleScope: "content" } } }],
    },
  };

  const propertyDecl = Authoring.parseComponentSpecDocument(spec).data.rules[0]?.body[0]?.body[0];
  if (propertyDecl?.kind !== "EnumPropertyDeclaration") {
    throw new Error("expected the spec to parse into an enum property");
  }

  expect(value(propertyDecl.value)).toEqual("content");
});

test("stringifier.valueOrToken should reject an enum", () => {
  expect(() => valueOrToken(factory.createEnumLit("content"))).toThrow(
    "Enum values cannot be emitted as CSS",
  );
});

test("getTokenCss should generate css code", () => {
  const collections: Authoring.TokenCollectionsModel[] = [
    {
      kind: "TokenCollections",
      metadata: {
        id: "1",
        name: "collection",
      },
      data: [
        {
          name: "color",
          modes: [{ id: "light" }, { id: "dark" }],
        },
        {
          name: "global",
          modes: [{ id: "default" }],
        },
      ],
    },
  ];
  const tokens: Authoring.TokensModel[] = [
    {
      kind: "Tokens",
      metadata: {
        id: "2",
        name: "color",
      },
      data: {
        collection: "color",
        tokens: {
          "$color.palette.gray-00": {
            values: {
              light: "#ffffff",
              dark: "#000000",
            },
          },
          "$color.bg.layer-1": {
            values: {
              light: "$color.palette.gray-00",
              dark: "$color.palette.gray-00",
            },
          },
        },
      },
    },
    {
      kind: "Tokens",
      metadata: {
        id: "3",
        name: "unit",
      },
      data: {
        collection: "global",
        tokens: {
          "$dimension.s1": {
            values: {
              default: "4px",
            },
          },
        },
      },
    },
  ];

  const result = getTokenCss(
    {
      tokenCollections: collections.flatMap((x) => Authoring.parseTokenCollectionsDocument(x).data),
      tokens: tokens.flatMap((x) => Authoring.parseTokensDocument(x).data),
    },
    {
      prefix: "test",
      banner: "",
      selectors: {
        global: {
          default: ":root",
        },
        color: {
          light: `:root[data-theme="light"]`,
          dark: `:root[data-theme="dark"]`,
        },
      },
    },
  );

  expect(result).toMatchInlineSnapshot(`
    ":root[data-theme="light"] {
      --test-color-palette-gray-00: #ffffff;
      --test-color-bg-layer-1: var(--test-color-palette-gray-00);
    }

    :root[data-theme="dark"] {
      --test-color-palette-gray-00: #000000;
      --test-color-bg-layer-1: var(--test-color-palette-gray-00);
    }

    :root {
      --test-dimension-s1: 4px;
    }"
  `);
});

test("getTokenCss skips a mode whose selector is null", () => {
  const collections: Authoring.TokenCollectionsModel[] = [
    {
      kind: "TokenCollections",
      metadata: { id: "1", name: "collection" },
      data: [{ name: "motion", modes: [{ id: "preferred" }, { id: "reduced" }] }],
    },
  ];
  const tokens: Authoring.TokensModel[] = [
    {
      kind: "Tokens",
      metadata: { id: "2", name: "scale" },
      data: {
        collection: "motion",
        tokens: {
          "$scale.s95": { values: { preferred: 0.95, reduced: 1 } },
        },
      },
    },
  ];

  const result = getTokenCss(
    {
      tokenCollections: collections.flatMap((x) => Authoring.parseTokenCollectionsDocument(x).data),
      tokens: tokens.flatMap((x) => Authoring.parseTokensDocument(x).data),
    },
    {
      prefix: "test",
      banner: "",
      selectors: {
        motion: {
          preferred: ":root",
          reduced: null,
        },
      },
    },
  );

  expect(result).toMatchInlineSnapshot(`
    ":root {
      --test-scale-s95: 0.95;
    }"
  `);
});

test("getTokenCss throws when a mode has no selector entry", () => {
  const collections: Authoring.TokenCollectionsModel[] = [
    {
      kind: "TokenCollections",
      metadata: { id: "1", name: "collection" },
      data: [{ name: "motion", modes: [{ id: "preferred" }, { id: "reduced" }] }],
    },
  ];
  const tokens: Authoring.TokensModel[] = [
    {
      kind: "Tokens",
      metadata: { id: "2", name: "scale" },
      data: {
        collection: "motion",
        tokens: {
          "$scale.s95": { values: { preferred: 0.95, reduced: 1 } },
        },
      },
    },
  ];

  expect(() =>
    getTokenCss(
      {
        tokenCollections: collections.flatMap(
          (x) => Authoring.parseTokenCollectionsDocument(x).data,
        ),
        tokens: tokens.flatMap((x) => Authoring.parseTokensDocument(x).data),
      },
      {
        prefix: "test",
        banner: "",
        selectors: {
          motion: {
            preferred: ":root",
          },
        },
      },
    ),
  ).toThrow("Selector for collection motion and mode reduced is not defined");
});
