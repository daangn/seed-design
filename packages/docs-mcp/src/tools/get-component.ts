import { z } from "zod";
import type { Tool } from "../types.js";
import {
  fetchReactComponent,
  fetchBreezeComponent,
  fetchDocsComponent,
  fetchFoundation,
} from "../fetch.js";

export const getReactComponentTool: Tool = {
  name: "get_react_component",
  description:
    "Get complete documentation for a specific SEED React component including installation, props, and examples.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        componentName: z
          .string()
          .describe(
            "The component name in kebab-case (e.g., 'action-button', 'modal', 'text-field')",
          ),
      },
      async ({ componentName }) => {
        try {
          const content = await fetchReactComponent(componentName);

          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching React component '${componentName}': ${
                  error instanceof Error ? error.message : "Unknown error"
                }\n\nPlease check if the component name is correct (use kebab-case format).`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

export const getBreezeComponentTool: Tool = {
  name: "get_breeze_component",
  description: "Get complete documentation for a specific SEED Breeze utility component.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        componentName: z
          .string()
          .describe("The component name in kebab-case (e.g., 'animate-number')"),
      },
      async ({ componentName }) => {
        try {
          const content = await fetchBreezeComponent(componentName);

          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching Breeze component '${componentName}': ${
                  error instanceof Error ? error.message : "Unknown error"
                }\n\nPlease check if the component name is correct (use kebab-case format).`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

export const getDocsComponentTool: Tool = {
  name: "get_docs_component",
  description:
    "Get design guidelines for a specific SEED component including anatomy, properties, variants, and usage recommendations.",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        componentName: z
          .string()
          .describe(
            "The component name in kebab-case (e.g., 'action-button', 'avatar', 'bottom-sheet')",
          ),
      },
      async ({ componentName }) => {
        try {
          const content = await fetchDocsComponent(componentName);

          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching design guidelines for '${componentName}': ${
                  error instanceof Error ? error.message : "Unknown error"
                }\n\nPlease check if the component name is correct (use kebab-case format).`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};

export const getFoundationTool: Tool = {
  name: "get_foundation",
  description:
    "Get detailed documentation for a specific SEED Design foundation topic (color, typography, spacing, iconography, etc.).",
  exec(server, { name, description }) {
    server.tool(
      name,
      description,
      {
        topic: z
          .string()
          .describe(
            "The foundation topic path (e.g., 'spacing', 'color/palette', 'iconography/overview', 'typography/overview')",
          ),
      },
      async ({ topic }) => {
        try {
          const content = await fetchFoundation(topic);

          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching foundation topic '${topic}': ${
                  error instanceof Error ? error.message : "Unknown error"
                }\n\nPlease check if the topic path is correct. Use list_foundation to see available topics.`,
              },
            ],
            isError: true,
          };
        }
      },
    );
  },
};
