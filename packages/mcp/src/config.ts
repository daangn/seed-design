import type { CreatePipelineConfig } from "@seed-design/figma/codegen/targets/react";
import { logger } from "./logger";
import { cosmiconfig } from "cosmiconfig";

// Define config type
export interface McpConfig {
  extend?: CreatePipelineConfig["extend"];
}

// Config loader
export async function loadConfig(configPath: string): Promise<McpConfig | null> {
  const explorer = cosmiconfig("mcp");

  const searchResult = await explorer.load(configPath);

  if (!searchResult) {
    logger.error(`Config file not found: ${configPath}`);

    return null;
  }

  return searchResult.config;
}
