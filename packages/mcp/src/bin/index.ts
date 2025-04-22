#!/usr/bin/env bun

import { cac } from "cac";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "../logger";
import { createFigmaWebSocketClient } from "../websocket";
import { registerEditingTools, registerTools } from "../tools";
import { registerPrompts } from "../prompts";
import { version } from "../../package.json" assert { type: "json" };
import type { Server, ServerWebSocket } from "bun";

// Initialize CLI
const cli = cac("@seed-design/mcp");

// Store WebSocket clients by channel
const channels = new Map<string, Set<ServerWebSocket<any>>>();

function handleWebSocketConnection(ws: ServerWebSocket<any>) {
  console.log("New client connected");

  ws.send(
    JSON.stringify({
      type: "system",
      message: "Please join a channel to start chatting",
    }),
  );

  ws.close = () => {
    console.log("Client disconnected");
    channels.forEach((clients, channelName) => {
      if (clients.has(ws)) {
        clients.delete(ws);
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "system",
                message: "A user has left the channel",
                channel: channelName,
              }),
            );
          }
        });
      }
    });
  };
}

async function startWebSocketServer(port: number) {
  const server = Bun.serve({
    port,
    // uncomment this to allow connections in windows wsl
    // hostname: "0.0.0.0",
    fetch(req: Request, server: Server) {
      // Handle CORS preflight
      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }

      // Handle WebSocket upgrade
      const success = server.upgrade(req, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (success) return;

      // Return response for non-WebSocket requests
      return new Response("WebSocket server running", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    },
    websocket: {
      open: handleWebSocketConnection,
      message(ws: ServerWebSocket<any>, message: string | Buffer) {
        try {
          console.log("Received message from client:", message);
          const data = JSON.parse(message as string);

          if (data.type === "join") {
            const channelName = data.channel;
            if (!channelName || typeof channelName !== "string") {
              ws.send(JSON.stringify({ type: "error", message: "Channel name is required" }));
              return;
            }

            // Create channel if it doesn't exist
            if (!channels.has(channelName)) {
              channels.set(channelName, new Set());
            }

            // Add client to channel
            const channelClients = channels.get(channelName)!;
            channelClients.add(ws);

            // Notify client they joined successfully
            ws.send(
              JSON.stringify({
                type: "system",
                message: `Joined channel: ${channelName}`,
                channel: channelName,
              }),
            );

            console.log("Sending message to client:", data.id);

            ws.send(
              JSON.stringify({
                type: "system",
                message: {
                  id: data.id,
                  result: "Connected to channel: " + channelName,
                },
                channel: channelName,
              }),
            );

            // Notify other clients in channel
            channelClients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "system",
                    message: "A new user has joined the channel",
                    channel: channelName,
                  }),
                );
              }
            });
            return;
          }

          // Handle regular messages
          if (data.type === "message") {
            const channelName = data.channel;
            if (!channelName || typeof channelName !== "string") {
              ws.send(JSON.stringify({ type: "error", message: "Channel name is required" }));
              return;
            }

            const channelClients = channels.get(channelName);
            if (!channelClients || !channelClients.has(ws)) {
              ws.send(
                JSON.stringify({ type: "error", message: "You must join the channel first" }),
              );
              return;
            }

            // Broadcast to all clients in the channel
            channelClients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                console.log("Broadcasting message to client:", data.message);
                client.send(
                  JSON.stringify({
                    type: "broadcast",
                    message: data.message,
                    sender: client === ws ? "You" : "User",
                    channel: channelName,
                  }),
                );
              }
            });
          }
        } catch (err) {
          console.error("Error handling message:", err);
        }
      },
      close(ws: ServerWebSocket<any>) {
        // Remove client from their channel
        channels.forEach((clients) => {
          clients.delete(ws);
        });
      },
    },
  });

  console.log(`WebSocket server running on port ${server.port}`);
  return server;
}

async function startMcpServer(serverUrl: string, experimental: boolean) {
  const figmaClient = createFigmaWebSocketClient(serverUrl);
  const server = new McpServer({
    name: "SEED Design MCP",
    version,
  });

  registerTools(server, figmaClient);
  if (experimental) {
    registerEditingTools(server, figmaClient);
  }
  registerPrompts(server);

  try {
    figmaClient.connectToFigma();
  } catch (error) {
    logger.warn(
      `Could not connect to Figma initially: ${error instanceof Error ? error.message : String(error)}`,
    );
    logger.warn("Will try to connect when the first command is sent");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("FigmaMCP server running on stdio");
}

// Define CLI commands
cli
  .command("", "Start the MCP server")
  .option("--server <server>", "Server URL", { default: "localhost" })
  .option("--experimental", "Enable experimental features", { default: false })
  .action(async (options) => {
    await startMcpServer(options.server, options.experimental);
  });

cli
  .command("socket", "Start the WebSocket server")
  .option("--port <port>", "Port number", { default: 3055 })
  .action(async (options) => {
    await startWebSocketServer(options.port);
  });

cli.help();
cli.version(version);

// Parse CLI args
cli.parse();
