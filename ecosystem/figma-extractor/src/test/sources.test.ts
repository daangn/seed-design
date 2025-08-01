import { describe, it, expect } from "vitest";
import { sources } from "../pipeline/sources";
import { createApiClient } from "../api/client";

describe("sources", () => {
  const fileKey = process.env.FIGMA_FILE_KEY;
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;

  if (!fileKey || !token) {
    it.skip("skipping integration tests - FIGMA_FILE_KEY or FIGMA_PERSONAL_ACCESS_TOKEN not set", () => {});
    return;
  }

  const api = createApiClient(token);

  const context = {
    api,
    fileKey,
    pipelineName: "test-pipeline",
    write: () => Promise.resolve(),
    utils: {
      toJson: () => "",
      toTypeScript: () => "",
      toMjs: () => "",
      toDts: () => "",
    },
  };

  describe("components source", { timeout: 10000 }, () => {
    it("should fetch real component metadata from Figma", async () => {
      const result = await sources.components(context);

      expect(result.map(({ name }) => ({ name }))).toMatchInlineSnapshot(`
        [
          {
            "name": "Property 1=Default",
          },
          {
            "name": "Property 1=Variant2",
          },
          {
            "name": "Rectangle 2",
          },
        ]
      `);
    });
  });

  describe("component sets source", { timeout: 10000 }, () => {
    it("should fetch real component set metadata from Figma", async () => {
      const result = await sources.componentSets(context);

      expect(result.map(({ name }) => ({ name }))).toMatchInlineSnapshot(`
        [
          {
            "name": "Rectangle 1",
          },
        ]
      `);
    });
  });

  describe("styles source", { timeout: 10000 }, () => {
    it("should fetch real style metadata from Figma", async () => {
      const result = await sources.styles(context);

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

  describe("variables source", { timeout: 10000 }, () => {
    it("should fetch real variable metadata from Figma", async () => {
      const result = await sources.variables(context);

      expect(result.map(({ name }) => ({ name }))).toMatchInlineSnapshot(`
        [
          {
            "name": "Color",
          },
          {
            "name": "Number",
          },
          {
            "name": "Boolean",
          },
        ]
      `);
    });
  });
});
