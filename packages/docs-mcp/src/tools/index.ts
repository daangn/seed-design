import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerPrompts } from "../prompts.js";
import { registerResources } from "../resources.js";
import { setDocsBaseUrl } from "../runtime-config.js";
import { registerDocsTools } from "./docs.js";
import { registerRootageTools } from "./get-rootage.js";
import { registerIconTools } from "./icon-tools.js";

const initializedServers = new WeakSet<McpServer>();

export interface InitializeToolsOptions {
  baseUrl?: string;
}

export async function initializeTools(
  server: McpServer,
  options: InitializeToolsOptions = {},
): Promise<void> {
  if (initializedServers.has(server)) {
    return;
  }

  setDocsBaseUrl(options.baseUrl);

  registerDocsTools(server);
  registerRootageTools(server);
  registerIconTools(server);
  registerResources(server);
  registerPrompts(server);

  initializedServers.add(server);
}
