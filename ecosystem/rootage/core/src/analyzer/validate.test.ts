import dedent from "dedent";
import { describe, expect, it } from "bun:test";
import { Authoring, Exchange } from "../parser";
import { buildContext } from "./context";
import type { SourceFile } from "./types";
import { validate } from "./validate";

/**
 * A ComponentSpec in the exchange format, whose schema declares a single `root`
 * slot while its one rule may name any slot.
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
      schema: { slots: { root: { properties: rootProperties } }, variants: {}, states: [] },
      rules: [{ variants: {}, states: [], slots }],
    },
  };
}

const validateComponentSpec = (yaml: string) =>
  validate(buildContext([{ fileName: "component", ast: Authoring.fromString(yaml) }]));

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
            states:
              - id: pressed
              - id: disabled
                suppresses: [pressed]
          rules:
            - slots:
                root:
                  color: "$color.bg.layer-1"
            - states: [disabled]
              slots:
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
          rules:
            - slots:
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
          rules:
            - slots:
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
          rules:
            - slots:
                root:
                  color: "$dimension.x4"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "color" expects type "color" but got "dimension"');
  });

  it("should return false if a rule names a state the schema does not declare", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          states:
            - id: disabled
        rules:
          - states: [pressed]
            slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('State "pressed" is not declared in schema');
  });

  it("should return false if a rule names the same state twice", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          states:
            - id: pressed
        rules:
          - states: [pressed, pressed]
            slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain("names a state twice");
  });

  it("should return false if a state is declared twice in the schema", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          states:
            - id: pressed
            - id: pressed
        rules:
          - states: [pressed]
            slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain("States are declared more than once");
  });

  it("should return false if a state suppresses one the schema does not declare", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          states:
            - id: pressed
            - id: disabled
              suppresses: [hovered]
        rules:
          - slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'State "disabled" suppresses "hovered", which is not declared',
    );
  });

  it("should return false if a state suppresses one of equal or higher precedence", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          states:
            - id: pressed
              suppresses: [disabled]
            - id: disabled
        rules:
          - slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'State "pressed" suppresses "disabled", which has equal or higher precedence',
    );
  });

  it("should return false if two rules carry the same selector", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
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
                brandSolid: {}
        rules:
          - variants:
              variant: brandSolid
            slots:
              root:
                color: "#ffffff"
          - variants:
              variant: brandSolid
            slots:
              root:
                color: "#000000"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      "{variant=brandSolid | any state} is declared by more than one rule",
    );
  });

  it("should return false if two rules declare one property over overlapping variants and neither is narrower", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          variants:
            size:
              values:
                large: {}
            type:
              values:
                multiline: {}
        rules:
          - variants:
              size: large
            slots:
              root:
                color: "#aaaaaa"
          - variants:
              type: multiline
            slots:
              root:
                color: "#cccccc"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('both declare "root.color" over an overlapping region');
  });

  it("should return true if one of the two overlapping selectors contains the other", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
      data:
        schema:
          slots:
            root:
              properties:
                color:
                  type: color
          variants:
            size:
              values:
                large: {}
            type:
              values:
                multiline: {}
        rules:
          - variants:
              size: large
            slots:
              root:
                color: "#aaaaaa"
          - variants:
              size: large
              type: multiline
            slots:
              root:
                color: "#cccccc"
    `);

    expect(result.valid).toEqual(true);
  });

  it("should return false if a variant defaultValue is not one of its values", () => {
    const result = validateComponentSpec(dedent`
      kind: ComponentSpec
      metadata:
        id: "1"
        name: component
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
                brandSolid: {}
              defaultValue: neutralSolid
        rules:
          - slots:
              root:
                color: "#ffffff"
    `);

    expect(result.valid).toEqual(false);
    expect(result.message).toContain(
      'Variant "variant" has defaultValue "neutralSolid", which is not one of its values',
    );
  });
});
