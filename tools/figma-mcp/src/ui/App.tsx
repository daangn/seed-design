import { ActionButton } from "@/design-system/ui/action-button";
import { Callout } from "@/design-system/ui/callout";
import { TextField, TextFieldInput } from "@/design-system/ui/text-field";
import { Flex, Stack, Text } from "@seed-design/react";
import { useEffect, useRef, useState } from "react";

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

interface WebSocketState {
  connected: boolean;
  socket: WebSocket | null;
  serverPort: number;
  pendingRequests: Map<string, PendingRequest>;
  channel: string | null;
}

export default function App() {
  // State management
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    socket: null,
    serverPort: 3055,
    pendingRequests: new Map(),
    channel: null,
  });
  const [port, setPort] = useState<number>(3055);
  const [connectionStatusMessage, setConnectionStatusMessage] = useState<string>(
    "Not connected to Cursor MCP server",
  );

  // Use ref to maintain WebSocket state across renders
  const stateRef = useRef(state);

  // Update the ref whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Connect to WebSocket server
  const connectToServer = async (port: number) => {
    try {
      if (state.connected && state.socket) {
        updateConnectionStatus(true, "Already connected to server");
        return;
      }

      updateConnectionStatus(false, "Connecting...");

      const socket = new WebSocket(`ws://localhost:${port}`);

      socket.onopen = () => {
        // Generate random channel name
        const channelName = generateChannelName();
        console.log("Joining channel:", channelName);

        // Join the channel
        socket.send(
          JSON.stringify({
            type: "join",
            channel: channelName.trim(),
          }),
        );

        setState((prev) => ({
          ...prev,
          socket,
          serverPort: port,
          channel: channelName,
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);

          if (data.type === "system") {
            // Successfully joined channel
            if (data.message?.result) {
              const channelName = data.channel;
              updateConnectionStatus(
                true,
                `Connected to server on port ${port} in channel: ${channelName}`,
              );

              setState((prev) => ({
                ...prev,
                connected: true,
              }));

              // Notify the plugin code
              parent.postMessage(
                {
                  pluginMessage: {
                    type: "notify",
                    message: `Connected to Cursor MCP server on port ${port} in channel: ${channelName}`,
                  },
                },
                "*",
              );
            }
          } else if (data.type === "error") {
            console.error("Error:", data.message);
            updateConnectionStatus(false, `Error: ${data.message}`);
            socket.close();
          }

          handleSocketMessage(data);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      socket.onclose = () => {
        setState((prev) => ({
          ...prev,
          connected: false,
          socket: null,
        }));
        updateConnectionStatus(false, "Disconnected from server");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateConnectionStatus(false, "Connection error");
        setState((prev) => ({
          ...prev,
          connected: false,
          socket: null,
        }));
      };
    } catch (error: any) {
      console.error("Connection error:", error);
      updateConnectionStatus(false, `Connection error: ${error.message || "Unknown error"}`);
    }
  };

  // Disconnect from WebSocket server
  const disconnectFromServer = () => {
    if (state.socket) {
      state.socket.close();
      setState((prev) => ({
        ...prev,
        socket: null,
        connected: false,
      }));
      updateConnectionStatus(false, "Disconnected from server");
    }
  };

  // Update connection status
  const updateConnectionStatus = (isConnected: boolean, message?: string) => {
    setConnectionStatusMessage(
      message ||
        (isConnected ? "Connected to Cursor MCP server" : "Not connected to Cursor MCP server"),
    );
  };

  // Handle messages from the WebSocket
  const handleSocketMessage = async (payload: any) => {
    const data = payload.message;
    console.log("handleSocketMessage", data);

    const { pendingRequests } = stateRef.current;

    // If it's a response to a previous request
    if (data.id && pendingRequests.has(data.id)) {
      const { resolve, reject } = pendingRequests.get(data.id)!;

      setState((prev) => {
        const newPendingRequests = new Map(prev.pendingRequests);
        newPendingRequests.delete(data.id);
        return {
          ...prev,
          pendingRequests: newPendingRequests,
        };
      });

      if (data.error) {
        reject(new Error(data.error));
      } else {
        resolve(data.result);
      }
      return;
    }

    // If it's a new command
    if (data.command) {
      try {
        // Send the command to the plugin code
        parent.postMessage(
          {
            pluginMessage: {
              type: "execute-command",
              id: data.id,
              command: data.command,
              params: data.params,
            },
          },
          "*",
        );
      } catch (error: any) {
        // Send error back to WebSocket
        sendErrorResponse(data.id, error.message || "Error executing command");
      }
    }
  };

  // Send success response back to WebSocket
  const sendSuccessResponse = (id: string, result: any) => {
    const { connected, socket, channel } = stateRef.current;

    if (!connected || !socket) {
      console.error("Cannot send response: socket not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        id,
        type: "message",
        channel,
        message: {
          id,
          result,
        },
      }),
    );
  };

  // Send error response back to WebSocket
  const sendErrorResponse = (id: string, errorMessage: string) => {
    const { connected, socket, channel } = stateRef.current;

    if (!connected || !socket) {
      console.error("Cannot send error response: socket not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        id,
        type: "message",
        channel,
        message: {
          id,
          error: errorMessage,
        },
      }),
    );
  };

  // Generate random channel name
  const generateChannelName = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Set up message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage;
      if (!message) return;

      console.log("Received message from plugin:", message);

      switch (message.type) {
        case "connection-status":
          updateConnectionStatus(message.connected, message.message);
          setState((prev) => ({
            ...prev,
            connected: message.connected,
          }));
          break;
        case "auto-connect":
          connectToServer(port);
          break;
        case "auto-disconnect":
          disconnectFromServer();
          break;
        case "command-result":
          // Forward the result from plugin code back to WebSocket
          sendSuccessResponse(message.id, message.result);
          break;
        case "command-error":
          // Forward the error from plugin code back to WebSocket
          sendErrorResponse(message.id, message.error);
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [port]);

  return (
    <Stack paddingX="spacingX.globalGutter" paddingY="x4" gap="x4">
      <Flex>
        <Text textStyle="t5Bold" as="h1">
          SEED Design System MCP
        </Text>
      </Flex>

      <Flex gap="x2" alignItems="flexEnd">
        <TextField
          id="port"
          label="WebSocket Server Port"
          value={port.toString()}
          onValueChange={(value) => setPort(Number(value))}
          disabled={state.connected}
        >
          <TextFieldInput />
        </TextField>
        {!state.connected ? (
          <ActionButton
            type="button"
            id="btn-connect"
            variant="brandSolid"
            onClick={() => connectToServer(port)}
          >
            Connect
          </ActionButton>
        ) : (
          <ActionButton
            type="button"
            id="btn-disconnect"
            variant="neutralWeak"
            onClick={disconnectFromServer}
          >
            Disconnect
          </ActionButton>
        )}
      </Flex>

      <Callout
        id="connection-status"
        tone={state.connected ? "informative" : "neutral"}
        description={connectionStatusMessage}
      />
    </Stack>
  );
}
