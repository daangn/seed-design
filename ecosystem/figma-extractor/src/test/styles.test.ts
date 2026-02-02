import { describe, it, expect, mock } from "bun:test";

mock.module("../api/client", () => import("../api/__mocks__/client"));

const { getStylesMetadataInFile } = await import("../api/styles");
const { createApiClient } = await import("../api/client");

describe("styles", () => {
  const fileKey = "test-file-key";
  const api = createApiClient("test-token");

  describe("getStylesMetadataInFile", () => {
    it("should return styles metadata", async () => {
      const result = await getStylesMetadataInFile({ api, fileKey });

      expect(result.map(({ name }) => ({ name }))).toMatchInlineSnapshot(`
        [
          {
            "name": "shadow",
          },
          {
            "name": "cool style",
          },
        ]
      `);
    });
  });
});
