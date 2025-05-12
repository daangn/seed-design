import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { logger } from "./logger";
import type { CommandProgressUpdate, FigmaCommand, FigmaResponse } from "./types";

export interface FigmaWebSocketClient {
  connectToFigma: (port?: number) => void;
  joinChannel: (channelName: string) => Promise<void>;
  sendCommandToFigma: (
    command: FigmaCommand,
    params?: unknown,
    timeoutMs?: number,
  ) => Promise<unknown>;
}

// Define a more specific type with an index signature to allow any property access
interface ProgressMessage {
  message: FigmaResponse | any;
  type?: string;
  id?: string;
  [key: string]: any; // Allow any other properties
}

export function createFigmaWebSocketClient(serverUrl: string) {
  const WS_URL = serverUrl === "localhost" ? `ws://${serverUrl}` : `wss://${serverUrl}`;

  // Track which channel each client is in
  let currentChannel: string | null = null;

  // WebSocket connection and request tracking
  let ws: WebSocket | null = null;
  const pendingRequests = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason: unknown) => void;
      timeout: ReturnType<typeof setTimeout>;
      lastActivity: number; // Add timestamp for last activity
    }
  >();

  // Update the connectToFigma function
  function connectToFigma(port = 3055) {
    // If already connected, do nothing
    if (ws && ws.readyState === WebSocket.OPEN) {
      logger.info("Already connected to Figma");
      return;
    }

    const wsUrl = serverUrl === "localhost" ? `${WS_URL}:${port}` : WS_URL;
    logger.info(`Connecting to Figma socket server at ${wsUrl}...`);
    ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      logger.info("Connected to Figma socket server");
      // Reset channel on new connection
      joinChannel("local-default");
    });

    ws.on("message", (data: any) => {
      try {
        const json = JSON.parse(data) as ProgressMessage;

        // Handle progress updates
        if (json.type === "progress_update") {
          const progressData = json.message.data as CommandProgressUpdate;
          const requestId = json.id || "";

          if (requestId && pendingRequests.has(requestId)) {
            const request = pendingRequests.get(requestId)!;

            // Update last activity timestamp
            request.lastActivity = Date.now();

            // Reset the timeout to prevent timeouts during long-running operations
            clearTimeout(request.timeout);

            // Create a new timeout
            request.timeout = setTimeout(() => {
              if (pendingRequests.has(requestId)) {
                logger.error(`Request ${requestId} timed out after extended period of inactivity`);
                pendingRequests.delete(requestId);
                request.reject(new Error("Request to Figma timed out"));
              }
            }, 60000); // 60 second timeout for inactivity

            // Log progress
            logger.info(
              `Progress update for ${progressData.commandType}: ${progressData.progress}% - ${progressData.message}`,
            );

            // For completed updates, we could resolve the request early if desired
            if (progressData.status === "completed" && progressData.progress === 100) {
              // Optionally resolve early with partial data
              // request.resolve(progressData.payload);
              // pendingRequests.delete(requestId);

              // Instead, just log the completion, wait for final result from Figma
              logger.info(
                `Operation ${progressData.commandType} completed, waiting for final result`,
              );
            }
          }
          return;
        }

        // Handle regular responses
        const myResponse = json.message;
        logger.debug(`Received message: ${JSON.stringify(myResponse)}`);
        logger.log("myResponse" + JSON.stringify(myResponse));

        // Handle response to a request
        if (
          myResponse.id &&
          pendingRequests.has(myResponse.id) &&
          (myResponse.result || myResponse.error)
        ) {
          const request = pendingRequests.get(myResponse.id)!;
          clearTimeout(request.timeout);

          if (myResponse.error) {
            logger.error(`Error from Figma: ${myResponse.error}`);
            request.reject(new Error(myResponse.error));
          } else {
            if (myResponse.result) {
              request.resolve(myResponse.result);
            }
          }

          pendingRequests.delete(myResponse.id);
        } else {
          // Handle broadcast messages or events not associated with a request ID
          logger.info(`Received broadcast message: ${JSON.stringify(myResponse)}`);
        }
      } catch (error) {
        logger.error(
          `Error parsing message: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });

    ws.on("error", (error) => {
      logger.error(`Socket error: ${error}`);
    });

    ws.on("close", () => {
      logger.info("Disconnected from Figma socket server");
      ws = null;

      // Reject all pending requests
      for (const [id, request] of pendingRequests.entries()) {
        clearTimeout(request.timeout);
        request.reject(new Error("Connection closed"));
        pendingRequests.delete(id);
      }

      // Attempt to reconnect
      logger.info("Attempting to reconnect in 2 seconds...");
      setTimeout(() => connectToFigma(port), 2000);
    });
  }

  // Function to join a channel
  async function joinChannel(channelName: string): Promise<void> {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error("Not connected to Figma");
    }

    try {
      await sendCommandToFigma("join", { channel: channelName });
      currentChannel = channelName;
      logger.info(`Joined channel: ${channelName}`);
    } catch (error) {
      logger.error(
        `Failed to join channel: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  // Function to send commands to Figma
  function sendCommandToFigma(
    command: FigmaCommand,
    params: unknown = {},
    timeoutMs = 30000,
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      // If not connected, try to connect first
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectToFigma();
        reject(new Error("Not connected to Figma. Attempting to connect..."));
        return;
      }

      // Check if we need a channel for this command
      const requiresChannel = command !== "join";
      if (requiresChannel && !currentChannel) {
        reject(new Error("Must join a channel before sending commands"));
        return;
      }

      const id = uuidv4();
      const request = {
        id,
        type: command === "join" ? "join" : "message",
        ...(command === "join"
          ? { channel: (params as any).channel }
          : { channel: currentChannel }),
        message: {
          id,
          command,
          params: {
            ...(params as any),
            commandId: id, // Include the command ID in params
          },
        },
      };

      // Set timeout for request
      const timeout = setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          logger.error(`Request ${id} to Figma timed out after ${timeoutMs / 1000} seconds`);
          reject(new Error("Request to Figma timed out"));
        }
      }, timeoutMs);

      // Store the promise callbacks to resolve/reject later
      pendingRequests.set(id, {
        resolve,
        reject,
        timeout,
        lastActivity: Date.now(),
      });

      // Send the request
      logger.info(`Sending command to Figma: ${command}`);
      logger.debug(`Request details: ${JSON.stringify(request)}`);
      ws.send(JSON.stringify(request));
    });
  }

  return {
    connectToFigma,
    joinChannel,
    sendCommandToFigma,
  };
}
