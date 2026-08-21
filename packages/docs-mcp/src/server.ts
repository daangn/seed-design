import { McpServer } from "@modelcontextprotocol/server";
import pkg from "../package.json" with { type: "json" };

export const server = new McpServer(
  {
    name: "seed-design",
    version: pkg.version,
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  },
);
