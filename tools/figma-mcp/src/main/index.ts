// This is the main code file for the Cursor MCP Figma plugin
// It handles Figma API commands

import { handleCommand } from "./command-handler";
import { posthog } from "./posthog";

// Plugin state
const state = {
  serverPort: 3055, // Default port
};

// Show UI
figma.showUI(__html__, { width: 350, height: 450 });

// Plugin commands from UI
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case "update-settings":
      updateSettings(msg);
      break;
    case "notify":
      figma.notify(msg.message);
      break;
    case "close-plugin":
      figma.closePlugin();
      break;
    case "execute-command":
      // Execute commands received from UI (which gets them from WebSocket)
      try {
        const result = await handleCommand(msg.command, msg.params);
        // Send result back to UI
        figma.ui.postMessage({
          type: "command-result",
          id: msg.id,
          result,
        });
      } catch (error) {
        figma.ui.postMessage({
          type: "command-error",
          id: msg.id,
          error: error instanceof Error ? error.message : "Error executing command",
        });
      }
      break;
  }
};

// Listen for plugin commands from menu
figma.on("run", () => {
  figma.ui.postMessage({ type: "auto-connect" });
});

// Update plugin settings
interface PluginSettings {
  serverPort?: number;
  [key: string]: any;
}

function updateSettings(settings: PluginSettings): void {
  if (settings.serverPort) {
    state.serverPort = settings.serverPort;
  }

  figma.clientStorage.setAsync("settings", {
    serverPort: state.serverPort,
  });
}

// Initialize settings on load
(async function initializePlugin() {
  try {
    const savedSettings = await figma.clientStorage.getAsync("settings");
    if (savedSettings) {
      updateSettings(savedSettings);
    }

    posthog.capture({
      event: "plugin_open",
      properties: {
        fileName: figma.root.name,
        fileKey: figma.fileKey,

        username: figma.currentUser?.name,
        userId: figma.currentUser?.id,
      },
    });
  } catch (error) {
    console.error("Error loading settings:", error);
  }
})();
