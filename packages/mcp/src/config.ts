import type { ComponentTransformer } from "@seed-design/figma";
import fs from "node:fs";
import path from "node:path";
import { logger } from "./logger";

// Define config type
export interface McpConfig {
  extend?: {
    componentTransformers?: ComponentTransformer[];
  };
}

// Config loader
export async function loadConfig(configPath: string) {
  try {
    const resolvedPath = path.resolve(process.cwd(), configPath);

    if (!fs.existsSync(resolvedPath)) {
      logger.error(`Config file not found: ${resolvedPath}`);
      return null;
    }

    // Handle different file types
    if (resolvedPath.endsWith(".json")) {
      const content = fs.readFileSync(resolvedPath, "utf-8");
      return JSON.parse(content);
    }

    if (
      resolvedPath.endsWith(".js") ||
      resolvedPath.endsWith(".mjs") ||
      resolvedPath.endsWith(".ts") ||
      resolvedPath.endsWith(".mts")
    ) {
      // For JS/MJS/TS/MTS files, we can dynamically import with Bun
      // Bun has built-in TypeScript support without requiring transpilation
      const config = await import(resolvedPath);
      return config.default || config;
    }

    logger.error(`Unsupported config file format: ${resolvedPath}`);
    return null;
  } catch (error) {
    logger.error(
      `Failed to load config file: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}
