import { describe, expect, it } from "bun:test";

import YAML from "yaml";
import { getComponentSpecModel } from "./index";
import { Authoring, type Exchange } from "../../parser";

describe("getComponentSpecModel", () => {
  it("should transform base only", () => {
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
      },
    };

    expect(transformed).toEqual(expected);
  });

  it("should transform base and variants", () => {
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
            variants: { variant: "primary" },
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
    definitions:
      base:
        enabled,selected:
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
            variants: { variant: "primary", shape: "rounded" },
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
    definitions:
      base:
        enabled:
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
      },
    };

    expect(transformed).toEqual(expected);
  });
});
