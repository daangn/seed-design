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
  id: number;
  result?: {
    tools?: MCPToolDefinition[];
    content?: Array<{ type: string; text?: string }>;
  };
  error?: { code: number; message: string };
}

let cachedSessionId: string | null = null;

async function mcpRequest(
  method: string,
  params: Record<string, unknown> = {},
): Promise<JSONRPCResponse> {
  const url = process.env.SEED_DOCS_MCP_SERVER_URL;
  if (!url) throw new Error("SEED_DOCS_MCP_SERVER_URL is not set");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (cachedSessionId) {
    headers["Mcp-Session-Id"] = cachedSessionId;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  // 세션 ID 저장
  const sessionId = response.headers.get("Mcp-Session-Id");
  if (sessionId) {
    cachedSessionId = sessionId;
  }

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * MCP 서버 초기화 (initialize + initialized 핸드셰이크)
 */
async function initializeMCP(): Promise<void> {
  await mcpRequest("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "seed-docs-ai", version: "1.0.0" },
  });

  await mcpRequest("notifications/initialized");
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
