import { describe, expect, it } from "bun:test";

import * as factory from "../factory";
import { parseComponentSpecDeclaration } from "./component-spec";
import type { ComponentSpecData } from "./types";

describe("parseComponentSpecData", () => {
  it("should parse a rule that names neither a variant nor a state", () => {
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {},
        states: [],
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#ffffff",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {
          variant: {
            values: {
              primary: {},
            },
            defaultValue: "primary",
          },
        },
        states: [],
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#ffffff",
              },
            },
          },
        },
        {
          variants: {
            variant: "primary",
          },
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#000000",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {},
        states: [
          { id: "pressed", suppresses: [] },
          { id: "selected", suppresses: [] },
        ],
      },
      rules: [
        {
          variants: {},
          states: ["pressed", "selected"],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#ffffff",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {
          variant: {
            values: {
              primary: {},
            },
            defaultValue: "primary",
          },
          shape: {
            values: {
              rounded: {},
            },
            defaultValue: "rounded",
          },
        },
        states: [],
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#ffffff",
              },
            },
          },
        },
        {
          variants: {
            variant: "primary",
            shape: "rounded",
          },
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#000000",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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

  it("should keep a rule's variants and states in the order the document writes them", () => {
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {
          variant: {
            values: {
              primary: {},
            },
            defaultValue: "primary",
          },
          shape: {
            values: {
              rounded: {},
            },
            defaultValue: "rounded",
          },
        },
        states: [
          { id: "pressed", suppresses: [] },
          { id: "disabled", suppresses: ["pressed"] },
        ],
      },
      rules: [
        {
          variants: {
            shape: "rounded",
            variant: "primary",
          },
          states: ["disabled", "pressed"],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#000000",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

    // An exchange document is generated from an already-sorted authoring AST, so its
    // order is the answer rather than something to re-derive.
    expect(parsed.rules).toEqual([
      factory.createRuleDeclaration(
        [
          factory.createVariantExpression("shape", "rounded"),
          factory.createVariantExpression("variant", "primary"),
        ],
        [factory.createStateExpression("disabled"), factory.createStateExpression("pressed")],
        [
          factory.createSlotDeclaration("root", [
            factory.createColorPropertyDeclaration("color", factory.createColorHexLit("#000000")),
          ]),
        ],
      ),
    ]);
  });

  it("should parse the state schema with its suppresses list", () => {
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              color: {
                type: "color",
              },
            },
          },
        },
        variants: {},
        states: [
          { id: "pressed", suppresses: [] },
          {
            id: "disabled",
            suppresses: ["pressed"],
            description: "Cancels the press feedback outright.",
          },
        ],
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: {
            root: {
              color: {
                type: "color",
                value: "#ffffff",
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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
    const input: ComponentSpecData = {
      id: "test",
      name: "test",
      schema: {
        slots: {
          root: {
            properties: {
              shadow: {
                type: "shadow",
              },
            },
          },
        },
        variants: {},
        states: [],
      },
      rules: [
        {
          variants: {},
          states: [],
          slots: {
            root: {
              shadow: {
                type: "shadow",
                value: [
                  {
                    offsetX: {
                      value: 0,
                      unit: "px",
                    },
                    offsetY: {
                      value: 3,
                      unit: "px",
                    },
                    blur: {
                      value: 8,
                      unit: "px",
                    },
                    spread: {
                      value: 0,
                      unit: "px",
                    },
                    color: "#00000026",
                  },
                  {
                    offsetX: {
                      value: 0,
                      unit: "px",
                    },
                    offsetY: {
                      value: 1,
                      unit: "px",
                    },
                    blur: {
                      value: 3,
                      unit: "px",
                    },
                    spread: {
                      value: 0,
                      unit: "px",
                    },
                    color: "#0000000f",
                  },
                ],
              },
            },
          },
        },
      ],
    };

    const parsed = parseComponentSpecDeclaration(input);

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
});
