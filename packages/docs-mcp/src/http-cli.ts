#!/usr/bin/env node
import { startHttpServer } from "./http.js";

async function main() {
  const server = await startHttpServer();
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
