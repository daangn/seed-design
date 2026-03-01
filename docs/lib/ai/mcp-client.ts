import { createMCPClient, type ListToolsResult } from "@ai-sdk/mcp";
import { type Tool } from "ai";
import {
  applyApprovalPolicies,
  createToolDescriptor,
  type ToolDescriptor,
} from "./tool-registry";

const TEMPORARILY_DISABLED_MCP_TOOLS = new Set<string>();

export interface MCPToolBundle {
  tools: Record<string, Tool>;
  descriptors: ToolDescriptor[];
  close: () => Promise<void>;
  provider: "sdk-http" | "none";
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

function createEmptyMCPToolBundle(): MCPToolBundle {
  return {
    tools: {},
    descriptors: [],
    close: async () => {},
    provider: "none",
  };
}

export async function getMCPToolBundle(): Promise<MCPToolBundle> {
  const mcpUrl = process.env.SEED_DOCS_MCP_SERVER_URL;
  if (!mcpUrl) {
    return createEmptyMCPToolBundle();
  }

  let client:
    | Awaited<ReturnType<typeof createMCPClient>>
    | undefined;

  try {
    client = await createMCPClient({
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
        await client?.close();
      },
      provider: "sdk-http",
    };
  } catch (error) {
    console.error("Failed to load MCP tools with SDK client:", error);
    if (client) {
      try {
        await client.close();
      } catch {
        // ignore close errors
      }
    }
    return createEmptyMCPToolBundle();
  }
}
