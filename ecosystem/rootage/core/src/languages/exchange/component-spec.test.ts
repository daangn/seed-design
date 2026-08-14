import { describe, expect, it } from "bun:test";

import YAML from "yaml";
import { getComponentSpecModel } from "./index";
import { Authoring, type Exchange } from "../../parser";

describe("getComponentSpecModel", () => {
  it("should transform a rule that names no variant and no state", () => {
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

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
      },
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform rules with and without a variant", () => {
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

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
            variants: { variant: "primary" },
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
      },
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform compound state", () => {
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
      - id: selected
      - id: pressed
  rules:
    - states:
        - selected
        - pressed
      slots:
        root:
          color: "#ffffff"
`;

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
            { id: "selected", suppresses: [] },
            { id: "pressed", suppresses: [] },
          ],
        },
        rules: [
          {
            variants: {},
            states: ["selected", "pressed"],
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
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform compound variants", () => {
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
      shape:
        values:
          rounded: {}
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

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
            },
            shape: {
              values: {
                rounded: {},
              },
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
            variants: { variant: "primary", shape: "rounded" },
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
      },
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform the state schema", () => {
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
    - states:
        - disabled
      slots:
        root:
          color: "#000000"
`;

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
            states: ["disabled"],
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
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform shadow", () => {
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

    const parsed = getComponentSpecModel(Authoring.parseComponentSpecDocument(YAML.parse(yaml)));

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
      },
      data: {
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
                      color: "#00000026",
                      offsetX: { value: 0, unit: "px" },
                      offsetY: { value: 3, unit: "px" },
                      blur: { value: 8, unit: "px" },
                      spread: { value: 0, unit: "px" },
                    },
                    {
                      color: "#0000000f",
                      offsetX: { value: 0, unit: "px" },
                      offsetY: { value: 1, unit: "px" },
                      blur: { value: 3, unit: "px" },
                      spread: { value: 0, unit: "px" },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    expect(parsed).toEqual(expected);
  });

  it("should transform external metadata fields", () => {
    const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
  deprecated: Deprecated
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

    const transformed = getComponentSpecModel(
      Authoring.parseComponentSpecDocument(YAML.parse(yaml)),
    );

    const expected: Exchange.ComponentSpecModel = {
      kind: "ComponentSpec",
      metadata: {
        id: "test",
        name: "test",
        deprecated: "Deprecated",
      },
      data: {
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
      },
    };

    expect(transformed).toEqual(expected);
  });
});
