import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createRestNormalizer, figma, getFigmaColorVariableNames, react } from "@seed-design/figma";
import { z } from "zod";
import type { McpConfig } from "./config";
import { parseFigmaUrl } from "./figma-rest-client";
import { formatError } from "./logger";
import {
  formatErrorResponse,
  formatImageResponse,
  formatObjectResponse,
  formatTextResponse,
} from "./responses";
import {
  createToolContext,
  fetchMultipleNodesData,
  fetchNodeData,
  requireWebSocket,
} from "./tools-helpers";
import type { FigmaWebSocketClient } from "./websocket";

/**
 * singleNode 파라미터 스키마
 * - Option A: figmaUrl - URL에서 fileKey, nodeId 추출 (REST API)
 * - Option B: fileKey + nodeId - 직접 지정 (REST API)
 * - Option C: nodeId만 - WebSocket 모드
 */
const singleNodeParamsSchema = z.union([
  z.object({
    figmaUrl: z
      .url()
      .describe("Figma node URL. Example: https://www.figma.com/design/ABC123/Name?node-id=0-1"),
    personalAccessToken: z
      .string()
      .optional()
      .describe(
        "Figma Personal Access Token. If not provided, uses FIGMA_PERSONAL_ACCESS_TOKEN env var.",
      ),
  }),
  z.object({
    fileKey: z.string().describe("Figma file key"),
    nodeId: z.string().describe("Node ID (e.g., '0:1')"),
    personalAccessToken: z
      .string()
      .optional()
      .describe(
        "Figma Personal Access Token. If not provided, uses FIGMA_PERSONAL_ACCESS_TOKEN env var.",
      ),
  }),
  z.object({
    nodeId: z.string().describe("Node ID for WebSocket mode (e.g., '0:1')"),
  }),
]);

/**
 * multiNode는 URL 방식을 지원하지 않습니다.
 * (Figma URL은 단일 node-id만 포함 가능)
 *
 * - Option A: fileKey + nodeIds - REST API 모드
 * - Option B: nodeIds만 - WebSocket 모드
 */
const multiNodeParamsSchema = z.union([
  z.object({
    fileKey: z.string().describe("Figma file key"),
    nodeIds: z.array(z.string()).describe("Array of node IDs (colon format)"),
    personalAccessToken: z
      .string()
      .optional()
      .describe(
        "Figma Personal Access Token. If not provided, uses FIGMA_PERSONAL_ACCESS_TOKEN env var.",
      ),
  }),
  z.object({
    nodeIds: z.array(z.string()).describe("Array of node IDs for WebSocket mode"),
  }),
]);

function resolveSingleNodeParams(params: z.infer<typeof singleNodeParamsSchema>): {
  fileKey: string | undefined;
  nodeId: string;
  personalAccessToken: string | undefined;
} {
  if ("figmaUrl" in params) {
    const parsed = parseFigmaUrl(params.figmaUrl);

    return {
      fileKey: parsed.fileKey,
      nodeId: parsed.nodeId,
      personalAccessToken: params.personalAccessToken,
    };
  }

  if ("fileKey" in params) {
    return {
      fileKey: params.fileKey,
      nodeId: params.nodeId,
      personalAccessToken: params.personalAccessToken,
    };
  }

  return { fileKey: undefined, nodeId: params.nodeId, personalAccessToken: undefined };
}

function resolveMultiNodeParams(params: z.infer<typeof multiNodeParamsSchema>): {
  fileKey: string | undefined;
  nodeIds: string[];
  personalAccessToken: string | undefined;
} {
  if ("fileKey" in params) {
    return {
      fileKey: params.fileKey,
      nodeIds: params.nodeIds,
      personalAccessToken: params.personalAccessToken,
    };
  }

  return { fileKey: undefined, nodeIds: params.nodeIds, personalAccessToken: undefined };
}

export type ToolMode = "rest" | "websocket" | "all";

// Mode-specific descriptions
function getSingleNodeDescription(baseDescription: string, mode: ToolMode): string {
  switch (mode) {
    case "rest":
      return (
        `${baseDescription} ` +
        "Provide either: (1) figmaUrl (e.g., https://www.figma.com/design/ABC/Name?node-id=0-1), " +
        "or (2) fileKey + nodeId."
      );
    case "websocket":
      return `${baseDescription} Provide nodeId. Requires WebSocket connection with Figma Plugin.`;
    case "all":
    default:
      return (
        `${baseDescription} ` +
        "Provide either: (1) figmaUrl (e.g., https://www.figma.com/design/ABC/Name?node-id=0-1), " +
        "(2) fileKey + nodeId, or (3) nodeId only for WebSocket mode."
      );
  }
}

function getMultiNodeDescription(baseDescription: string, mode: ToolMode): string {
  switch (mode) {
    case "rest":
      return `${baseDescription} Provide fileKey + nodeIds.`;
    case "websocket":
      return `${baseDescription} Provide nodeIds. Requires WebSocket connection with Figma Plugin.`;
    case "all":
    default:
      return (
        `${baseDescription} ` +
        "Provide either: (1) fileKey + nodeIds for REST API, or (2) nodeIds only for WebSocket mode. " +
        "If you have multiple URLs, call get_node_info for each URL instead."
      );
  }
}

export function registerTools(
  server: McpServer,
  figmaClient: FigmaWebSocketClient | null,
  config: McpConfig | null = {},
  mode: ToolMode = "all",
): void {
  const context = createToolContext(figmaClient, config);

  const shouldRegisterWebSocketOnlyTools = mode === "websocket" || mode === "all";

  // REST API + WebSocket Tools (hybrid)
  // These tools support both REST API and WebSocket modes

  // Component Info Tool (REST API + WebSocket)
  server.registerTool(
    "get_component_info",
    {
      description: getSingleNodeDescription(
        "Get detailed information about a specific component node in Figma.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema,
    },
    async (params) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const result = await fetchNodeData({ fileKey, nodeId, personalAccessToken }, context);

        const node = result.document;
        if (node.type !== "COMPONENT" && node.type !== "COMPONENT_SET") {
          return formatErrorResponse(
            "get_component_info",
            new Error(`Node with ID ${nodeId} is not a component node`),
          );
        }

        const key = result.componentSets[nodeId]?.key ?? result.components[nodeId]?.key;
        if (!key) {
          return formatErrorResponse(
            "get_component_info",
            new Error(`${nodeId} is not present in exported component data`),
          );
        }

        return formatObjectResponse({
          name: node.name,
          key,
          componentPropertyDefinitions: node.componentPropertyDefinitions,
        });
      } catch (error) {
        return formatErrorResponse("get_component_info", error);
      }
    },
  );

  // Node Info Tool (REST API + WebSocket)
  server.registerTool(
    "get_node_info",
    {
      description: getSingleNodeDescription(
        "Get detailed information about a specific node in Figma.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema,
    },
    async (params) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const result = await fetchNodeData({ fileKey, nodeId, personalAccessToken }, context);

        const normalizer = createRestNormalizer(result);
        const node = normalizer(result.document);

        const noInferPipeline = figma.createPipeline({
          shouldInferAutoLayout: false,
          shouldInferVariableName: false,
        });
        const inferPipeline = figma.createPipeline({
          shouldInferAutoLayout: true,
          shouldInferVariableName: true,
        });
        const original =
          noInferPipeline.generateCode(node, { shouldPrintSource: true })?.jsx ??
          "Failed to generate summarized node info";
        const inferred =
          inferPipeline.generateCode(node, { shouldPrintSource: true })?.jsx ??
          "Failed to generate summarized node info";

        return formatObjectResponse({
          original: { data: original, description: "Original Figma node info" },
          inferred: { data: inferred, description: "AutoLayout Inferred Figma node info" },
        });
      } catch (error) {
        return formatTextResponse(
          `Error in get_node_info: ${formatError(error)}\n\n⚠️ Please make sure you have the latest version of the Figma library.`,
        );
      }
    },
  );

  // Nodes Info Tool (REST API + WebSocket)
  server.registerTool(
    "get_nodes_info",
    {
      description: getMultiNodeDescription(
        "Get detailed information about multiple nodes in Figma.",
        mode,
      ),
      inputSchema: multiNodeParamsSchema,
    },
    async (params) => {
      try {
        const { fileKey, nodeIds, personalAccessToken } = resolveMultiNodeParams(params);

        if (nodeIds.length === 0) {
          return formatErrorResponse("get_nodes_info", new Error("No node IDs provided"));
        }

        const nodesData = await fetchMultipleNodesData(
          { fileKey, nodeIds, personalAccessToken },
          context,
        );

        const results = nodeIds.map((nodeId) => {
          const nodeData = nodesData[nodeId];
          if (!nodeData) {
            return { nodeId, error: `Node ${nodeId} not found` };
          }

          const normalizer = createRestNormalizer(nodeData);
          const node = normalizer(nodeData.document);

          const noInferPipeline = figma.createPipeline({
            shouldInferAutoLayout: false,
            shouldInferVariableName: false,
          });
          const inferPipeline = figma.createPipeline({
            shouldInferAutoLayout: true,
            shouldInferVariableName: true,
          });
          const original =
            noInferPipeline.generateCode(node, { shouldPrintSource: true })?.jsx ??
            "Failed to generate summarized node info";
          const inferred =
            inferPipeline.generateCode(node, { shouldPrintSource: true })?.jsx ??
            "Failed to generate summarized node info";

          return {
            nodeId,
            original: { data: original, description: "Original Figma node info" },
            inferred: { data: inferred, description: "AutoLayout Inferred Figma node info" },
          };
        });

        return formatObjectResponse(results);
      } catch (error) {
        return formatTextResponse(
          `Error in get_nodes_info: ${formatError(error)}\n\n⚠️ Please make sure you have the latest version of the Figma library.`,
        );
      }
    },
  );

  // Get Node React Code Tool (REST API + WebSocket)
  server.registerTool(
    "get_node_react_code",
    {
      description: getSingleNodeDescription(
        "Get the React code for a specific node in Figma.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema,
    },
    async (params) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const result = await fetchNodeData({ fileKey, nodeId, personalAccessToken }, context);

        const normalizer = createRestNormalizer(result);
        const pipeline = react.createPipeline({
          shouldInferAutoLayout: true,
          shouldInferVariableName: true,
          extend: context.extend,
        });
        const generated = pipeline.generateCode(normalizer(result.document), {
          shouldPrintSource: false,
        });

        if (!generated) {
          return formatTextResponse(
            "Failed to generate code\n\n⚠️ Please make sure you have the latest version of the Figma library.",
          );
        }

        return formatTextResponse(`${generated.imports}\n\n${generated.jsx}`);
      } catch (error) {
        return formatTextResponse(
          `Error in get_node_react_code: ${formatError(error)}\n\n⚠️ Please make sure you have the latest version of the Figma library.`,
        );
      }
    },
  );

  // Utility Tools (No Figma connection required)

  // Retrieve Color Variable Names Tool
  server.registerTool(
    "retrieve_color_variable_names",
    {
      description:
        "Retrieve available SEED Design color variable names by scope. No Figma connection required.",
      inputSchema: z.object({
        scope: z
          .enum(["fg", "bg", "stroke", "palette"])
          .array()
          .describe("The scope of the color variable names to retrieve"),
      }),
    },
    async ({ scope }) => {
      try {
        const result = getFigmaColorVariableNames(scope);

        return formatObjectResponse(result);
      } catch (error) {
        return formatErrorResponse("retrieve_color_variable_names", error);
      }
    },
  );

  if (shouldRegisterWebSocketOnlyTools) {
    // WebSocket Only Tools

    server.registerTool(
      "join_channel",
      {
        description: "Join a specific channel to communicate with Figma (WebSocket mode only)",
        inputSchema: z.object({
          channel: z.string().describe("The name of the channel to join").default(""),
        }),
      },
      async ({ channel }) => {
        try {
          if (!figmaClient)
            return formatErrorResponse(
              "join_channel",
              new Error("WebSocket not available. This tool requires Figma Plugin connection."),
            );

          if (!channel)
            // If no channel provided, ask the user for input
            return {
              ...formatTextResponse("Please provide a channel name to join:"),
              followUp: {
                tool: "join_channel",
                description: "Join the specified channel",
              },
            };

          await figmaClient.joinChannel(channel);

          return formatTextResponse(`Successfully joined channel: ${channel}`);
        } catch (error) {
          return formatErrorResponse("join_channel", error);
        }
      },
    );

    // Document Info Tool
    server.registerTool(
      "get_document_info",
      {
        description:
          "Get detailed information about the current Figma document (WebSocket mode only)",
      },
      async () => {
        try {
          requireWebSocket(context);
          const result = await context.sendCommandToFigma("get_document_info");

          return formatObjectResponse(result);
        } catch (error) {
          return formatErrorResponse("get_document_info", error);
        }
      },
    );

    // Selection Tool
    server.registerTool(
      "get_selection",
      {
        description: "Get information about the current selection in Figma (WebSocket mode only)",
      },
      async () => {
        try {
          requireWebSocket(context);
          const result = await context.sendCommandToFigma("get_selection");

          return formatObjectResponse(result);
        } catch (error) {
          return formatErrorResponse("get_selection", error);
        }
      },
    );

    // Annotation Tool
    server.registerTool(
      "add_annotations",
      {
        description: "Add annotations to multiple nodes in Figma (WebSocket mode only)",
        inputSchema: z.object({
          annotations: z.array(
            z.object({
              nodeId: z.string().describe("The ID of the node to add an annotation to"),
              labelMarkdown: z
                .string()
                .describe("The markdown label for the annotation, do not escape newlines"),
            }),
          ),
        }),
      },
      async ({ annotations }) => {
        try {
          requireWebSocket(context);
          await context.sendCommandToFigma("add_annotations", { annotations });

          return formatTextResponse(
            `Annotations added to nodes ${annotations.map((annotation) => annotation.nodeId).join(", ")}`,
          );
        } catch (error) {
          return formatErrorResponse("add_annotations", error);
        }
      },
    );

    // Get Annotations Tool
    server.registerTool(
      "get_annotations",
      {
        description: "Get annotations for a specific node in Figma (WebSocket mode only)",
        inputSchema: z.object({
          nodeId: z.string().describe("The ID of the node to get annotations for"),
        }),
      },
      async ({ nodeId }) => {
        try {
          requireWebSocket(context);
          const result = await context.sendCommandToFigma("get_annotations", { nodeId });

          return formatObjectResponse(result);
        } catch (error) {
          return formatErrorResponse("get_annotations", error);
        }
      },
    );

    // Export Node as Image Tool
    server.registerTool(
      "export_node_as_image",
      {
        description: "Export a node as an image from Figma (WebSocket mode only)",
        inputSchema: z.object({
          nodeId: z.string().describe("The ID of the node to export"),
          format: z.enum(["PNG", "JPG", "SVG", "PDF"]).optional().describe("Export format"),
          scale: z.number().positive().optional().describe("Export scale"),
        }),
      },
      async ({ nodeId, format, scale }) => {
        try {
          requireWebSocket(context);
          const result = await context.sendCommandToFigma("export_node_as_image", {
            nodeId,
            format: format || "PNG",
            scale: scale || 1,
          });

          const typedResult = result as { base64: string; mimeType: string };
          return formatImageResponse(typedResult.base64, typedResult.mimeType || "image/png");
        } catch (error) {
          return formatErrorResponse("export_node_as_image", error);
        }
      },
    );
  }
}

// editing tools require WebSocket client

export function registerEditingTools(server: McpServer, figmaClient: FigmaWebSocketClient): void {
  const { sendCommandToFigma } = figmaClient;

  // Clone Node Tool
  server.registerTool(
    "clone_node",
    {
      description: "Clone an existing node in Figma (WebSocket mode only)",
      inputSchema: z.object({
        nodeId: z.string().describe("The ID of the node to clone"),
        x: z.number().optional().describe("New X position for the clone"),
        y: z.number().optional().describe("New Y position for the clone"),
      }),
    },
    async ({ nodeId, x, y }) => {
      try {
        const result = await sendCommandToFigma("clone_node", { nodeId, x, y });
        const typedResult = result as {
          id: string;
          originalId: string;
          x?: number;
          y?: number;
          success: boolean;
        };

        return formatTextResponse(
          `Cloned node with new ID: ${typedResult.id}${x !== undefined && y !== undefined ? ` at position (${x}, ${y})` : ""}`,
        );
      } catch (error) {
        return formatErrorResponse("clone_node", error);
      }
    },
  );

  server.registerTool(
    "set_fill_color",
    {
      description: "Set the fill color of a node (WebSocket mode only)",
      inputSchema: z.object({
        nodeId: z.string().describe("The ID of the node to set the fill color of"),
        colorToken: z
          .string()
          .describe(
            "The color token to set the fill color to. Format: `{category}/{name}`. Example: `bg/brand`",
          ),
      }),
    },
    async ({ nodeId, colorToken }) => {
      try {
        await sendCommandToFigma("set_fill_color", { nodeId, colorToken });

        return formatTextResponse(`Fill color set to ${colorToken}`);
      } catch (error) {
        return formatErrorResponse("set_fill_color", error);
      }
    },
  );

  server.registerTool(
    "set_stroke_color",
    {
      description: "Set the stroke color of a node (WebSocket mode only)",
      inputSchema: z.object({
        nodeId: z.string().describe("The ID of the node to set the stroke color of"),
        colorToken: z
          .string()
          .describe(
            "The color token to set the stroke color to. Format: `{category}/{name}`. Example: `stroke/neutral`",
          ),
      }),
    },
    async ({ nodeId, colorToken }) => {
      try {
        await sendCommandToFigma("set_stroke_color", { nodeId, colorToken });

        return formatTextResponse(`Stroke color set to ${colorToken}`);
      } catch (error) {
        return formatErrorResponse("set_stroke_color", error);
      }
    },
  );

  server.registerTool(
    "set_auto_layout",
    {
      description: "Set the auto layout of a node (WebSocket mode only)",
      inputSchema: z.object({
        nodeId: z.string().describe("The ID of the node to set the auto layout of"),
        layoutMode: z
          .enum(["HORIZONTAL", "VERTICAL"])
          .optional()
          .describe("The layout mode to set"),
        layoutWrap: z.enum(["NO_WRAP", "WRAP"]).optional().describe("The layout wrap to set"),
        primaryAxisAlignItems: z
          .enum(["MIN", "MAX", "CENTER", "SPACE_BETWEEN"])
          .optional()
          .describe("The primary axis align items to set"),
        counterAxisAlignItems: z
          .enum(["MIN", "MAX", "CENTER", "BASELINE"])
          .optional()
          .describe("The counter axis align items to set"),
        itemSpacing: z.number().optional().describe("The item spacing to set"),
        horizontalPadding: z.number().optional().describe("The horizontal padding to set"),
        verticalPadding: z.number().optional().describe("The vertical padding to set"),
        paddingLeft: z.number().optional().describe("The padding left to set (when left != right)"),
        paddingRight: z
          .number()
          .optional()
          .describe("The padding right to set (when left != right)"),
        paddingTop: z.number().optional().describe("The padding top to set (when top != bottom)"),
        paddingBottom: z
          .number()
          .optional()
          .describe("The padding bottom to set (when top != bottom)"),
      }),
    },
    async ({
      nodeId,
      layoutMode,
      layoutWrap,
      primaryAxisAlignItems,
      counterAxisAlignItems,
      itemSpacing,
      horizontalPadding,
      verticalPadding,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    }) => {
      try {
        await sendCommandToFigma("set_auto_layout", {
          nodeId,
          layoutMode,
          layoutWrap,
          primaryAxisAlignItems,
          counterAxisAlignItems,
          itemSpacing,
          horizontalPadding,
          verticalPadding,
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingBottom,
        });

        return formatTextResponse(`Layout set to ${layoutMode}`);
      } catch (error) {
        return formatErrorResponse("set_auto_layout", error);
      }
    },
  );

  server.registerTool(
    "set_size",
    {
      description: "Set the size of a node (WebSocket mode only)",
      inputSchema: z.object({
        nodeId: z.string().describe("The ID of the node to set the size of"),
        layoutSizingHorizontal: z
          .enum(["HUG", "FILL"])
          .optional()
          .describe("The horizontal layout sizing to set (exclusive with width)"),
        layoutSizingVertical: z
          .enum(["HUG", "FILL"])
          .optional()
          .describe("The vertical layout sizing to set (exclusive with height)"),
        width: z.number().optional().describe("The width to set (raw value)"),
        height: z.number().optional().describe("The height to set (raw value)"),
      }),
    },
    async ({ nodeId, layoutSizingHorizontal, layoutSizingVertical, width, height }) => {
      try {
        await sendCommandToFigma("set_size", {
          nodeId,
          layoutSizingHorizontal,
          layoutSizingVertical,
          width,
          height,
        });

        return formatTextResponse(
          `Size set to ${width ?? layoutSizingHorizontal}x${height ?? layoutSizingVertical}`,
        );
      } catch (error) {
        return formatErrorResponse("set_size", error);
      }
    },
  );
}
