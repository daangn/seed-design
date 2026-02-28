import { createMCPClient, type ListToolsResult } from "@ai-sdk/mcp";
import { type Tool, tool } from "ai";
import { z } from "zod";
import {
  applyApprovalPolicies,
  createToolDescriptor,
  type ToolDescriptor,
} from "./tool-registry";

interface MCPToolDefinition {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    description?: string;
    enum?: string[];
    items?: unknown;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

interface JSONRPCResponse {
  jsonrpc: string;
  id: number | string | null;
  result?: {
    tools?: MCPToolDefinition[];
    content?: Array<{ type: string; text?: string }>;
  };
  error?: { code: number; message: string };
}

interface JSONRPCRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
  id?: number;
}

const MCP_PROTOCOL_VERSION = "2025-03-26";
const MCP_REQUEST_TIMEOUT_MS = 30_000;
const TEMPORARILY_DISABLED_MCP_TOOLS = new Set(["get_full_docs"]);

export interface MCPToolBundle {
  tools: Record<string, Tool>;
  descriptors: ToolDescriptor[];
  close: () => Promise<void>;
  provider: "sdk-http" | "legacy-http" | "none";
}

function buildDescriptorsFromToolDefinitions(
  tools: Array<{
    name: string;
    description?: string;
  }>,
): ToolDescriptor[] {
  return tools.map((toolInfo) =>
    createToolDescriptor({
      name: toolInfo.name,
      description: toolInfo.description ?? toolInfo.name,
      source: "mcp",
    }),
  );
}

function isMCPToolEnabled(toolName: string): boolean {
  return !TEMPORARILY_DISABLED_MCP_TOOLS.has(toolName);
}

async function getMCPToolBundleWithSDK(mcpUrl: string): Promise<MCPToolBundle> {
  const client = await createMCPClient({
    transport: {
      type: "http",
      url: mcpUrl,
    },
    name: "seed-docs-ai",
    version: "1.0.0",
  });

  const definitions = (await client.listTools()) as ListToolsResult;
  const enabledDefinitions: ListToolsResult = {
    ...definitions,
    tools: definitions.tools.filter((toolInfo) => isMCPToolEnabled(toolInfo.name)),
  };
  const rawTools = client.toolsFromDefinitions(enabledDefinitions) as Record<string, Tool>;
  const descriptors = buildDescriptorsFromToolDefinitions(enabledDefinitions.tools);

  return {
    tools: applyApprovalPolicies(rawTools, descriptors),
    descriptors,
    close: async () => {
      await client.close();
    },
    provider: "sdk-http",
  };
}

let cachedSessionId: string | null = null;
let isInitialized = false;
let initializingPromise: Promise<void> | null = null;

function parseSSEJSONResponse(rawBody: string, method: string): JSONRPCResponse {
  const events = rawBody.split(/\r?\n\r?\n/);

  for (const eventBlock of events) {
    const dataLines = eventBlock
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .filter(Boolean);

    if (dataLines.length === 0) {
      continue;
    }

    const payload = dataLines.join("\n").trim();
    if (!payload || payload === "[DONE]") {
      continue;
    }

    try {
      return JSON.parse(payload) as JSONRPCResponse;
    } catch {
      // ignore non-JSON SSE frames and continue
    }
  }

  throw new Error(`Invalid MCP SSE response for "${method}"`);
}

function parseMCPResponseBody(
  rawBody: string,
  method: string,
  contentType: string | null,
): JSONRPCResponse {
  if (!rawBody.trim()) {
    return { jsonrpc: "2.0", id: null };
  }

  if (contentType?.includes("text/event-stream") || rawBody.trimStart().startsWith("event:")) {
    return parseSSEJSONResponse(rawBody, method);
  }

  try {
    return JSON.parse(rawBody) as JSONRPCResponse;
  } catch (error) {
    throw new Error(`Invalid MCP JSON response for "${method}": ${(error as Error).message}`);
  }
}

async function mcpRequest(
  method: string,
  params: Record<string, unknown> = {},
  options: { notification?: boolean } = {},
): Promise<JSONRPCResponse> {
  const url = process.env.SEED_DOCS_MCP_SERVER_URL;
  if (!url) throw new Error("SEED_DOCS_MCP_SERVER_URL is not set");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
  };

  if (cachedSessionId) {
    headers["Mcp-Session-Id"] = cachedSessionId;
  }

  const body: JSONRPCRequest = {
    jsonrpc: "2.0",
    method,
    params,
  };

  if (!options.notification) {
    body.id = Date.now();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MCP_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`MCP request timed out after ${MCP_REQUEST_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const sessionId = response.headers.get("Mcp-Session-Id");
  if (sessionId) {
    cachedSessionId = sessionId;
  }

  const rawBody = await response.text();
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    const details = rawBody.trim();
    const suffix = details ? ` - ${details.slice(0, 300)}` : "";
    throw new Error(`MCP request failed: ${response.status} ${response.statusText}${suffix}`);
  }

  if (options.notification || !rawBody.trim()) {
    return { jsonrpc: "2.0", id: null };
  }

  return parseMCPResponseBody(rawBody, method, contentType);
}

async function mcpNotification(
  method: string,
  params: Record<string, unknown> = {},
): Promise<void> {
  await mcpRequest(method, params, { notification: true });
}

async function initializeMCP(): Promise<void> {
  if (isInitialized) return;
  if (initializingPromise) return initializingPromise;

  initializingPromise = (async () => {
    const initResponse = await mcpRequest("initialize", {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "seed-docs-ai", version: "1.0.0" },
    });

    if (initResponse.error) {
      throw new Error(`MCP initialize failed: ${initResponse.error.message}`);
    }

    await mcpNotification("notifications/initialized");
    isInitialized = true;
  })().finally(() => {
    initializingPromise = null;
  });

  return initializingPromise;
}

function jsonSchemaToZod(schema: MCPToolDefinition["inputSchema"]): z.ZodType {
  if (!schema) {
    return z.object({});
  }

  if (schema.type === "object" && schema.properties) {
    return jsonObjectSchemaToZod(schema.properties, schema.required ?? []);
  }

  return jsonValueSchemaToZod(schema);
}

function jsonObjectSchemaToZod(
  properties: Record<string, unknown>,
  requiredFields: string[],
): z.ZodObject<Record<string, z.ZodType>> {
  const shape: Record<string, z.ZodType> = {};
  const required = new Set(requiredFields);

  for (const [key, prop] of Object.entries(properties)) {
    const schema = asSchema(prop);
    let field = jsonValueSchemaToZod(schema);
    if (schema.description) {
      field = field.describe(schema.description);
    }

    shape[key] = required.has(key) ? field : field.optional();
  }

  return z.object(shape);
}

function asSchema(schema: unknown): {
  type?: string;
  description?: string;
  enum?: string[];
  items?: unknown;
  properties?: Record<string, unknown>;
  required?: string[];
} {
  if (!schema || typeof schema !== "object") {
    return {};
  }

  const safeSchema = schema as {
    type?: unknown;
    description?: unknown;
    enum?: unknown;
    items?: unknown;
    properties?: unknown;
    required?: unknown;
  };

  return {
    type: typeof safeSchema.type === "string" ? safeSchema.type : undefined,
    description: typeof safeSchema.description === "string" ? safeSchema.description : undefined,
    enum:
      Array.isArray(safeSchema.enum) && safeSchema.enum.every((value) => typeof value === "string")
        ? (safeSchema.enum as string[])
        : undefined,
    items: safeSchema.items,
    properties:
      safeSchema.properties && typeof safeSchema.properties === "object"
        ? (safeSchema.properties as Record<string, unknown>)
        : undefined,
    required:
      Array.isArray(safeSchema.required) &&
      safeSchema.required.every((value) => typeof value === "string")
        ? (safeSchema.required as string[])
        : undefined,
  };
}

function toEnum(values: string[] | undefined): z.ZodEnum<[string, ...string[]]> | null {
  if (!values || values.length === 0) {
    return null;
  }

  return z.enum(values as [string, ...string[]]);
}

function jsonValueSchemaToZod(schema: unknown): z.ZodType {
  const safeSchema = asSchema(schema);
  const enumSchema = toEnum(safeSchema.enum);
  if (enumSchema) {
    return enumSchema;
  }

  switch (safeSchema.type) {
    case "number":
    case "integer":
      return z.number();
    case "boolean":
      return z.boolean();
    case "array": {
      const itemSchema = safeSchema.items ? jsonValueSchemaToZod(safeSchema.items) : z.unknown();
      return z.array(itemSchema);
    }
    case "object":
      if (!safeSchema.properties) {
        return z.object({});
      }
      return jsonObjectSchemaToZod(safeSchema.properties, safeSchema.required ?? []);
    case "null":
      return z.null();
    case "string":
    default:
      return z.string();
  }
}

async function getMCPToolBundleLegacy(): Promise<MCPToolBundle> {
  await initializeMCP();

  const response = await mcpRequest("tools/list");
  const mcpTools = (response.result?.tools ?? []).filter((toolInfo) =>
    isMCPToolEnabled(toolInfo.name),
  );

  const tools: Record<string, Tool> = {};

  for (const mcpTool of mcpTools) {
    const zodSchema = jsonSchemaToZod(mcpTool.inputSchema);

    tools[mcpTool.name] = tool({
      description: mcpTool.description ?? mcpTool.name,
      inputSchema: zodSchema as z.ZodObject<Record<string, z.ZodType>>,
      execute: async (args: Record<string, unknown>) => {
        const result = await mcpRequest("tools/call", {
          name: mcpTool.name,
          arguments: args,
        });

        if (result.error) {
          return { error: result.error.message };
        }

        const content = result.result?.content ?? [];
        const textParts = content.filter((c) => c.type === "text" && c.text).map((c) => c.text);

        return { content: textParts.join("\n") };
      },
    });
  }

  const descriptors = buildDescriptorsFromToolDefinitions(
    mcpTools.map((toolInfo) => ({
      name: toolInfo.name,
      description: toolInfo.description,
    })),
  );

  return {
    tools: applyApprovalPolicies(tools, descriptors),
    descriptors,
    close: async () => {},
    provider: "legacy-http",
  };
}

export async function getMCPToolBundle(options?: {
  preferLegacy?: boolean;
  enableLegacyFallback?: boolean;
}): Promise<MCPToolBundle> {
  const mcpUrl = process.env.SEED_DOCS_MCP_SERVER_URL;
  if (!mcpUrl) {
    return {
      tools: {},
      descriptors: [],
      close: async () => {},
      provider: "none",
    };
  }

  const preferLegacy = options?.preferLegacy === true;
  const enableLegacyFallback = options?.enableLegacyFallback !== false;

  if (preferLegacy) {
    try {
      return await getMCPToolBundleLegacy();
    } catch (error) {
      console.error("Failed to load legacy MCP tools:", error);
      return {
        tools: {},
        descriptors: [],
        close: async () => {},
        provider: "none",
      };
    }
  }

  try {
    return await getMCPToolBundleWithSDK(mcpUrl);
  } catch (error) {
    console.error("Failed to load MCP tools with SDK client:", error);
  }

  if (enableLegacyFallback) {
    try {
      return await getMCPToolBundleLegacy();
    } catch (error) {
      console.error("Failed to load MCP tools with legacy fallback:", error);
    }
  }

  return {
    tools: {},
    descriptors: [],
    close: async () => {},
    provider: "none",
  };
}

export async function getMCPTools(): Promise<Record<string, Tool>> {
  const bundle = await getMCPToolBundle();
  return bundle.tools;
}
