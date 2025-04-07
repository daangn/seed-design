#!/usr/bin/env node

import SeedMigrationServer from "./server.js";

async function main() {
  try {
    console.error("Starting SEED Design Foundation Migration MCP Server...");
    const server = new SeedMigrationServer();
    await server.run();
  } catch (error) {
    console.error("Error starting MCP server:", error);
    process.exit(1);
  }
}

main();
