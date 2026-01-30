#!/usr/bin/env node

import { cac } from "cac";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { version } from "../../package.json" with { type: "json" };
import { logger } from "../logger";
import { loadConfig, type McpConfig } from "../config";
import { createFigmaRestClient, type FigmaRestClient } from "../figma-rest-client";
import { createFigmaWebSocketClient, type FigmaWebSocketClient } from "../websocket";
import { registerEditingTools, registerTools } from "../tools";
import { type ToolMode } from "../tools-helpers";
import { registerPrompts } from "../prompts";
import { startWebSocketServer } from "./websocket-server";

// Helper Functions

function getFigmaAccessToken(): string | undefined {
  return process.env["FIGMA_PERSONAL_ACCESS_TOKEN"]?.trim();
}

function createFigmaClient(
  serverUrl: string | undefined,
  mode: ToolMode,
): FigmaWebSocketClient | null {
  const pat = getFigmaAccessToken();
  const resolvedUrl = serverUrl ?? "localhost";

  switch (mode) {
    case "rest": {
      if (!pat) {
        logger.warn(
          "REST mode requires FIGMA_PERSONAL_ACCESS_TOKEN. Running without Figma client.",
        );
      } else {
        logger.info("REST mode enabled. Using REST API only.");
      }

      return null;
    }

    case "websocket": {
      logger.info(`WebSocket mode enabled. Client connecting to: ${resolvedUrl}`);

      return createFigmaWebSocketClient(resolvedUrl);
    }

    case "all":
      if (!pat) {
        logger.info(
          `No FIGMA_PERSONAL_ACCESS_TOKEN found. Using WebSocket mode. Client connecting to: ${resolvedUrl}`,
        );

        return createFigmaWebSocketClient(resolvedUrl);
      }

      logger.info("FIGMA_PERSONAL_ACCESS_TOKEN found. REST API mode enabled.");

      if (serverUrl) {
        logger.info(`WebSocket server URL provided: ${serverUrl}. Attempting hybrid mode.`);

        return createFigmaWebSocketClient(serverUrl);
      }

      logger.info("No WebSocket server URL. Running in REST API only mode.");

      return null;
  }
}

function createRestClient(mode: ToolMode): FigmaRestClient | null {
  if (mode === "websocket") {
    return null;
  }

  const pat = getFigmaAccessToken();
  if (!pat) {
    if (mode === "rest") {
      logger.warn(
        "REST mode requires FIGMA_PERSONAL_ACCESS_TOKEN. REST API will not be available.",
      );
    }

    return null;
  }

  logger.info("Initializing REST API client with PAT from environment");

  return createFigmaRestClient(pat);
}

async function loadMcpConfig(configPath?: string): Promise<McpConfig | null> {
  if (!configPath) return null;

  const config = await loadConfig(configPath);
  if (!config) return null;

  logger.info(`Loaded configuration from: ${configPath}`);

  if (config.extend?.componentHandlers?.length) {
    logger.info(`Found ${config.extend.componentHandlers.length} custom component handlers`);
  }

  return config;
}

function connectFigmaClient(figmaClient: FigmaWebSocketClient | null): void {
  if (!figmaClient) return;

  try {
    figmaClient.connectToFigma();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(`Could not connect to Figma initially: ${message}`);

    if (getFigmaAccessToken()) {
      logger.info("REST API fallback available via FIGMA_PERSONAL_ACCESS_TOKEN");
    } else {
      logger.warn("Will try to connect when the first command is sent");
    }
  }
}

// MCP Server

interface McpServerOptions {
  serverUrl?: string;
  experimental?: boolean;
  configPath?: string;
  mode?: ToolMode;
}

async function startMcpServer(options: McpServerOptions = {}): Promise<void> {
  const { serverUrl, experimental, configPath, mode = "all" } = options;

  const config = await loadMcpConfig(configPath);
  const figmaClient = createFigmaClient(serverUrl, mode);
  const restClient = createRestClient(mode);

  const server = new McpServer({
    name: "SEED Design MCP",
    version,
  });

  registerTools(server, figmaClient, restClient, config, mode);
  registerPrompts(server);

  if (experimental) {
    if (mode === "rest") {
      logger.warn("Experimental editing tools not available in REST mode. Skipping.");
    } else if (figmaClient) {
      registerEditingTools(server, figmaClient);
    } else {
      logger.warn("Experimental editing tools require WebSocket connection. Skipping.");
    }
  }

  connectFigmaClient(figmaClient);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info(`FigmaMCP server running on stdio (mode: ${mode})`);
}

// CLI

const cli = cac("@seed-design/mcp");

cli
  .command("", "Start the MCP server")
  .option(
    "--server <server>",
    "WebSocket server URL. If not provided and FIGMA_PERSONAL_ACCESS_TOKEN is set, REST API mode will be used.",
  )
  .option("--experimental", "Enable experimental features", { default: false })
  .option("--config <config>", "Path to configuration file (.js, .mjs, .ts, .mts)")
  .option(
    "--mode <mode>",
    "Tool registration mode: 'rest' (REST API tools only), 'websocket' (WebSocket tools only), or 'all' (default)",
  )
  .action(async (options) => {
    const mode = options.mode as ToolMode | undefined;
    if (mode && !["rest", "websocket", "all"].includes(mode)) {
      console.error(`Invalid mode: ${mode}. Use 'rest', 'websocket', or 'all'.`);
      process.exit(1);
    }

    await startMcpServer({
      serverUrl: options.server,
      experimental: options.experimental,
      configPath: options.config,
      mode,
    });
  });

cli
  .command("socket", "Start the WebSocket server")
  .option("--port <port>", "Port number", { default: 3055 })
  .action(async (options) => {
    await startWebSocketServer(options.port);
  });

cli.help();
cli.version(version);
cli.parse();
