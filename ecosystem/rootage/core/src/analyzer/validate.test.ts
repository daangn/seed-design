import dedent from "dedent";
import { describe, expect, it } from "bun:test";
import { Authoring, Exchange } from "../parser";
import { buildContext } from "./context";
import type { SourceFile } from "./types";
import { validate } from "./validate";

/**
 * A ComponentSpec in the exchange format, whose schema declares a single `root`
 * slot while the definitions may name any slot.
 *
 * Exchange values carry their own type tag rather than being typed by the schema,
 * which makes this the only remaining way to hand `validate` a slot, property, or
 * value the schema never declared — the authoring parser rejects all three while
 * parsing (see parser/authoring/component-spec.ts).
 */
function componentSpec(
  id: string,
  rootProperties: Exchange.ComponentSpecPropertySchema,
  slots: Record<string, Record<string, Exchange.Value>>,
): Exchange.ComponentSpecModel {
  return {
    kind: "ComponentSpec",
    metadata: { id, name: "component" },
    data: {
      id,
      name: "component",
      schema: { slots: { root: { properties: rootProperties } }, variants: {} },
      definitions: [{ variants: {}, definitions: [{ states: ["enabled"], slots }] }],
    },
  };
}

describe("validate", () => {
  it("should return true for valid models", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light
              - id: dark`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
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
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(true);
  });

  it("should return false if token collection is not defined", () => {
    const files: SourceFile[] = [
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if mode is not defined in token collection", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if referenced token is not defined - Tokens", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: $color.bg.layer-2`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if a token references itself", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: $color.bg.layer-1`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if two tokens reference each other", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: $color.bg.layer-2
            "$color.bg.layer-2":
              values:
                light: $color.bg.layer-1`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if three or more tokens form a reference cycle", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: $color.bg.layer-2
            "$color.bg.layer-2":
              values:
                light: $color.bg.layer-3
            "$color.bg.layer-3":
              values:
                light: $color.bg.layer-1`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if referenced token is not defined - ComponentSpec", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light
              - id: dark`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
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
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if slot is not defined in schema", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light
              - id: dark`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "3",
            { color: { type: "color" } },
            { container: { color: { type: "color", value: "$color.bg.layer-1" } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Slot "container" is not defined in schema');
  });

  it("should return false if property is not defined in slot schema", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light
              - id: dark`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "3",
            { color: { type: "color" } },
            { root: { background: { type: "color", value: "$color.bg.layer-1" } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "background" is not defined in slot "root" schema');
  });

  it("should return false if property type mismatches - literal value", () => {
    const files: SourceFile[] = [
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "1",
            { color: { type: "color" } },
            { root: { color: { type: "dimension", value: { value: 8, unit: "px" } } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "color" expects type "color" but got "dimension"');
  });

  it("should return false if an enum value is not one the schema lists", () => {
    const files: SourceFile[] = [
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "1",
            { scaleScope: { type: "enum", values: ["self", "content"] } },
            { root: { scaleScope: { type: "enum", value: "contnet" } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'Property "scaleScope" expects one of "self", "content" but got "contnet"',
    );
  });

  it("should return false if an enum lists a value that would read as a token reference", () => {
    const files: SourceFile[] = [
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "1",
            { scaleScope: { type: "enum", values: ["self", "$content"] } },
            { root: { scaleScope: { type: "enum", value: "self" } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Enum value "$content" of property "scaleScope"');
  });

  it("should return false if an enum lists no values", () => {
    const files: SourceFile[] = [
      {
        fileName: "component",
        ast: Exchange.fromObject(
          componentSpec(
            "1",
            { scaleScope: { type: "enum", values: [] } },
            { root: { scaleScope: { type: "enum", value: "self" } } },
          ),
        ),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'Property "scaleScope" in slot "root" is an enum with no values',
    );
  });

  it("should return false if schema property is never used in definitions", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes:
              - id: light
              - id: dark`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
        data:
          schema:
            slots:
              root:
                properties:
                  color:
                    type: color
                  unusedProp:
                    type: color
          definitions:
            base:
              enabled:
                root:
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'Property "unusedProp" in slot "root" is defined in schema but never used in definitions',
    );
  });

  it("should return false if property type mismatches - token reference", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: dimension
            modes:
              - id: default`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: dimension
          tokens:
            "$dimension.x4":
              values:
                default: 16px`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
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
                  color: "$dimension.x4"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "color" expects type "color" but got "dimension"');
  });

  describe("haptic", () => {
    const globalCollection: SourceFile = {
      fileName: "collection",
      ast: Authoring.fromString(dedent`
      kind: TokenCollections
      metadata:
        id: "1"
        name: collection
      data:
        - name: global
          modes:
            - id: default
        - name: color
          modes:
            - id: light
            - id: dark`),
    };

    const hapticTokens: SourceFile = {
      fileName: "haptic",
      ast: Authoring.fromString(dedent`
      kind: Tokens
      metadata:
        id: haptic
        name: Haptic
      data:
        collection: global
        tokens:
          $haptic.primitive.sharp-weak:
            values:
              default:
                type: haptic
                value: { sharpness: 0.9, intensity: 0.3 }
          $haptic.preset.success:
            values:
              default:
                type: haptic
                value: { system: success }
          $haptic.semantic.confirm:
            values:
              default: $haptic.preset.success`),
    };

    const colorTokens: SourceFile = {
      fileName: "color",
      ast: Authoring.fromString(dedent`
      kind: Tokens
      metadata:
        id: color
        name: Color
      data:
        collection: color
        tokens:
          $color.bg.layer-1:
            values:
              light: "#ffffff"
              dark: "#000000"`),
    };

    it("should return true for haptic tokens and an alias between them", () => {
      const result = validate(buildContext([globalCollection, hapticTokens]));

      expect(result.valid).toEqual(true);
    });

    it("should return false if a haptic token references a token of another type", () => {
      const files: SourceFile[] = [
        globalCollection,
        colorTokens,
        {
          fileName: "haptic",
          ast: Exchange.fromObject({
            kind: "Tokens",
            metadata: { id: "haptic", name: "Haptic" },
            data: {
              collection: "global",
              tokens: {
                "$haptic.semantic.confirm": {
                  values: { default: { type: "haptic", value: "$color.bg.layer-1" } },
                },
              },
            },
          }),
        },
      ];

      const result = validate(buildContext(files));

      expect(result.valid).toEqual(false);
      expect(result.message).toContain(
        'Token "$haptic.semantic.confirm" expects type "haptic" but references "$color.bg.layer-1" of type "color"',
      );
    });

    it("should return false if a token of another type references a haptic token", () => {
      const files: SourceFile[] = [
        globalCollection,
        hapticTokens,
        {
          fileName: "color",
          ast: Authoring.fromString(dedent`
          kind: Tokens
          metadata:
            id: color
            name: Color
          data:
            collection: color
            tokens:
              $color.bg.layer-1:
                values:
                  light: "#ffffff"
                  dark: $haptic.preset.success`),
        },
      ];

      const result = validate(buildContext(files));

      expect(result.valid).toEqual(false);
      expect(result.message).toContain(
        'Token "$color.bg.layer-1" expects type "color" but references "$haptic.preset.success" of type "haptic"',
      );
    });

    it("should return false if a component spec references a haptic token", () => {
      const files: SourceFile[] = [
        globalCollection,
        hapticTokens,
        {
          fileName: "component",
          ast: Authoring.fromString(dedent`
          kind: ComponentSpec
          metadata:
            id: "3"
            name: component
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
                    color: $haptic.preset.success`),
        },
      ];

      const result = validate(buildContext(files));

      expect(result.valid).toEqual(false);
      expect(result.message).toContain('Property "color" expects type "color" but got "haptic"');
    });

    const hapticPropertySpec = (value: string): SourceFile => ({
      fileName: "component",
      ast: Authoring.fromString(dedent`
      kind: ComponentSpec
      metadata:
        id: "3"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                pressHaptic:
                  type: haptic
        definitions:
          base:
            pressed:
              root:
                pressHaptic: ${value}`),
    });

    it("should return true if a haptic property holds a haptic literal or token", () => {
      for (const value of [
        "{ type: haptic, value: { system: select } }",
        "$haptic.preset.success",
        "$haptic.semantic.confirm",
      ]) {
        const result = validate(
          buildContext([globalCollection, hapticTokens, hapticPropertySpec(value)]),
        );

        expect(result).toEqual({ valid: true, message: "" });
      }
    });

    it("should return false if a haptic property references a token of another type", () => {
      const files = [globalCollection, colorTokens, hapticPropertySpec("$color.bg.layer-1")];

      const result = validate(buildContext(files));

      expect(result.valid).toEqual(false);
      expect(result.message).toContain(
        'Property "pressHaptic" expects type "haptic" but got "color"',
      );
    });
  });
});
