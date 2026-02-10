import dedent from "dedent";
import type { TokenDeclaration, TokenLit } from "../parser/ast";

function stringifyTokenExpression(token: TokenLit): string {
  return `$${token.group.join(".")}.${token.key}`;
}

function getReadableValue(value: TokenDeclaration["values"][number]["value"]): string {
  switch (value.kind) {
    case "TokenLit":
      return stringifyTokenExpression(value);
    case "ColorHexLit":
      return value.value;
    case "GradientLit":
      return value.stops
        .map(({ position, color }) => `${Math.round(position.value * 100)}%: ${color.value}`)
        .join(", ");
    case "NumberLit":
      return `${value.value}`;
    case "DimensionLit":
      return `${value.value}${value.unit}`;
    case "DurationLit":
      return `${value.value}${value.unit}`;
    case "CubicBezierLit":
      return value.value.join(", ");
    case "ShadowLit":
      return value.layers
        .map(
          ({ offsetX, offsetY, blur, spread, color }) =>
            `${offsetX.value}${offsetX.unit} ${offsetY.value}${offsetY.unit} ${blur.value}${blur.unit} ${spread.value}${spread.unit} ${getReadableValue(color)}`,
        )
        .join(" / ");
    default:
      return `${value}`;
  }
}

export function getJsonSchema(tokens: TokenDeclaration[]): string {
  const tokenAnnotations = tokens
    .sort((a, b) => {
      const titleA = stringifyTokenExpression(a.token);
      const titleB = stringifyTokenExpression(b.token);
      return titleA.localeCompare(titleB);
    })
    .map(({ token, values }) => {
      const title = stringifyTokenExpression(token);
      const readableValues = values.map(({ mode, value }) => ({
        mode,
        value: getReadableValue(value),
      }));

      return {
        title,
        description: readableValues.map(({ mode, value }) => `${mode}: ${value}`).join("\\n"),
        markdownDescription: readableValues
          .map(({ mode, value }) => `- ${mode}: \`${value}\``)
          .join("\\n\\n"),
      };
    });

  return dedent.withOptions({ escapeSpecialCharacters: false })`{
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
            "enum": ["color", "dimension", "number", "duration", "cubicBezier", "shadow", "gradient"]${"" /* NOTE: this should be kept in sync with PropertySchemaDeclaration["type"] */}
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
        "pattern": "^-?\\d+(\\.\\d+)?(px|rem)$"
      },
      "durationShorthand": {
        "type": "string",
        "pattern": "^\\d+(\\.\\d+)?(s|ms)$"
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
          ${tokenAnnotations
            .map(
              (annotations) =>
                `{ ${[
                  `"const": "${annotations.title}"`,
                  ...Object.keys(annotations).map(
                    (key) => `"${key}": "${annotations[key as keyof typeof annotations]}"`,
                  ),
                ].join(", ")} }`,
            )
            .join(",\n          ")}
        ]
      }
    }
  }`;
}
