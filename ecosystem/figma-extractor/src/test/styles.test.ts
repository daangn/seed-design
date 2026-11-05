import { describe, it, expect, mock } from "bun:test";
import * as clientMock from "../api/__mocks__/client";

// Keep this factory synchronous. One returning a pending promise (`() => import(...)`) hangs bun
// once another test file has already loaded "../api/client".
mock.module("../api/client", () => clientMock);

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
