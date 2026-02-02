import { expect, test } from "bun:test";
import { Authoring } from "../parser";
import { getJsonSchema } from "./jsonschema";

test("getJsonSchema should generate jsonschema for component spec", () => {
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
        name: "unit",
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

  const result = getJsonSchema(
    models.flatMap((model) => Authoring.parseTokensDocument(model).data),
  );

  expect(result).toMatchInlineSnapshot(`
    "{
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "ComponentSpecModel",
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "const": "ComponentSpec"
        },
        "metadata": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "deprecated": {
              "type": "string"
            },
            "lastUpdated": {
              "type": "string"
            }
          },
          "required": ["id", "name"],
          "additionalProperties": true
        },
        "data": {
          "type": "object",
          "properties": {
            "schema": {
              "$ref": "#/definitions/componentSpecSchema"
            },
            "definitions": {
              "$ref": "#/definitions/definitions"
            }
          }
        }
      },
      "required": ["kind", "metadata", "data"],
      "additionalProperties": false,
      "definitions": {
        "componentSpecSchema": {
          "type": "object",
          "properties": {
            "slots": {
              "$ref": "#/definitions/slotsSchema"
            },
            "variants": {
              "$ref": "#/definitions/variantsSchema"
            }
          },
          "additionalProperties": false
        },
        "slotsSchema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/slotSchema"
          }
        },
        "slotSchema": {
          "type": "object",
          "properties": {
            "properties": {
              "$ref": "#/definitions/slotPropertiesSchema"
            },
            "description": {
              "type": "string"
            }
          },
          "required": ["properties"],
          "additionalProperties": false
        },
        "slotPropertiesSchema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/slotPropertySchema"
          }
        },
        "slotPropertySchema": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": ["color", "dimension", "number", "duration", "cubicBezier", "shadow", "gradient"]
            },
            "description": {
              "type": "string"
            }
          },
          "required": ["type"],
          "additionalProperties": false
        },
        "variantsSchema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/variantSchema"
          }
        },
        "variantSchema": {
          "type": "object",
          "properties": {
            "values": {
              "$ref": "#/definitions/variantValuesSchema"
            },
            "defaultValue": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "variantValuesSchema": {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        },
        "definitions": {
          "type": "object",
          "properties": {
            "base": {
              "$ref": "#/definitions/variant"
            }
          },
          "patternProperties": {
            "^.*=.*$": {
              "$ref": "#/definitions/variant"
            }
          },
          "additionalProperties": false
        },
        "variant": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/state"
          }
        },
        "state": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/slot"
          }
        },
        "slot": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/definitions/righthandValue"
          }
        },
        "righthandValue": {
          "anyOf": [
            {
              "$ref": "#/definitions/colorShorthand"
            },
            {
              "$ref": "#/definitions/dimensionShorthand"
            },
            {
              "$ref": "#/definitions/durationShorthand"
            },
            {
              "$ref": "#/definitions/numberShorthand"
            },
            {
              "$ref": "#/definitions/cubicBezier"
            },
            {
              "$ref": "#/definitions/shadow"
            },
            {
              "$ref": "#/definitions/gradient"
            },
            {
              "$ref": "#/definitions/tokenRef"
            }
          ]
        },
        "colorShorthand": {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$"
        },
        "dimensionShorthand": {
          "type": "string",
          "pattern": "^-?\\\\d+(\\\\.\\\\d+)?(px|rem)$"
        },
        "durationShorthand": {
          "type": "string",
          "pattern": "^\\\\d+(\\\\.\\\\d+)?(s|ms)$"
        },
        "numberShorthand": {
          "type": "number"
        },
        "cubicBezier": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "const": "cubicBezier"
            },
            "value": {
              "type": "array",
              "items": {
                "type": "number"
              },
              "minItems": 4,
              "maxItems": 4
            }
          },
          "required": ["type", "value"],
          "additionalProperties": false
        },
        "shadow": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "const": "shadow"
            },
            "value": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "color": {
                    "anyOf": [
                      { "$ref": "#/definitions/colorShorthand" },
                      { "$ref": "#/definitions/tokenRef" }
                    ]
                  },
                  "offsetX": {
                    "$ref": "#/definitions/dimensionShorthand"
                  },
                  "offsetY": {
                    "$ref": "#/definitions/dimensionShorthand"
                  },
                  "blur": {
                    "$ref": "#/definitions/dimensionShorthand"
                  },
                  "spread": {
                    "$ref": "#/definitions/dimensionShorthand"
                  }
                },
                "required": ["color", "offsetX", "offsetY", "blur", "spread"],
                "additionalProperties": false
              }
            }
          },
          "required": ["type", "value"],
          "additionalProperties": false
        },
        "gradient": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "const": "gradient"
            },
            "value": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "color": {
                    "anyOf": [
                      { "$ref": "#/definitions/colorShorthand" },
                      { "$ref": "#/definitions/tokenRef" }
                    ]
                  },
                  "position": {
                    "type": "number"
                  }
                },
                "required": ["color", "position"],
                "additionalProperties": false
              }
            }
          },
          "required": ["type", "value"],
          "additionalProperties": false
        },
        "tokenRef": {
          "type": "string",
          "anyOf": [
            { "const": "$color.bg.layer-1", "title": "$color.bg.layer-1", "description": "light: $color.palette.gray-00\\ndark: $color.palette.gray-00", "markdownDescription": "- light: \`$color.palette.gray-00\`\\n\\n- dark: \`$color.palette.gray-00\`" },
            { "const": "$color.palette.gray-00", "title": "$color.palette.gray-00", "description": "light: #ffffff\\ndark: #000000", "markdownDescription": "- light: \`#ffffff\`\\n\\n- dark: \`#000000\`" },
            { "const": "$color.palette.gray-100", "title": "$color.palette.gray-100", "description": "light: #f8f9fa\\ndark: #212529", "markdownDescription": "- light: \`#f8f9fa\`\\n\\n- dark: \`#212529\`" },
            { "const": "$dimension.s1_5", "title": "$dimension.s1_5", "description": "default: 6px", "markdownDescription": "- default: \`6px\`" }
          ]
        }
      }
    }"
  `);
});

test("getJsonSchema should generate valid json", () => {
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
        name: "unit",
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

  const result = getJsonSchema(
    models.flatMap((model) => Authoring.parseTokensDocument(model).data),
  );

  expect(() => JSON.parse(result)).not.toThrow();
});
