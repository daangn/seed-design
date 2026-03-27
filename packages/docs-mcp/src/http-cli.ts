#!/usr/bin/env node
import { parseCliOptions } from "./cli-utils.js";
import { startHttpServer } from "./http.js";

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const server = await startHttpServer(options);
  const endpoint = `http://${server.host}:${server.port}${server.path}`;
  console.error(`[seed-docs-mcp] Streamable HTTP server running at ${endpoint}`);

  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      console.error("[seed-docs-mcp] Failed to shutdown HTTP server:", error);
      process.exit(1);
    }
  };

  process.once("SIGINT", () => {
    void shutdown();
  });

  process.once("SIGTERM", () => {
    void shutdown();
  });
}

main().catch((error) => {
  console.error("[seed-docs-mcp] Failed to start HTTP server:", error);
  process.exit(1);
});
