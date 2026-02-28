import { type Tool, tool } from "ai";
import { z } from "zod";

/**
 * MCP Streamable HTTP 클라이언트
 *
 * SEED_DOCS_MCP_SERVER_URL에 JSON-RPC 요청을 보내
 * MCP 도구를 AI SDK tool로 변환한다.
 */

interface MCPToolDefinition {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
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

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  // 세션 ID 저장
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

  // notification 응답 혹은 빈 본문(202/204) 처리
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

/**
 * MCP 서버 초기화 (initialize + initialized 핸드셰이크)
 */
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

/**
 * MCP JSON Schema를 Zod 스키마로 변환
 */
function jsonSchemaToZod(schema: MCPToolDefinition["inputSchema"]): z.ZodType {
  if (!schema?.properties) {
    return z.object({});
  }

  const shape: Record<string, z.ZodType> = {};
  const required = new Set(schema.required ?? []);

  for (const [key, prop] of Object.entries(schema.properties)) {
    const p = prop as { type?: string; description?: string; enum?: string[] };
    let field: z.ZodType;

    if (p.enum) {
      field = z.enum(p.enum as [string, ...string[]]);
    } else {
      switch (p.type) {
        case "number":
        case "integer":
          field = z.number();
          break;
        case "boolean":
          field = z.boolean();
          break;
        case "array":
          field = z.array(z.string());
          break;
        default:
          field = z.string();
      }
    }

    if (p.description) {
      field = field.describe(p.description);
    }

    shape[key] = required.has(key) ? field : field.optional();
  }

  return z.object(shape);
}

/**
 * MCP 서버에서 도구 목록을 가져와 AI SDK tool로 변환
 */
export async function getMCPTools(): Promise<Record<string, Tool>> {
  const mcpUrl = process.env.SEED_DOCS_MCP_SERVER_URL;
  if (!mcpUrl) return {};

  try {
    await initializeMCP();

    const response = await mcpRequest("tools/list");
    const mcpTools = response.result?.tools ?? [];

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

    return tools;
  } catch (error) {
    console.error("Failed to load MCP tools:", error);
    return {};
  }
}
