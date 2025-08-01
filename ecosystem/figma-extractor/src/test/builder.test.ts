import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPipeline } from "../pipeline/builder";
import { createApiClient } from "../api/client";

const testItems = [
  { name: "Button", type: "COMPONENT", order: 2, priority: 3 },
  { name: "Input", type: "COMPONENT", order: 1, priority: 1 },
  { name: "Card", type: "FRAME", order: 3, priority: 2 },
  { name: "Text", type: "TEXT", order: 0, priority: 4 },
];

describe("pipeline builder", () => {
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

  const mockSource = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSource.mockResolvedValue(testItems);
  });

  describe("filter", { timeout: 10000 }, () => {
    it("should filter items based on predicate", async () => {
      const pipeline = createPipeline()
        .source<(typeof testItems)[number]>(mockSource)
        .filter((item) => item.type === "COMPONENT")
        .write(async (items) => {
          expect(items).toMatchInlineSnapshot(`
            [
              {
                "name": "Button",
                "order": 2,
                "priority": 3,
                "type": "COMPONENT",
              },
              {
                "name": "Input",
                "order": 1,
                "priority": 1,
                "type": "COMPONENT",
              },
            ]
          `);
        });

      await pipeline.execute(context);
      expect(mockSource).toHaveBeenCalledWith(context);
    });
  });

  describe("sort", { timeout: 10000 }, () => {
    it("should sort items based on compareFn", async () => {
      const pipeline = createPipeline()
        .source<(typeof testItems)[number]>(mockSource)
        .sort((a, b) => a.priority - b.priority)
        .write(async (items) => {
          expect(items).toMatchInlineSnapshot(`
            [
              {
                "name": "Input",
                "order": 1,
                "priority": 1,
                "type": "COMPONENT",
              },
              {
                "name": "Card",
                "order": 3,
                "priority": 2,
                "type": "FRAME",
              },
              {
                "name": "Button",
                "order": 2,
                "priority": 3,
                "type": "COMPONENT",
              },
              {
                "name": "Text",
                "order": 0,
                "priority": 4,
                "type": "TEXT",
              },
            ]
          `);
        });

      await pipeline.execute(context);
    });
  });

  describe("transform", { timeout: 10000 }, () => {
    it("should transform items using the transform function", async () => {
      const pipeline = createPipeline()
        .source<(typeof testItems)[number]>(mockSource)
        .transform((item) => ({
          ...item,
          displayName: `${item.type}: ${item.name}`,
          isComponent: item.type === "COMPONENT",
        }))
        .write(async (items) => {
          expect(items).toMatchInlineSnapshot(`
            [
              {
                "displayName": "COMPONENT: Button",
                "isComponent": true,
                "name": "Button",
                "order": 2,
                "priority": 3,
                "type": "COMPONENT",
              },
              {
                "displayName": "COMPONENT: Input",
                "isComponent": true,
                "name": "Input",
                "order": 1,
                "priority": 1,
                "type": "COMPONENT",
              },
              {
                "displayName": "FRAME: Card",
                "isComponent": false,
                "name": "Card",
                "order": 3,
                "priority": 2,
                "type": "FRAME",
              },
              {
                "displayName": "TEXT: Text",
                "isComponent": false,
                "name": "Text",
                "order": 0,
                "priority": 4,
                "type": "TEXT",
              },
            ]
          `);
        });

      await pipeline.execute(context);
    });
  });

  describe("chained operations", { timeout: 10000 }, () => {
    it("should handle multiple chained operations", async () => {
      const pipeline = createPipeline()
        .source<(typeof testItems)[number]>(mockSource)
        .filter((item) => item.type === "COMPONENT")
        .sort((a, b) => a.order - b.order)
        .transform((item) => ({
          name: item.name.toUpperCase(),
          sortOrder: item.order,
        }))
        .write(async (items) => {
          expect(items).toMatchInlineSnapshot(`
            [
              {
                "name": "INPUT",
                "sortOrder": 1,
              },
              {
                "name": "BUTTON",
                "sortOrder": 2,
              },
            ]
          `);
        });

      await pipeline.execute(context);
    });
  });
});
