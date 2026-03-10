import { describe, expect, it } from "bun:test";

import * as factory from "../factory";
import { parseComponentSpecDeclaration } from "./component-spec";
import type { ComponentSpecData } from "./types";

describe("parseComponentSpecData", () => {
  it("should parse base only", () => {
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
      },
      definitions: [
        {
          variants: {},
          definitions: [
            {
              states: ["enabled"],
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
      },
      definitions: [
        {
          variants: {},
          definitions: [
            {
              states: ["enabled"],
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
        },
        {
          variants: {
            variant: "primary",
          },
          definitions: [
            {
              states: ["enabled"],
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
      },
      definitions: [
        {
          variants: {},
          definitions: [
            {
              states: ["enabled", "selected"],
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
      },
      definitions: [
        {
          variants: {},
          definitions: [
            {
              states: ["enabled"],
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
        },
        {
          variants: {
            variant: "primary",
            shape: "rounded",
          },
          definitions: [
            {
              states: ["enabled"],
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
      },
      definitions: [
        {
          variants: {},
          definitions: [
            {
              states: ["enabled"],
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
});
