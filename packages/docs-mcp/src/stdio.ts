#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server.js";
import { initializeTools } from "./tools/index.js";

interface CliOptions {
  baseUrl?: string;
}

function parseCliOptions(argv: string[]): CliOptions {
  let baseUrl: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg) {
      continue;
    }

    if (arg === "--base-url") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --base-url");
      }
      baseUrl = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--base-url=")) {
      const value = arg.slice("--base-url=".length);
      if (!value) {
        throw new Error("Missing value for --base-url");
      }
      baseUrl = value;
    }
  }

  return {
    baseUrl,
  };
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const transport = new StdioServerTransport();
  await initializeTools(server, options);
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
