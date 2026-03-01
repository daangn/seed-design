import { describe, expect, it } from "bun:test";
import { tool } from "ai";
import { z } from "zod";
import {
  applyApprovalPolicies,
  createToolDescriptor,
  filterToolsForQuery,
  inferToolCapability,
  inferToolRisk,
  isIconIntentQuery,
  isIconToolName,
  mergeToolDescriptors,
  serializeToolCatalog,
} from "./tool-registry";

describe("tool-registry", () => {
  it("infers capability and risk from tool metadata", () => {
    expect(inferToolCapability("showComponentExample", "preview component example")).toBe("preview");
    expect(inferToolCapability("read_doc", "fetch doc by path")).toBe("fetch");
    expect(inferToolRisk("update_records", "update docs")).toBe("high");
  });

  it("dedupes descriptors by name", () => {
    const first = createToolDescriptor({
      name: "read_doc",
      source: "mcp",
      description: "old",
    });
    const second = createToolDescriptor({
      name: "read_doc",
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
        name: "read_doc",
        source: "mcp",
        description: "fetch docs",
        capability: "fetch",
      }),
    ]);

    expect(catalog).toContain("read_doc");
    expect(catalog).toContain("capability=fetch");
  });

  it("detects icon tools and icon intent query", () => {
    expect(isIconToolName("search_icons")).toBe(true);
    expect(isIconToolName("read_doc")).toBe(false);
    expect(isIconIntentQuery("아이콘 추천해줘")).toBe(true);
    expect(isIconIntentQuery("ai integration 문서 찾아줘")).toBe(false);
  });

  it("filters icon tools out for non-icon queries", () => {
    const tools = {
      search_icons: { execute: async () => ({}) },
      read_doc: { execute: async () => ({}) },
    };
    const descriptors = [
      createToolDescriptor({
        name: "search_icons",
        source: "mcp",
        description: "search icons",
      }),
      createToolDescriptor({
        name: "read_doc",
        source: "mcp",
        description: "read docs",
      }),
    ];

    const filtered = filterToolsForQuery(tools, descriptors, "ai integration 관련 문서 찾아줘");

    expect(Object.keys(filtered.tools)).toEqual(["read_doc"]);
    expect(filtered.descriptors.map((descriptor) => descriptor.name)).toEqual(["read_doc"]);
  });
});
