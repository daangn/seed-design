import { describe, expect, it } from "bun:test";

import YAML from "yaml";
import { parseComponentSpecDeclaration } from "./component-spec";
import * as factory from "../factory";

describe("parseComponentSpecData", () => {
  it("should parse base only", () => {
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
  `;

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", "color"),
          ]),
        ],
        [],
      ),
      [
        factory.createVariantDeclaration(
          [],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#ffffff"),
                  ),
                ]),
              ],
            ),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
  });

  it("should parse base and variants", () => {
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

    const parsed = parseComponentSpecDeclaration(YAML.parse(yaml));

    const expected = factory.createComponentSpecDeclaration(
      "test",
      "test",
      factory.createSchemaDeclaration(
        [
          factory.createSlotSchemaDeclaration("root", [
            factory.createPropertySchemaDeclaration("color", "color"),
          ]),
        ],
        [
          factory.createVariantSchemaDeclaration(
            "variant",
            [factory.createVariantValueSchemaDeclaration("primary")],
            "primary",
          ),
        ],
      ),
      [
        factory.createVariantDeclaration(
          [],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#ffffff"),
                  ),
                ]),
              ],
            ),
          ],
        ),
        factory.createVariantDeclaration(
          [factory.createVariantExpression("variant", "primary")],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#000000"),
                  ),
                ]),
              ],
            ),
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
    definitions:
      base:
        enabled,selected:
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
            factory.createPropertySchemaDeclaration("color", "color"),
          ]),
        ],
        [],
      ),
      [
        factory.createVariantDeclaration(
          [],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled"), factory.createStateExpression("selected")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#ffffff"),
                  ),
                ]),
              ],
            ),
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
    definitions:
      base:
        enabled:
          root:
            color: "#ffffff"
      variant=primary,shape=rounded:
        enabled:
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
            factory.createPropertySchemaDeclaration("color", "color"),
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
      ),
      [
        factory.createVariantDeclaration(
          [],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#ffffff"),
                  ),
                ]),
              ],
            ),
          ],
        ),
        factory.createVariantDeclaration(
          [
            factory.createVariantExpression("variant", "primary"),
            factory.createVariantExpression("shape", "rounded"),
          ],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
              [
                factory.createSlotDeclaration("root", [
                  factory.createColorPropertyDeclaration(
                    "color",
                    factory.createColorHexLit("#000000"),
                  ),
                ]),
              ],
            ),
          ],
        ),
      ],
    );

    expect(parsed).toEqual(expected);
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
    definitions:
      base:
        enabled:
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
            factory.createPropertySchemaDeclaration("shadow", "shadow"),
          ]),
        ],
        [],
      ),
      [
        factory.createVariantDeclaration(
          [],
          [
            factory.createStateDeclaration(
              [factory.createStateExpression("enabled")],
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
  definitions:
    base:
      enabled:
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
  definitions:
    base:
      enabled:
        root:
          color: 8px
`;

    expect(() => parseComponentSpecDeclaration(YAML.parse(yaml))).toThrow(
      'is declared as "color" but its value is not a valid color',
    );
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
  definitions:
    base:
      enabled:
        root:
          color: "$dimension.x1"
`;

    // An alias is well-formed wherever it appears — whether it points at the right
    // kind of token is settled later, against the resolved token.
    expect(() => parseComponentSpecDeclaration(YAML.parse(yaml))).not.toThrow();
  });
});
