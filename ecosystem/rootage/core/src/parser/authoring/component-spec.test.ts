import { describe, expect, it } from "bun:test";

import YAML from "yaml";
import { parseComponentSpecDeclaration } from "./component-spec";
import * as factory from "../factory";

describe("parseComponentSpecData", () => {
  it("should parse a rule that names neither a variant nor a state", () => {
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
  rules:
    - slots:
        root:
          color: "#ffffff"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", { type: "color" }),
          ]),
        ],
        [],
        [],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#ffffff")),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should parse a rule that names a variant alongside one that does not", () => {
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
        defaultValue: primary
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

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", { type: "color" }),
          ]),
        ],
        [
          factory.createVariantSchemaDeclaration(
            "variant",
            [factory.createVariantValueSchemaDeclaration("primary")],
            "primary",
          ),
        ],
        [],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#ffffff")),
            ]),
          ],
        ),
        factory.createRuleDeclaration(
          [factory.createVariantExpression("variant", "primary")],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#000000")),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should parse compound state", () => {
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
      - id: pressed
      - id: selected
  rules:
    - states:
        - pressed
        - selected
      slots:
        root:
          color: "#ffffff"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", { type: "color" }),
          ]),
        ],
        [],
        [
          factory.createStateSchemaDeclaration("pressed", []),
          factory.createStateSchemaDeclaration("selected", []),
        ],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [factory.createStateExpression("pressed"), factory.createStateExpression("selected")],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#ffffff")),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should parse compound variants", () => {
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
        defaultValue: primary
      shape:
        values:
          rounded: {}
        defaultValue: rounded
  rules:
    - slots:
        root:
          color: "#ffffff"
    - variants:
        variant: primary
        shape: rounded
      slots:
        root:
          color: "#000000"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", { type: "color" }),
          ]),
        ],
        [
          factory.createVariantSchemaDeclaration(
            "variant",
            [factory.createVariantValueSchemaDeclaration("primary")],
            "primary",
          ),
          factory.createVariantSchemaDeclaration(
            "shape",
            [factory.createVariantValueSchemaDeclaration("rounded")],
            "rounded",
          ),
        ],
        [],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#ffffff")),
            ]),
          ],
        ),
        factory.createRuleDeclaration(
          [
            factory.createVariantExpression("variant", "primary"),
            factory.createVariantExpression("shape", "rounded"),
          ],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#000000")),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should sort a rule's variants and states into schema order", () => {
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
        defaultValue: primary
      shape:
        values:
          rounded: {}
        defaultValue: rounded
    states:
      - id: pressed
      - id: disabled
  rules:
    - variants:
        shape: rounded
        variant: primary
      states:
        - disabled
        - pressed
      slots:
        root:
          color: "#000000"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    expect(parsed.rules).toEqual([
      factory.createRuleDeclaration(
        [
          factory.createVariantExpression("variant", "primary"),
          factory.createVariantExpression("shape", "rounded"),
        ],
        [factory.createStateExpression("pressed"), factory.createStateExpression("disabled")],
        [
          factory.createSlotDeclaration("root", [
            factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#000000")),
          ]),
        ],
      ),
    ]);
  });

  it("should parse the state schema, defaulting suppresses to an empty list", () => {
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
      - id: pressed
      - id: disabled
        suppresses:
          - pressed
        description: Cancels the press feedback outright.
  rules:
    - slots:
        root:
          color: "#ffffff"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    expect(parsed.schema.states).toEqual([
      factory.createStateSchemaDeclaration("pressed", []),
      factory.createStateSchemaDeclaration(
        "disabled",
        ["pressed"],
        "Cancels the press feedback outright.",
      ),
    ]);
  });

  it("should parse shadow", () => {
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
          shadow:
            type: shadow
  rules:
    - slots:
        root:
          shadow:
            type: shadow
            value:
              - offsetX: 0px
                offsetY: 3px
                blur: 8px
                spread: 0px
                color: "#00000026"
              - offsetX: 0px
                offsetY: 1px
                blur: 3px
                spread: 0px
                color: "#0000000f"
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("shadow", { type: "shadow" }),
          ]),
        ],
        [],
        [],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [],
          [
            factory.createSlotDeclaration("root", [
              factory.createShadowPropertyDeclaration(
                "shadow",
                factory.createShadowLit([
                  factory.createShadowLayerLit(
                    factory.createColorHexLit("#00000026"),
                    factory.createDimensionLit(0, "px"),
                    factory.createDimensionLit(3, "px"),
                    factory.createDimensionLit(8, "px"),
                    factory.createDimensionLit(0, "px"),
                  ),
                  factory.createShadowLayerLit(
                    factory.createColorHexLit("#0000000f"),
                    factory.createDimensionLit(0, "px"),
                    factory.createDimensionLit(1, "px"),
                    factory.createDimensionLit(3, "px"),
                    factory.createDimensionLit(0, "px"),
                  ),
                ]),
              ),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should reject a property the slot schema does not declare", () => {
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
  rules:
    - slots:
        root:
          background: "#ffffff"
`;

    expect(() => parseComponentSpecDeclaration(YAML.parse(yaml))).toThrow(
      'Property "background" of slot "root" in component spec "test" is not declared in the slot schema.',
    );
  });

  it("should reject a value that does not match its declared type", () => {
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
  rules:
    - slots:
        root:
          color: 8px
`;

    expect(() => parseComponentSpecDeclaration(YAML.parse(yaml))).toThrow(
      'is declared as "color" but its value is not a valid color',
    );
  });

  it("should parse a bare word as an enum when the schema declares one", () => {
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
          scaleScope:
            type: enum
            values: [self, content]
    states:
      - id: pressed
  rules:
    - states:
        - pressed
      slots:
        root:
          scaleScope: content
`;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("scaleScope", {
              type: "enum",
              values: ["self", "content"],
            }),
          ]),
        ],
        [],
        [factory.createStateSchemaDeclaration("pressed", [])],
      ),
      [
        factory.createRuleDeclaration(
          [],
          [factory.createStateExpression("pressed")],
          [
            factory.createSlotDeclaration("root", [
              factory.createEnumPropertyDeclaration("scaleScope", factory.createEnumLit("content")),
            ]),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should accept a token reference under any declared type", () => {
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
  rules:
    - slots:
        root:
          color: "$dimension.x1"
`;

    // An alias is well-formed wherever it appears — whether it points at the right
    // kind of token is settled later, against the resolved token.
    expect(() => parseComponentSpecDeclaration(YAML.parse(yaml))).not.toThrow();
  });
});
