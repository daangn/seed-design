import { describe, it, expect, mock } from "bun:test";

mock.module("../api/client", () => import("../api/__mocks__/client"));

const { getComponentMetadataItemsInFile, getComponentSetMetadataItemsInFile } = await import(
  "../api/nodes"
);
const { createApiClient } = await import("../api/client");

describe("nodes", () => {
  const fileKey = "test-file-key";
  const api = createApiClient("test-token");

  describe("getComponentMetadataItemsInFile", () => {
    it("should fetch component metadata", async () => {
      const result = await getComponentMetadataItemsInFile({ api, fileKey });

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "absoluteBoundingBox": {
              "height": 154,
              "width": 131,
              "x": -419,
              "y": -467,
            },
            "absoluteRenderBounds": {
              "height": 154,
              "width": 131,
              "x": -419,
              "y": -467,
            },
            "background": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "backgroundColor": {
              "a": 0,
              "b": 0,
              "g": 0,
              "r": 0,
            },
            "blendMode": "PASS_THROUGH",
            "children": [
              {
                "absoluteBoundingBox": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -467,
                },
                "absoluteRenderBounds": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -467,
                },
                "blendMode": "PASS_THROUGH",
                "boundVariables": {
                  "fills": [
                    {
                      "id": "VariableID:1:4",
                      "type": "VARIABLE_ALIAS",
                    },
                  ],
                },
                "constraints": {
                  "horizontal": "SCALE",
                  "vertical": "SCALE",
                },
                "effects": [],
                "fills": [
                  {
                    "blendMode": "NORMAL",
                    "boundVariables": {
                      "color": {
                        "id": "VariableID:1:4",
                        "type": "VARIABLE_ALIAS",
                      },
                    },
                    "color": {
                      "a": 1,
                      "b": 1,
                      "g": 1,
                      "r": 1,
                    },
                    "type": "SOLID",
                  },
                ],
                "id": "1:2",
                "interactions": [],
                "name": "Rectangle 1",
                "scrollBehavior": "SCROLLS",
                "strokeAlign": "INSIDE",
                "strokeWeight": 1,
                "strokes": [],
                "type": "RECTANGLE",
              },
            ],
            "clipsContent": false,
            "componentSetId": "1:12",
            "constraints": {
              "horizontal": "LEFT",
              "vertical": "TOP",
            },
            "description": "",
            "documentationLinks": [],
            "effects": [],
            "fills": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "id": "1:11",
            "interactions": [],
            "key": "43441327cc12a9e49589040d940d1d27fa077b2a",
            "name": "Property 1=Default",
            "remote": false,
            "scrollBehavior": "SCROLLS",
            "strokeAlign": "INSIDE",
            "strokeWeight": 1,
            "strokes": [],
            "type": "COMPONENT",
          },
          {
            "absoluteBoundingBox": {
              "height": 154,
              "width": 131,
              "x": -419,
              "y": -293,
            },
            "absoluteRenderBounds": {
              "height": 162,
              "width": 139,
              "x": -423,
              "y": -293,
            },
            "background": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "backgroundColor": {
              "a": 0,
              "b": 0,
              "g": 0,
              "r": 0,
            },
            "blendMode": "PASS_THROUGH",
            "children": [
              {
                "absoluteBoundingBox": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -293,
                },
                "absoluteRenderBounds": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -293,
                },
                "blendMode": "PASS_THROUGH",
                "constraints": {
                  "horizontal": "SCALE",
                  "vertical": "SCALE",
                },
                "effects": [],
                "fills": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 0.2265593409538269,
                      "g": 0.2265593409538269,
                      "r": 0.4490872919559479,
                    },
                    "type": "SOLID",
                  },
                ],
                "id": "1:14",
                "interactions": [],
                "name": "Rectangle 1",
                "scrollBehavior": "SCROLLS",
                "strokeAlign": "INSIDE",
                "strokeWeight": 1,
                "strokes": [],
                "type": "RECTANGLE",
              },
            ],
            "clipsContent": false,
            "componentSetId": "1:12",
            "constraints": {
              "horizontal": "LEFT",
              "vertical": "TOP",
            },
            "description": "",
            "documentationLinks": [],
            "effects": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 0.25,
                  "b": 0.39630812406539917,
                  "g": 0.39630812406539917,
                  "r": 0.709641695022583,
                },
                "offset": {
                  "x": 0,
                  "y": 4,
                },
                "radius": 4,
                "showShadowBehindNode": false,
                "type": "DROP_SHADOW",
                "visible": true,
              },
            ],
            "fills": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "id": "1:13",
            "interactions": [],
            "key": "f92feb5bac9aa7681c4c9bf00e212d3d4119e919",
            "name": "Property 1=Variant2",
            "remote": false,
            "scrollBehavior": "SCROLLS",
            "strokeAlign": "INSIDE",
            "strokeWeight": 1,
            "strokes": [],
            "styles": {
              "effect": "1:16",
            },
            "type": "COMPONENT",
          },
          {
            "absoluteBoundingBox": {
              "height": 317,
              "width": 410,
              "x": -473,
              "y": -46,
            },
            "absoluteRenderBounds": {
              "height": 317,
              "width": 410,
              "x": -473,
              "y": -46,
            },
            "background": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "backgroundColor": {
              "a": 0,
              "b": 0,
              "g": 0,
              "r": 0,
            },
            "blendMode": "PASS_THROUGH",
            "children": [
              {
                "absoluteBoundingBox": {
                  "height": 317,
                  "width": 410,
                  "x": -473,
                  "y": -46,
                },
                "absoluteRenderBounds": {
                  "height": 317,
                  "width": 410,
                  "x": -473,
                  "y": -46,
                },
                "blendMode": "PASS_THROUGH",
                "constraints": {
                  "horizontal": "SCALE",
                  "vertical": "SCALE",
                },
                "effects": [],
                "fills": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 0.8509804010391235,
                      "g": 0.8509804010391235,
                      "r": 0.8509804010391235,
                    },
                    "type": "SOLID",
                  },
                ],
                "id": "1:8",
                "interactions": [],
                "name": "Rectangle 2",
                "scrollBehavior": "SCROLLS",
                "strokeAlign": "INSIDE",
                "strokeWeight": 1,
                "strokes": [],
                "type": "RECTANGLE",
              },
            ],
            "clipsContent": false,
            "constraints": {
              "horizontal": "LEFT",
              "vertical": "TOP",
            },
            "description": "",
            "documentationLinks": [],
            "effects": [],
            "fills": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 1,
                  "r": 1,
                },
                "type": "SOLID",
                "visible": false,
              },
            ],
            "id": "1:10",
            "interactions": [],
            "key": "91ee9d58f268180af7fee4b2cc44d1c73da4e4a8",
            "name": "Rectangle 2",
            "remote": false,
            "scrollBehavior": "SCROLLS",
            "strokeAlign": "INSIDE",
            "strokeWeight": 1,
            "strokes": [],
            "type": "COMPONENT",
          },
        ]
      `);
    });
  });

  describe("getComponentSetMetadataItemsInFile", () => {
    it("should fetch component set metadata", async () => {
      const result = await getComponentSetMetadataItemsInFile({ api, fileKey });

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "absoluteBoundingBox": {
              "height": 368,
              "width": 171,
              "x": -439,
              "y": -487,
            },
            "absoluteRenderBounds": {
              "height": 368,
              "width": 171,
              "x": -439,
              "y": -487,
            },
            "background": [],
            "backgroundColor": {
              "a": 0,
              "b": 0,
              "g": 0,
              "r": 0,
            },
            "blendMode": "PASS_THROUGH",
            "children": [
              {
                "absoluteBoundingBox": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -467,
                },
                "absoluteRenderBounds": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -467,
                },
                "background": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 1,
                      "g": 1,
                      "r": 1,
                    },
                    "type": "SOLID",
                    "visible": false,
                  },
                ],
                "backgroundColor": {
                  "a": 0,
                  "b": 0,
                  "g": 0,
                  "r": 0,
                },
                "blendMode": "PASS_THROUGH",
                "children": [
                  {
                    "absoluteBoundingBox": {
                      "height": 154,
                      "width": 131,
                      "x": -419,
                      "y": -467,
                    },
                    "absoluteRenderBounds": {
                      "height": 154,
                      "width": 131,
                      "x": -419,
                      "y": -467,
                    },
                    "blendMode": "PASS_THROUGH",
                    "boundVariables": {
                      "fills": [
                        {
                          "id": "VariableID:1:4",
                          "type": "VARIABLE_ALIAS",
                        },
                      ],
                    },
                    "constraints": {
                      "horizontal": "SCALE",
                      "vertical": "SCALE",
                    },
                    "effects": [],
                    "fills": [
                      {
                        "blendMode": "NORMAL",
                        "boundVariables": {
                          "color": {
                            "id": "VariableID:1:4",
                            "type": "VARIABLE_ALIAS",
                          },
                        },
                        "color": {
                          "a": 1,
                          "b": 1,
                          "g": 1,
                          "r": 1,
                        },
                        "type": "SOLID",
                      },
                    ],
                    "id": "1:2",
                    "interactions": [],
                    "name": "Rectangle 1",
                    "scrollBehavior": "SCROLLS",
                    "strokeAlign": "INSIDE",
                    "strokeWeight": 1,
                    "strokes": [],
                    "type": "RECTANGLE",
                  },
                ],
                "clipsContent": false,
                "constraints": {
                  "horizontal": "LEFT",
                  "vertical": "TOP",
                },
                "effects": [],
                "fills": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 1,
                      "g": 1,
                      "r": 1,
                    },
                    "type": "SOLID",
                    "visible": false,
                  },
                ],
                "id": "1:11",
                "interactions": [],
                "name": "Property 1=Default",
                "scrollBehavior": "SCROLLS",
                "strokeAlign": "INSIDE",
                "strokeWeight": 1,
                "strokes": [],
                "type": "COMPONENT",
              },
              {
                "absoluteBoundingBox": {
                  "height": 154,
                  "width": 131,
                  "x": -419,
                  "y": -293,
                },
                "absoluteRenderBounds": {
                  "height": 162,
                  "width": 139,
                  "x": -423,
                  "y": -293,
                },
                "background": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 1,
                      "g": 1,
                      "r": 1,
                    },
                    "type": "SOLID",
                    "visible": false,
                  },
                ],
                "backgroundColor": {
                  "a": 0,
                  "b": 0,
                  "g": 0,
                  "r": 0,
                },
                "blendMode": "PASS_THROUGH",
                "children": [
                  {
                    "absoluteBoundingBox": {
                      "height": 154,
                      "width": 131,
                      "x": -419,
                      "y": -293,
                    },
                    "absoluteRenderBounds": {
                      "height": 154,
                      "width": 131,
                      "x": -419,
                      "y": -293,
                    },
                    "blendMode": "PASS_THROUGH",
                    "constraints": {
                      "horizontal": "SCALE",
                      "vertical": "SCALE",
                    },
                    "effects": [],
                    "fills": [
                      {
                        "blendMode": "NORMAL",
                        "color": {
                          "a": 1,
                          "b": 0.2265593409538269,
                          "g": 0.2265593409538269,
                          "r": 0.4490872919559479,
                        },
                        "type": "SOLID",
                      },
                    ],
                    "id": "1:14",
                    "interactions": [],
                    "name": "Rectangle 1",
                    "scrollBehavior": "SCROLLS",
                    "strokeAlign": "INSIDE",
                    "strokeWeight": 1,
                    "strokes": [],
                    "type": "RECTANGLE",
                  },
                ],
                "clipsContent": false,
                "constraints": {
                  "horizontal": "LEFT",
                  "vertical": "TOP",
                },
                "effects": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 0.25,
                      "b": 0.39630812406539917,
                      "g": 0.39630812406539917,
                      "r": 0.709641695022583,
                    },
                    "offset": {
                      "x": 0,
                      "y": 4,
                    },
                    "radius": 4,
                    "showShadowBehindNode": false,
                    "type": "DROP_SHADOW",
                    "visible": true,
                  },
                ],
                "fills": [
                  {
                    "blendMode": "NORMAL",
                    "color": {
                      "a": 1,
                      "b": 1,
                      "g": 1,
                      "r": 1,
                    },
                    "type": "SOLID",
                    "visible": false,
                  },
                ],
                "id": "1:13",
                "interactions": [],
                "name": "Property 1=Variant2",
                "scrollBehavior": "SCROLLS",
                "strokeAlign": "INSIDE",
                "strokeWeight": 1,
                "strokes": [],
                "styles": {
                  "effect": "1:16",
                },
                "type": "COMPONENT",
              },
            ],
            "clipsContent": true,
            "componentPropertyDefinitions": {
              "Property 1": {
                "defaultValue": "Default",
                "type": "VARIANT",
                "variantOptions": [
                  "Default",
                  "Variant2",
                ],
              },
            },
            "constraints": {
              "horizontal": "LEFT",
              "vertical": "TOP",
            },
            "cornerRadius": 5,
            "cornerSmoothing": 0,
            "description": "",
            "documentationLinks": [],
            "effects": [],
            "fills": [],
            "id": "1:12",
            "interactions": [],
            "key": "6a6d68deca1a25d7c12c7015acb82b7486de3e7d",
            "name": "Rectangle 1",
            "scrollBehavior": "SCROLLS",
            "strokeAlign": "INSIDE",
            "strokeDashes": [
              10,
              5,
            ],
            "strokeWeight": 1,
            "strokes": [
              {
                "blendMode": "NORMAL",
                "color": {
                  "a": 1,
                  "b": 1,
                  "g": 0.27843138575553894,
                  "r": 0.5921568870544434,
                },
                "type": "SOLID",
              },
            ],
            "type": "COMPONENT_SET",
          },
        ]
      `);
    });
  });
});
