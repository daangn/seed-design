import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const server = new McpServer({
  name: "seed-design",
  version: "1.0.0",
  capabilities: {
    prompts: {},
    resources: {},
    tools: {},
  },
});
