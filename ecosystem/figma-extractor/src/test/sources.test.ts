import { describe, it, expect, mock } from "bun:test";

mock.module("../api/client", () => import("../api/__mocks__/client"));

const { sources } = await import("../pipeline/sources");
const { createApiClient } = await import("../api/client");

describe("sources", () => {
  const fileKey = "test-file-key";
  const api = createApiClient("test-token");

  const context = {
    api,
    fileKey,
    pipelineName: "test-pipeline",
    write: () => Promise.resolve(),
    fetchNodes: () => Promise.resolve([]),
    utils: {
      toJson: () => "",
      toTypeScript: () => "",
      toMjs: () => "",
      toDts: () => "",
    },
  };

  describe("components source", () => {
    it("should fetch real component metadata", async () => {
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

  describe("component sets source", () => {
    it("should fetch real component set metadata", async () => {
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

  describe("styles source", () => {
    it("should fetch real style metadata", async () => {
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

  describe("variables source", () => {
    it("should fetch real variable metadata", async () => {
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
