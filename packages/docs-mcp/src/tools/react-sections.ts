import { z } from "zod";
import type { Tool } from "../types.js";
import {
  fetchReactGettingStartedList,
  fetchReactGettingStartedDoc,
  fetchReactStackflowList,
  fetchReactStackflowDoc,
  fetchReactDeveloperToolsList,
  fetchReactDeveloperToolsDoc,
  fetchReactMigrationList,
  fetchReactMigrationDoc,
  fetchReactAIIntegrationList,
  fetchReactAIIntegrationDoc,
  fetchReactUpdatesList,
  fetchReactUpdatesDoc,
} from "../fetch.js";

// ============================================================================
// Getting Started Tools
// ============================================================================

export const listReactGettingStartedTool: Tool = {
  name: "list_react_getting_started",
  description:
    "List all getting started topics including installation guides for different bundlers, CLI usage, and styling/theming configuration.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactGettingStartedList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - Getting Started Topics\n\n${formatted}\n\n## Usage\nUse get_react_getting_started with a path to get documentation for a specific topic.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching getting started list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactGettingStartedTool: Tool = {
  name: "get_react_getting_started",
  description:
    "Get documentation for a specific getting started topic. Use list_react_getting_started first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z
          .string()
          .describe(
            "The topic path (e.g., 'installation/vite', 'cli/commands', 'styling/tailwind-css')",
          ),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactGettingStartedDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching getting started doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_getting_started to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

// ============================================================================
// Stackflow Tools
// ============================================================================

export const listReactStackflowTool: Tool = {
  name: "list_react_stackflow",
  description:
    "List all Stackflow integration topics for native-like navigation in SEED Design React.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactStackflowList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - Stackflow Topics\n\n${formatted}\n\n## Usage\nUse get_react_stackflow with a path to get documentation for a specific topic.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching Stackflow list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactStackflowTool: Tool = {
  name: "get_react_stackflow",
  description:
    "Get documentation for a specific Stackflow topic. Use list_react_stackflow first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z
          .string()
          .describe(
            "The topic path (e.g., 'getting-started', 'app-screen', 'alert-dialog', 'bottom-sheet', 'menu-sheet')",
          ),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactStackflowDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching Stackflow doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_stackflow to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

// ============================================================================
// Developer Tools
// ============================================================================

export const listReactDeveloperToolsTool: Tool = {
  name: "list_react_developer_tools",
  description:
    "List all developer tools topics including codemods for automated migrations and Figma integration.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactDeveloperToolsList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - Developer Tools Topics\n\n${formatted}\n\n## Usage\nUse get_react_developer_tools with a path to get documentation for a specific topic.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching developer tools list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactDeveloperToolsTool: Tool = {
  name: "get_react_developer_tools",
  description:
    "Get documentation for a specific developer tools topic. Use list_react_developer_tools first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z
          .string()
          .describe(
            "The topic path (e.g., 'codemods/introduction', 'codemods/available-transforms', 'figma-integration/codegen')",
          ),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactDeveloperToolsDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching developer tools doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_developer_tools to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

// ============================================================================
// Migration Tools
// ============================================================================

export const listReactMigrationTool: Tool = {
  name: "list_react_migration",
  description: "List all migration guide topics for upgrading from previous versions.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactMigrationList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - Migration Topics\n\n${formatted}\n\n## Usage\nUse get_react_migration with a path to get documentation for a specific topic.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching migration list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactMigrationTool: Tool = {
  name: "get_react_migration",
  description:
    "Get documentation for a specific migration topic. Use list_react_migration first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z.string().describe("The topic path (e.g., 'guide', 'migrating-icons')"),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactMigrationDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching migration doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_migration to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

// ============================================================================
// AI Integration Tools
// ============================================================================

export const listReactAIIntegrationTool: Tool = {
  name: "list_react_ai_integration",
  description:
    "List all AI integration topics including LLMs.txt specification and MCP integration guides.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactAIIntegrationList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - AI Integration Topics\n\n${formatted}\n\n## Usage\nUse get_react_ai_integration with a path to get documentation for a specific topic.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching AI integration list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactAIIntegrationTool: Tool = {
  name: "get_react_ai_integration",
  description:
    "Get documentation for a specific AI integration topic. Use list_react_ai_integration first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z.string().describe("The topic path (e.g., 'llms-txt', 'mcp')"),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactAIIntegrationDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching AI integration doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_ai_integration to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

// ============================================================================
// Updates Tools
// ============================================================================

export const listReactUpdatesTool: Tool = {
  name: "list_react_updates",
  description: "List all updates topics including version improvements and release notes.",
  exec(server, { name, description }) {
    server.tool(name, description, {}, async () => {
      try {
        const topics = await fetchReactUpdatesList();

        const formatted = topics.map((t) => `- ${t.title} (path: ${t.path})`).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `# SEED Design React - Updates Topics\n\n${formatted}\n\n## Usage\nUse get_react_updates with a path to get documentation for a specific topic.\nFor changelog, use get_react_changelog instead.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching updates list: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    });
  },
};

export const getReactUpdatesTool: Tool = {
  name: "get_react_updates",
  description:
    "Get documentation for a specific updates topic. Use list_react_updates first to see available topics.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        path: z.string().describe("The topic path (e.g., 'v3-improvements')"),
      },
      async ({ path }) => {
        try {
          const content = await fetchReactUpdatesDoc(path);

          return {
            content: [{ type: "text", text: content }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching updates doc '${path}': ${error instanceof Error ? error.message : "Unknown error"}\n\nUse list_react_updates to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};
