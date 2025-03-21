#!/usr/bin/env node

import { startServer } from "../index";
import { ConsoleLogger } from "../logger";

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  try {
    // Set environment to indicate CLI mode
    process.env["NODE_ENV"] = "cli";

    // Start server
    await startServer();
  } catch (error) {
    handleStartupError(error);
    process.exit(1);
  }
}

/**
 * Handles and logs startup errors
 */
function handleStartupError(error: unknown): void {
  if (error instanceof Error) {
    ConsoleLogger.error("Failed to start server:", error.message);
  } else {
    ConsoleLogger.error("Failed to start server with unknown error:", error);
  }
}

// Run the application
main().catch(handleStartupError);
