import type { ServerWebSocket } from "bun";

interface JoinMessage {
  type: "join";
  channel: string;
  id?: string;
}

interface ChatMessage {
  type: "message";
  channel: string;
  message: unknown;
}

type WebSocketMessage = JoinMessage | ChatMessage;

const channels = new Map<string, Set<ServerWebSocket<unknown>>>();

function sendJson(ws: ServerWebSocket<unknown>, data: object): void {
  ws.send(JSON.stringify(data));
}

function broadcastToChannel(
  channelName: string,
  message: object,
  excludeWs?: ServerWebSocket<unknown>,
): void {
  const clients = channels.get(channelName);
  if (!clients) return;

  for (const client of clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      sendJson(client, message);
    }
  }
}

function handleJoin(ws: ServerWebSocket<unknown>, data: JoinMessage): void {
  const { channel: channelName, id } = data;

  if (!channelName || typeof channelName !== "string") {
    sendJson(ws, { type: "error", message: "Channel name is required" });
    return;
  }

  if (!channels.has(channelName)) {
    channels.set(channelName, new Set());
  }

  const channelClients = channels.get(channelName);

  if (!channelClients) {
    sendJson(ws, { type: "error", message: "Failed to join channel" });

    return;
  }

  channelClients.add(ws);

  // Notify client they joined successfully
  sendJson(ws, {
    type: "system",
    message: `Joined channel: ${channelName}`,
    channel: channelName,
  });

  // Send connection confirmation with ID if provided
  if (id) {
    console.log("Sending message to client:", id);

    sendJson(ws, {
      type: "system",
      message: { id, result: `Connected to channel: ${channelName}` },
      channel: channelName,
    });
  }

  // Notify other clients in channel
  broadcastToChannel(
    channelName,
    { type: "system", message: "A new user has joined the channel", channel: channelName },
    ws,
  );
}

function handleMessage(ws: ServerWebSocket<unknown>, data: ChatMessage): void {
  const { channel: channelName, message } = data;

  if (!channelName || typeof channelName !== "string") {
    sendJson(ws, { type: "error", message: "Channel name is required" });
    return;
  }

  const channelClients = channels.get(channelName);
  if (!channelClients?.has(ws)) {
    sendJson(ws, { type: "error", message: "You must join the channel first" });
    return;
  }

  // Broadcast to all clients in the channel
  for (const client of channelClients) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("Broadcasting message to client:", message);
      sendJson(client, {
        type: "broadcast",
        message,
        sender: client === ws ? "You" : "User",
        channel: channelName,
      });
    }
  }
}

// WebSocket Event Handlers

function handleConnection(ws: ServerWebSocket<unknown>): void {
  console.log("New client connected");
  sendJson(ws, { type: "system", message: "Please join a channel to start chatting" });
}

function handleWebSocketMessage(ws: ServerWebSocket<unknown>, rawMessage: string | Buffer): void {
  try {
    console.log("Received message from client:", rawMessage);
    const data = JSON.parse(rawMessage as string) as WebSocketMessage;

    switch (data.type) {
      case "join":
        handleJoin(ws, data);
        break;
      case "message":
        handleMessage(ws, data);
        break;
      default:
        console.warn(`Unknown message type: ${(data as { type: string }).type}`);
    }
  } catch (err) {
    console.error("Error handling message:", err);
  }
}

function handleClose(ws: ServerWebSocket<unknown>): void {
  console.log("Client disconnected");

  for (const [channelName, clients] of channels) {
    if (clients.has(ws)) {
      clients.delete(ws);
      broadcastToChannel(channelName, {
        type: "system",
        message: "A user has left the channel",
        channel: channelName,
      });
    }
  }
}

// Server

export async function startWebSocketServer(port: number) {
  const server = Bun.serve({
    port,
    // uncomment this to allow connections in windows wsl
    // hostname: "0.0.0.0",
    fetch(req, server) {
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
      if (server.upgrade(req, { headers: { "Access-Control-Allow-Origin": "*" }, data: {} })) {
        return;
      }

      // Return response for non-WebSocket requests
      return new Response("WebSocket server running", {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    },

    websocket: {
      open: handleConnection,
      message: handleWebSocketMessage,
      close: handleClose,
    },
  });

  console.log(`WebSocket server running on port ${server.port}`);

  return server;
}
