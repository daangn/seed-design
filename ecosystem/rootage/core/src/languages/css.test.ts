import { expect, test } from "bun:test";
import { factory, Authoring } from "../parser";
import { createStringifier, getTokenCss } from "./css";

const { value, tokenReference } = createStringifier({
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
          modes: ["light", "dark"],
        },
        {
          name: "global",
          modes: ["default"],
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
