import { describe, expect, it, test } from "vitest";
import YAML from "yaml";
import { Authoring } from "../parser";
import { createStringifier } from "./typescript";

const { getComponentSpecDts, getComponentSpecMjs, getTokenDts, getTokenMjs } = createStringifier({
  prefix: "seed",
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
        "code": "export * as palette from \\"./palette.mjs\\";
    export * as bg from \\"./bg.mjs\\";",
        "path": "color/index.mjs",
      },
      {
        "code": "export const gray00 = \\"var(--seed-color-palette-gray-00)\\";
    export const gray100 = \\"var(--seed-color-palette-gray-100)\\";",
        "path": "color/palette.mjs",
      },
      {
        "code": "export const layer1 = \\"var(--seed-color-bg-layer-1)\\";",
        "path": "color/bg.mjs",
      },
      {
        "code": "export const s1_5 = \\"var(--seed-dimension-s1_5)\\";",
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
          "code": "export const s1_5 = \\"var(--seed-dimension-s1_5)\\";

      export * as spacingX from \\"./spacing-x/index.mjs\\";",
          "path": "dimension/index.mjs",
        },
        {
          "code": "export const default = \\"var(--seed-dimension-spacing-x-default)\\";

      export * as test from \\"./test.mjs\\";",
          "path": "dimension/spacing-x/index.mjs",
        },
        {
          "code": "export const value = \\"var(--seed-dimension-spacing-x-test-value)\\";",
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
        "code": "export * as palette from \\"./palette\\";
    export * as bg from \\"./bg\\";",
        "path": "color/index.d.ts",
      },
      {
        "code": "export declare const gray00 = \\"var(--seed-color-palette-gray-00)\\";
    export declare const gray100 = \\"var(--seed-color-palette-gray-100)\\";",
        "path": "color/palette.d.ts",
      },
      {
        "code": "export declare const layer1 = \\"var(--seed-color-bg-layer-1)\\";",
        "path": "color/bg.d.ts",
      },
      {
        "code": "export declare const s1_5 = \\"var(--seed-dimension-s1_5)\\";",
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
        "code": "export declare const s1_5 = \\"var(--seed-dimension-s1_5)\\";

    export * as spacingX from \\"./spacing-x\\";",
        "path": "dimension/index.d.ts",
      },
      {
        "code": "export declare const default = \\"var(--seed-dimension-spacing-x-default)\\";",
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
      \\"base\\": {
        \\"enabled\\": {
          \\"root\\": {
            \\"color\\": \\"#ffffff\\"
          }
        }
      },
      \\"variantPrimary\\": {
        \\"enabled\\": {
          \\"root\\": {
            \\"color\\": \\"#000000\\"
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
      \\"base\\": {
        \\"enabled\\": {
          \\"root\\": {
            \\"color\\": \\"#ffffff\\"
          }
        }
      },
      \\"variantPrimary\\": {
        \\"enabled\\": {
          \\"root\\": {
            \\"color\\": \\"#000000\\"
          }
        }
      }
    }"
  `);
});
