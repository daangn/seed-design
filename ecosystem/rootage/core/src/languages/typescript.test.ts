import { describe, expect, it, test } from "bun:test";
import YAML from "yaml";
import { Authoring } from "../parser";
import { createStringifier, getExchangeDts, getExchangeMjs } from "./typescript";

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
      root:
        properties:
          color:
            type: color
    variants:
      variant:
        values:
          primary: {}
  rules:
    - slots:
        root:
          color: "#ffffff"
    - variants:
        variant: primary
      slots:
        root:
          color: "#000000"
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export const vars = {
      "base": {
        "rest": {
          "root": {
            "color": "#ffffff"
          }
        }
      },
      "variantPrimary": {
        "rest": {
          "root": {
            "color": "#000000"
          }
        }
      }
    }"
  `);
});

test("getComponentSpecMjs should key a stateless rule as rest and join compound state names", () => {
  const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
    states:
      - id: selected
      - id: pressed
  rules:
    - slots:
        root:
          color: "#ffffff"
    - states:
        - selected
        - pressed
      slots:
        root:
          color: "#000000"
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export const vars = {
      "base": {
        "rest": {
          "root": {
            "color": "#ffffff"
          }
        },
        "selectedPressed": {
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
      root:
        properties:
          color:
            type: color
    variants:
      variant:
        values:
          primary: {}
  rules:
    - slots:
        root:
          color: "#ffffff"
    - variants:
        variant: primary
      slots:
        root:
          color: "#000000"
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecDts(model.data);

  expect(result).toMatchInlineSnapshot(`
    "export declare const vars: {
      "base": {
        "rest": {
          "root": {
            "color": "#ffffff"
          }
        }
      },
      "variantPrimary": {
        "rest": {
          "root": {
            "color": "#000000"
          }
        }
      }
    }"
  `);
});

test("getComponentSpecDts should generate JSDoc for descriptions", () => {
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
  rules:
    - variants:
        variant: primary
      slots:
        root:
          color: "#ffffff"
    - variants:
        variant: secondary
      slots:
        root:
          color: "#000000"
    - variants:
        size: small
      slots:
        root:
          padding: 8px
    - variants:
        variant: primary
        size: small
      slots:
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
        "rest": {
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
        "rest": {
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
        "rest": {
          /** Root slot description */
          "root": {
            "padding": "8px"
          }
        }
      },
      /**
       * - \`variant=primary\`: Primary variant description
       * - \`size=small\`: Small size description
       */
      "variantPrimarySizeSmall": {
        "rest": {
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

test("getComponentSpecMjs should omit enum properties and anything left empty by them", () => {
  const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
          scaleScope:
            type: enum
            values: [self, content]
    states:
      - id: pressed
  rules:
    - slots:
        root:
          color: "#ffffff"
    - states:
        - pressed
      slots:
        root:
          scaleScope: content
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  // The `pressed` rule disappears entirely: its only property is an enum, which
  // leaves the slot empty, which leaves the rule with nothing to publish.
  expect(result).toMatchInlineSnapshot(`
    "export const vars = {
      "base": {
        "rest": {
          "root": {
            "color": "#ffffff"
          }
        }
      }
    }"
  `);
});

describe("getExchangeDts", () => {
  it("should keep token references, enum values and unlike array entries narrow", () => {
    const result = getExchangeDts({
      schema: {
        slots: {
          label: {
            properties: { textAlign: { type: "enum", values: ["leading", "center"] } },
          },
        },
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: { root: { color: { type: "color", value: "$color.bg.neutral" } } },
        },
        {
          variants: { labelAlign: "center" },
          states: ["pressed"],
          slots: { label: { textAlign: { type: "enum", value: "center" } } },
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      "declare const artifact: {
        "schema": {
          "slots": {
            "label": {
              "properties": {
                "textAlign": {
                  "type": "enum";
                  "values": readonly [
                    "leading",
                    "center",
                  ];
                };
              };
            };
          };
        };
        "rules": readonly [
          {
            "variants": {};
            "states": readonly [];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral";
                };
              };
            };
          },
          {
            "variants": {
              "labelAlign": "center";
            };
            "states": readonly [
              "pressed",
            ];
            "slots": {
              "label": {
                "textAlign": {
                  "type": "enum";
                  "value": "center";
                };
              };
            };
          },
        ];
      };
      export default artifact;
      "
    `);
  });

  it("should drop undefined-valued keys, as JSON.stringify does", () => {
    expect(getExchangeDts({ type: "color", description: undefined })).toBe(
      'declare const artifact: {\n  "type": "color";\n};\nexport default artifact;\n',
    );
  });

  it("should write non-finite numbers as null, as JSON.stringify does", () => {
    expect(getExchangeDts({ value: Number.POSITIVE_INFINITY })).toBe(
      'declare const artifact: {\n  "value": null;\n};\nexport default artifact;\n',
    );
  });

  it("should render empty containers", () => {
    expect(getExchangeDts({ variants: {}, states: [] })).toBe(
      'declare const artifact: {\n  "variants": {};\n  "states": readonly [];\n};\nexport default artifact;\n',
    );
  });
});

describe("getExchangeMjs", () => {
  it("should re-export the sibling JSON", () => {
    expect(getExchangeMjs("menu-sheet-item.json")).toBe(
      'import artifact from "./menu-sheet-item.json" with { type: "json" };\nexport default artifact;\n',
    );
  });
});
