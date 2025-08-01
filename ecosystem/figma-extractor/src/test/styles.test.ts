import { describe, it, expect } from "vitest";
import { getStylesMetadataInFile } from "../api/styles";
import { createApiClient } from "../api/client";

describe("styles", () => {
  const fileKey = process.env.FIGMA_FILE_KEY;
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;

  if (!fileKey || !token) {
    it.skip("skipping integration tests - FIGMA_FILE_KEY or FIGMA_PERSONAL_ACCESS_TOKEN not set", () => {});
    return;
  }

  const api = createApiClient(token);

  describe("getStylesMetadataInFile", { timeout: 10000 }, () => {
    it("should fetch styles metadata from Figma", async () => {
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
