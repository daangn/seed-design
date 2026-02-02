import { describe, it, expect, mock } from "bun:test";

mock.module("../api/client", () => import("../api/__mocks__/client"));

const { getVariableMetadataItemsInFile } = await import("../api/variables");
const { createApiClient } = await import("../api/client");

describe("variables", () => {
  const fileKey = "test-file-key";
  const api = createApiClient("test-token");

  describe("getVariableMetadataItemsInFile", () => {
    it("should return variable metadata", async () => {
      const result = await getVariableMetadataItemsInFile({ api, fileKey });

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "codeSyntax": {},
            "description": "",
            "hiddenFromPublishing": false,
            "id": "VariableID:1:4",
            "key": "7a63e0d4a9ee19d4a0638948387e3c24f5045e28",
            "name": "Color",
            "remote": false,
            "resolvedType": "COLOR",
            "scopes": [
              "ALL_SCOPES",
            ],
            "valuesByMode": {
              "1:0": {
                "a": 1,
                "b": 1,
                "g": 1,
                "r": 1,
              },
              "1:1": {
                "a": 1,
                "b": 0.2739384174346924,
                "g": 0.2739384174346924,
                "r": 0.32211539149284363,
              },
            },
            "variableCollectionId": "VariableCollectionId:1:3",
          },
          {
            "codeSyntax": {},
            "description": "",
            "hiddenFromPublishing": false,
            "id": "VariableID:1:6",
            "key": "0035d13650c210a1bb8be6fb504ff0a1fb3bf997",
            "name": "Number",
            "remote": false,
            "resolvedType": "FLOAT",
            "scopes": [
              "ALL_SCOPES",
            ],
            "valuesByMode": {
              "1:2": 3,
              "1:3": 3,
            },
            "variableCollectionId": "VariableCollectionId:1:5",
          },
          {
            "codeSyntax": {},
            "description": "",
            "hiddenFromPublishing": false,
            "id": "VariableID:1:7",
            "key": "f4e6fa3397752f85549ed5efb52e1145fea1d9cb",
            "name": "Boolean",
            "remote": false,
            "resolvedType": "BOOLEAN",
            "scopes": [
              "ALL_SCOPES",
            ],
            "valuesByMode": {
              "1:2": false,
              "1:3": false,
            },
            "variableCollectionId": "VariableCollectionId:1:5",
          },
        ]
      `);
    });
  });
});
