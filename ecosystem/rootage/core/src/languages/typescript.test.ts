import { describe, expect, it, test } from "bun:test";
import YAML from "yaml";
import { Authoring } from "../parser";
import { createStringifier } from "./typescript";

const { getComponentSpecDts, getComponentSpecMjs, getTokenDts, getTokenMjs } = createStringifier({
  prefix: "test",
});

describe("getTokenMjs", () => {
  it("should generate esm definitions", () => {
    const models: Authoring.TokensModel[] = [
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
            "$color.palette.gray-100": {
              values: {
                light: "#f8f9fa",
                dark: "#212529",
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
          name: "dimension",
        },
        data: {
          collection: "global",
          tokens: {
            "$dimension.s1_5": {
              values: {
                default: "6px",
              },
            },
          },
        },
      },
    ];

    const result = getTokenMjs(models.flatMap((x) => Authoring.parseTokensDocument(x).data));

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": 
      "export * as palette from "./palette.mjs";
      export * as bg from "./bg.mjs";"
      ,
          "path": "color/index.mjs",
        },
        {
          "code": 
      "export const gray00 = "var(--test-color-palette-gray-00)";
      export const gray100 = "var(--test-color-palette-gray-100)";"
      ,
          "path": "color/palette.mjs",
        },
        {
          "code": "export const layer1 = "var(--test-color-bg-layer-1)";",
          "path": "color/bg.mjs",
        },
        {
          "code": "export const s1_5 = "var(--test-dimension-s1_5)";",
          "path": "dimension.mjs",
        },
      ]
    `);
  });

  it("should generate esm definitions with nesting", () => {
    const models: Authoring.TokensModel[] = [
      {
        kind: "Tokens",
        metadata: {
          id: "1",
          name: "dimension",
        },
        data: {
          collection: "global",
          tokens: {
            "$dimension.s1_5": {
              values: {
                default: "6px",
              },
            },
            "$dimension.spacing-x.default": {
              values: {
                default: "$dimension.s1_5",
              },
            },
            "$dimension.spacing-x.test.value": {
              values: {
                default: "$dimension.s1_5",
              },
            },
          },
        },
      },
    ];

    const result = getTokenMjs(models.flatMap((x) => Authoring.parseTokensDocument(x).data));

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": 
      "export const s1_5 = "var(--test-dimension-s1_5)";

      export * as spacingX from "./spacing-x/index.mjs";"
      ,
          "path": "dimension/index.mjs",
        },
        {
          "code": 
      "export const default = "var(--test-dimension-spacing-x-default)";

      export * as test from "./test.mjs";"
      ,
          "path": "dimension/spacing-x/index.mjs",
        },
        {
          "code": "export const value = "var(--test-dimension-spacing-x-test-value)";",
          "path": "dimension/spacing-x/test.mjs",
        },
      ]
    `);
  });
});

describe("getTokenDts", () => {
  it("should generate typescript definitions", () => {
    const models: Authoring.TokensModel[] = [
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
            "$color.palette.gray-100": {
              values: {
                light: "#f8f9fa",
                dark: "#212529",
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
          name: "dimension",
        },
        data: {
          collection: "global",
          tokens: {
            "$dimension.s1_5": {
              values: {
                default: "6px",
              },
            },
          },
        },
      },
    ];

    const result = getTokenDts(models.flatMap((x) => Authoring.parseTokensDocument(x).data));

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": 
      "export * as palette from "./palette";
      export * as bg from "./bg";"
      ,
          "path": "color/index.d.ts",
        },
        {
          "code": 
      "export declare const gray00 = "var(--test-color-palette-gray-00)";
      export declare const gray100 = "var(--test-color-palette-gray-100)";"
      ,
          "path": "color/palette.d.ts",
        },
        {
          "code": "export declare const layer1 = "var(--test-color-bg-layer-1)";",
          "path": "color/bg.d.ts",
        },
        {
          "code": "export declare const s1_5 = "var(--test-dimension-s1_5)";",
          "path": "dimension.d.ts",
        },
      ]
    `);
  });

  it("should generate typescript definitions with nesting", () => {
    const models: Authoring.TokensModel[] = [
      {
        kind: "Tokens",
        metadata: {
          id: "1",
          name: "dimension",
        },
        data: {
          collection: "global",
          tokens: {
            "$dimension.s1_5": {
              values: {
                default: "6px",
              },
            },
            "$dimension.spacing-x.default": {
              values: {
                default: "$dimension.s1_5",
              },
            },
          },
        },
      },
    ];

    const result = getTokenDts(models.flatMap((x) => Authoring.parseTokensDocument(x).data));

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": 
      "export declare const s1_5 = "var(--test-dimension-s1_5)";

      export * as spacingX from "./spacing-x";"
      ,
          "path": "dimension/index.d.ts",
        },
        {
          "code": "export declare const default = "var(--test-dimension-spacing-x-default)";",
          "path": "dimension/spacing-x.d.ts",
        },
      ]
    `);
  });
});

test("getComponentSpecMjs should generate esm definitions", () => {
  const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      - name: root
        properties:
          - name: color
            type: color
  definitions:
    base:
      enabled:
        root:
          color: "#ffffff"
    variant=primary:
      enabled:
        root:
          color: "#000000"
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export const vars = {
      "base": {
        "enabled": {
          "root": {
            "color": "#ffffff"
          }
        }
      },
      "variantPrimary": {
        "enabled": {
          "root": {
            "color": "#000000"
          }
        }
      }
    }"
  `);
});

test("getComponentSpecDts should generate typescript definitions", () => {
  const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      - name: root
        properties:
          - name: color
            type: color
  definitions:
    base:
      enabled:
        root:
          color: "#ffffff"
    variant=primary:
      enabled:
        root:
          color: "#000000"
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecDts(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export declare const vars: {
      "base": {
        "enabled": {
          "root": {
            "color": "#ffffff"
          }
        }
      },
      "variantPrimary": {
        "enabled": {
          "root": {
            "color": "#000000"
          }
        }
      }
    }"
  `);
});

test("getComponentSpecDts should generate JSDoc for descriptions", () => {
  // NOTE: values and defaultValue are NOT required in schema.variants
  // because they can be inferred from definitions via deep merging.
  // Only descriptions need to be explicitly provided.
  const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    variants:
      variant:
        values:
          primary:
            description: Primary variant description
          secondary:
            description: Secondary variant description
      size:
        values:
          small:
            description: Small size description
    slots:
      root:
        description: Root slot description
        properties:
          color:
            type: color
            description: Color property description
          padding:
            type: dimension
  definitions:
    variant=primary:
      enabled:
        root:
          color: "#ffffff"
    variant=secondary:
      enabled:
        root:
          color: "#000000"
    size=small:
      enabled:
        root:
          padding: 8px
    size=small, variant=primary:
      enabled:
        root:
          color: "#ffffff"
          padding: 4px
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecDts(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export declare const vars: {
      /**
       * Primary variant description
       */
      "variantPrimary": {
        "enabled": {
          /** Root slot description */
          "root": {
            /** Color property description */
            "color": "#ffffff"
          }
        }
      },
      /**
       * Secondary variant description
       */
      "variantSecondary": {
        "enabled": {
          /** Root slot description */
          "root": {
            /** Color property description */
            "color": "#000000"
          }
        }
      },
      /**
       * Small size description
       */
      "sizeSmall": {
        "enabled": {
          /** Root slot description */
          "root": {
            "padding": "8px"
          }
        }
      },
      /**
       * - \`size=small\`: Small size description
       * - \`variant=primary\`: Primary variant description
       */
      "sizeSmallVariantPrimary": {
        "enabled": {
          /** Root slot description */
          "root": {
            /** Color property description */
            "color": "#ffffff",
            "padding": "4px"
          }
        }
      }
    }"
  `);
});

test("getTokenDts should generate JSDoc for token descriptions", () => {
  const models: Authoring.TokensModel[] = [
    {
      kind: "Tokens",
      metadata: {
        id: "1",
        name: "color",
      },
      data: {
        collection: "color",
        tokens: {
          "$color.bg.brand": {
            description: "Brand background color",
            values: {
              light: "#ff6600",
              dark: "#ff9900",
            },
          },
          "$color.bg.neutral": {
            values: {
              light: "#f0f0f0",
              dark: "#1a1a1a",
            },
          },
        },
      },
    },
  ];

  const result = getTokenDts(models.flatMap((x) => Authoring.parseTokensDocument(x).data));

  expect(result).toMatchInlineSnapshot(`
    [
      {
        "code": "export * as bg from "./bg";",
        "path": "color/index.d.ts",
      },
      {
        "code": 
    "/** Brand background color */
    export declare const brand = "var(--test-color-bg-brand)";
    export declare const neutral = "var(--test-color-bg-neutral)";"
    ,
        "path": "color/bg.d.ts",
      },
    ]
  `);
});
