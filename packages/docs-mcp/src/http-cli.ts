#!/usr/bin/env node
import { startHttpServer } from "./http.js";

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
  const server = await startHttpServer(options);
  const endpoint = `http://${server.host}:${server.port}${server.path}`;
  console.error(`[seed-docs-mcp] Streamable HTTP server running at ${endpoint}`);

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });

  process.on("SIGTERM", () => {
    void shutdown();
  });
}

main().catch((error) => {
  console.error("[seed-docs-mcp] Failed to start HTTP server:", error);
  process.exit(1);
});
