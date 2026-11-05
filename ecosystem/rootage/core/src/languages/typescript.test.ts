import { describe, expect, it, test } from "bun:test";
import YAML from "yaml";
import { Authoring, factory } from "../parser";
import { createStringifier, getExchangeDts, getExchangeMjs } from "./typescript";

/** Creates a gradient value matching the per-mode values returned by resolveTokenValues. */
function fakeGradient(...stops: [string, number][]) {
  return factory.createGradientLit(
    stops.map(([color, position]) =>
      factory.createGradientStopLit(
        { kind: "ColorHexLit", value: color as `#${string}` },
        { kind: "NumberLit", value: position },
      ),
    ),
  );
}

/**
 * Creates a minimal spec that references a gradient token.
 * The parser leaves token references as `UnresolvedPropertyDeclaration`, and the analyzer's
 * `transformResolvedType` assigns their final kind through `getComponentSpecDeclarations`.
 * This fixture uses the factory to represent that analyzed state directly.
 */
function tokenRefGradientSpec() {
  return factory.createComponentSpecDeclaration(
    "test",
    "test",
    factory.createSchemaDeclaration(
      [
        factory.createSlotSchemaDeclaration("root", [
          factory.createPropertySchemaDeclaration("gradient", "gradient"),
        ]),
      ],
      [],
    ),
    [
      factory.createVariantDeclaration(
        [],
        [
          factory.createStateDeclaration(
            [],
            [
              factory.createSlotDeclaration("root", [
                factory.createGradientPropertyDeclaration(
                  "gradient",
                  factory.createTokenLit("$gradient.mask-fade"),
                ),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
}

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

test("getComponentSpecMjs exposes inline gradient as structured stops and serialized", () => {
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
          gradient:
            type: gradient
  definitions:
    base:
      enabled:
        root:
          gradient:
            type: gradient
            value:
              - color: "#00000000"
                position: 0
              - color: "#00000014"
                position: 0.29
              - color: "#000000ff"
                position: 1
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  // Structured stops preserve raw position values between 0 and 1.
  expect(result).toContain('"stops"');
  expect(result).toContain('"position": 0.29');
  // A serialized CSS value remains available for static use.
  expect(result).toContain('"serialized"');
});

test("getComponentSpecDts injects property JSDoc on the real property only, not gradient stop keys", () => {
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
            description: COLOR_DESC
          gradient:
            type: gradient
  definitions:
    base:
      enabled:
        root:
          color: "#ffffff"
          gradient:
            type: gradient
            value:
              - color: "#00000000"
                position: 0
              - color: "#000000ff"
                position: 1
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecDts(model.data);

  // The color property description must be injected exactly once on the property declaration.
  // An unanchored replacement would also inject it into the gradient stop's "color" key.
  expect((result.match(/COLOR_DESC/g) || []).length).toBe(1);
});

const TOKEN_REF_GRADIENT_YAML = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          gradient:
            type: gradient
          color:
            type: color
  definitions:
    base:
      enabled:
        root:
          gradient: $gradient.mask-fade
          color: $color.fg.neutral
`;

test("getComponentSpecMjs resolves a mode-invariant gradient token into serialized and stops", () => {
  // A mode-invariant gradient includes stops for dynamic operations.
  const { getComponentSpecMjs: generate } = createStringifier({
    prefix: "test",
    resolveTokenValues: () => [
      fakeGradient(["#00000000", 0], ["#000000ff", 1]),
      fakeGradient(["#00000000", 0], ["#000000ff", 1]),
    ],
  });

  const result = generate(tokenRefGradientSpec());

  expect(result).toContain('"serialized": "var(--test-gradient-mask-fade)"');
  expect(result).toContain('"stops"');
  expect(result).toContain('"position": 1');
});

test("getComponentSpecMjs omits stops for a theme-dependent gradient token", () => {
  // A mode-dependent gradient exposes only its serialized form because one stops array is invalid.
  const { getComponentSpecMjs: generate } = createStringifier({
    prefix: "test",
    resolveTokenValues: () => [
      fakeGradient(["#00000000", 0], ["#000000ff", 1]),
      fakeGradient(["#ffffff00", 0], ["#ffffffff", 1]),
    ],
  });

  const result = generate(tokenRefGradientSpec());

  expect(result).toContain('"serialized": "var(--test-gradient-mask-fade)"');
  expect(result).not.toContain('"stops"');
});

test("getComponentSpecMjs keeps non-gradient token references as plain strings", () => {
  const model = Authoring.parseComponentSpecDocument(YAML.parse(TOKEN_REF_GRADIENT_YAML));

  // Non-gradient properties remain var() strings regardless of the resolver.
  const { getComponentSpecMjs: generate } = createStringifier({
    prefix: "test",
    resolveTokenValues: () => [fakeGradient(["#00000000", 0], ["#000000ff", 1])],
  });

  const result = generate(model.data);

  expect(result).toContain('"color": "var(--test-color-fg-neutral)"');
});

test("getComponentSpecMjs keeps the gradient shape stable without a resolver", () => {
  // Gradient properties keep their object shape without a resolver. Switching between strings and
  // objects based on caller configuration would make consumer `.serialized` access silently fail.
  const { getComponentSpecMjs: generate } = createStringifier({ prefix: "test" });

  const result = generate(tokenRefGradientSpec());

  expect(result).toContain('"serialized": "var(--test-gradient-mask-fade)"');
  expect(result).not.toContain('"stops"');
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
  definitions:
    base:
      enabled:
        root:
          color: "#ffffff"
      pressed:
        root:
          scaleScope: content
`;
  const model = Authoring.parseComponentSpecDocument(YAML.parse(yaml));

  const result = getComponentSpecMjs(model.data);

  // `pressed` disappears entirely: its only property is an enum, which leaves the
  // slot empty, which leaves the state empty.
  expect(result).toMatchInlineSnapshot(`
    "export const vars = {
      "base": {
        "enabled": {
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
      definitions: [
        { variants: {}, slots: { root: { color: { type: "color", value: "$color.bg.neutral" } } } },
        {
          variants: { labelAlign: "center" },
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
        "definitions": readonly [
          {
            "variants": {};
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
