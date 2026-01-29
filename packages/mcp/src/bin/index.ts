#!/usr/bin/env node

import { cac } from "cac";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { version } from "../../package.json" with { type: "json" };
import { logger } from "../logger";
import { loadConfig, type McpConfig } from "../config";
import { createFigmaWebSocketClient, type FigmaWebSocketClient } from "../websocket";
import { registerEditingTools, registerTools } from "../tools";
import { registerPrompts } from "../prompts";
import { startWebSocketServer } from "./websocket-server";

// Helper Functions

function getFigmaAccessToken(): string | undefined {
  return process.env["FIGMA_PERSONAL_ACCESS_TOKEN"];
}

function createFigmaClient(serverUrl?: string): FigmaWebSocketClient | null {
  const pat = getFigmaAccessToken();

  if (!pat) {
    const resolvedUrl = serverUrl ?? "localhost";
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
}

async function startMcpServer(options: McpServerOptions = {}): Promise<void> {
  const { serverUrl, experimental, configPath } = options;

  const config = await loadMcpConfig(configPath);
  const figmaClient = createFigmaClient(serverUrl);

  const server = new McpServer({
    name: "SEED Design MCP",
    version,
  });

  registerTools(server, figmaClient, config);
  registerPrompts(server);

  if (experimental) {
    if (figmaClient) {
      registerEditingTools(server, figmaClient);
    } else {
      logger.warn("Experimental editing tools require WebSocket connection. Skipping.");
    }
  }

  connectFigmaClient(figmaClient);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info("FigmaMCP server running on stdio");
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
  .action(async (options) => {
    await startMcpServer({
      serverUrl: options.server,
      experimental: options.experimental,
      configPath: options.config,
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
