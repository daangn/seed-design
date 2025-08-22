import { describe, it, expect, vi } from "vitest";
import { getStylesMetadataInFile } from "../api/styles";
import { createApiClient } from "../api/client";

vi.mock("../api/client");

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
