import { describe, expect, it } from "bun:test";
import { tool } from "ai";
import { z } from "zod";
import {
  applyApprovalPolicies,
  createToolDescriptor,
  inferToolCapability,
  inferToolRisk,
  mergeToolDescriptors,
  serializeToolCatalog,
} from "./tool-registry";

describe("tool-registry", () => {
  it("infers capability and risk from tool metadata", () => {
    expect(inferToolCapability("showComponentExample", "preview component example")).toBe("preview");
    expect(inferToolCapability("get_doc", "fetch doc by path")).toBe("fetch");
    expect(inferToolRisk("update_records", "update docs")).toBe("high");
  });

  it("dedupes descriptors by name", () => {
    const first = createToolDescriptor({
      name: "get_doc",
      source: "mcp",
      description: "old",
    });
    const second = createToolDescriptor({
      name: "get_doc",
      source: "mcp",
      description: "new",
    });

    const merged = mergeToolDescriptors([first], [second]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.description).toBe("new");
  });

  it("applies approval policy for high-risk tools", () => {
    const tools = {
      update_docs: tool({
        description: "update",
        inputSchema: z.object({ path: z.string() }),
        execute: async () => ({ ok: true }),
      }),
    };

    const descriptors = [
      createToolDescriptor({
        name: "update_docs",
        source: "mcp",
        description: "update docs",
        risk: "high",
      }),
    ];

    const applied = applyApprovalPolicies(tools, descriptors);
    expect(applied.update_docs.needsApproval).toBe(true);
  });

  it("serializes catalog for prompt context", () => {
    const catalog = serializeToolCatalog([
      createToolDescriptor({
        name: "get_doc",
        source: "mcp",
        description: "fetch docs",
        capability: "fetch",
      }),
    ]);

    expect(catalog).toContain("get_doc");
    expect(catalog).toContain("capability=fetch");
  });
});
