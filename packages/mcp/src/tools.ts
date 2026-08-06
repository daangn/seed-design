import type { McpServer } from "@modelcontextprotocol/server";
import {
  createRestNormalizer,
  figma,
  getFigmaColorVariableNames,
  react,
  type NormalizedSceneNode,
} from "@seed-design/figma";
import { z } from "zod";
import type { McpConfig } from "./config";
import { parseFigmaUrl } from "./figma-rest-client";
import {
  formatErrorResponse,
  formatImageResponse,
  formatObjectResponse,
  formatTextResponse,
} from "./responses";
import type { FigmaRestClient } from "./figma-rest-client";
import {
  createToolContext,
  fetchMultipleNodesData,
  fetchNodeAnnotations,
  fetchNodeData,
  fetchNodeImage,
  fetchNodeSvg,
  IMAGE_FORMATS,
  requireWebSocket,
  type ImageFormat,
  type ToolMode,
} from "./tools-helpers";
import type { FigmaWebSocketClient } from "./websocket";

/**
 * The codegen pipeline lives in `@seed-design/figma`, so a version skew there surfaces here as an
 * otherwise unexplained generation failure.
 */
const FIGMA_LIBRARY_HINT = "⚠️ Please make sure you have the latest version of the Figma library.";

const singleNodeBaseSchema = z.object({
  figmaUrl: z
    .url()
    .optional()
    .describe("Figma node URL. Extracts fileKey and nodeId automatically when provided."),
  fileKey: z
    .string()
    .optional()
    .describe("Figma file key. Use with nodeId when not using figmaUrl."),
  nodeId: z.string().optional().describe("Node ID (e.g., '0:1')."),
  personalAccessToken: z
    .string()
    .optional()
    .describe("Figma PAT. Falls back to FIGMA_PERSONAL_ACCESS_TOKEN env when not provided."),
});

const multiNodeBaseSchema = z.object({
  fileKey: z
    .string()
    .optional()
    .describe("Figma file key. Required when WebSocket connection is not available."),
  nodeIds: z.array(z.string()).describe("Array of node IDs (e.g., ['0:1', '0:2'])"),
  personalAccessToken: z
    .string()
    .optional()
    .describe(
      "Figma PAT. Falls back to FIGMA_PERSONAL_ACCESS_TOKEN env when not provided to be used when WebSocket connection is not available.",
    ),
});

function getSingleNodeParamsSchema(mode: ToolMode) {
  switch (mode) {
    case "websocket":
      return singleNodeBaseSchema.pick({ nodeId: true }).required();
    default:
      return singleNodeBaseSchema;
  }
}

function getMultiNodeParamsSchema(mode: ToolMode) {
  switch (mode) {
    case "websocket":
      return multiNodeBaseSchema.pick({ nodeIds: true });
    case "rest":
      return multiNodeBaseSchema.required({ fileKey: true });
    default:
      return multiNodeBaseSchema;
  }
}

function resolveSingleNodeParams(params: z.infer<typeof singleNodeBaseSchema>): {
  fileKey: string | undefined;
  nodeId: string;
  personalAccessToken: string | undefined;
} {
  if (params.figmaUrl) {
    const parsed = parseFigmaUrl(params.figmaUrl);

    return {
      fileKey: parsed.fileKey,
      nodeId: parsed.nodeId,
      personalAccessToken: params.personalAccessToken,
    };
  }

  if (!params.nodeId) {
    throw new Error(
      "Either figmaUrl or nodeId must be provided. Use figmaUrl for automatic parsing, or provide fileKey + nodeId directly.",
    );
  }

  return {
    fileKey: params.fileKey,
    nodeId: params.nodeId,
    personalAccessToken: params.personalAccessToken,
  };
}

function getSingleNodeDescription(baseDescription: string, mode: ToolMode): string {
  switch (mode) {
    case "rest":
      return `${baseDescription} Provide either: (1) figmaUrl (e.g., https://www.figma.com/design/ABC/Name?node-id=0-1), or (2) fileKey + nodeId.`;
    case "websocket":
      return `${baseDescription} Provide nodeId. Requires WebSocket connection with Figma Plugin.`;
    case "all":
      return `${baseDescription} Provide either: (1) figmaUrl (e.g., https://www.figma.com/design/ABC/Name?node-id=0-1), (2) fileKey + nodeId, or (3) nodeId only for WebSocket mode.`;
  }
}

function getAnnotationsDescription(mode: ToolMode): string {
  const description = getSingleNodeDescription(
    "Get annotations on a node and on every node under it in Figma.",
    mode,
  );

  if (mode === "websocket") return description;

  return `${description} Annotations read over REST carry only \`label\`, the plain-text rendering — markdown authored in Figma is flattened. \`labelMarkdown\`, holding the authored source, and \`category\` are only present on the WebSocket path.`;
}

function getMultiNodeDescription(baseDescription: string, mode: ToolMode): string {
  switch (mode) {
    case "rest":
      return `${baseDescription} Provide fileKey + nodeIds.`;
    case "websocket":
      return `${baseDescription} Provide nodeIds. Requires WebSocket connection with Figma Plugin.`;
    case "all":
      return `${baseDescription} Provide either: (1) fileKey + nodeIds for REST API, or (2) nodeIds only for WebSocket mode. If you have multiple URLs, call get_node_info for each URL instead.`;
  }
}

export function registerTools(
  server: McpServer,
  figmaClient: FigmaWebSocketClient | null,
  restClient: FigmaRestClient | null,
  config: McpConfig | null,
  mode: ToolMode,
): void {
  const context = createToolContext(figmaClient, restClient, config, mode);
  const singleNodeParamsSchema = getSingleNodeParamsSchema(mode);
  const multiNodeParamsSchema = getMultiNodeParamsSchema(mode);

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
    async (params: z.infer<typeof singleNodeBaseSchema>) => {
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
    async (params: z.infer<typeof singleNodeBaseSchema>) => {
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
        return formatErrorResponse("get_node_info", error, FIGMA_LIBRARY_HINT);
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
    async ({ fileKey, nodeIds, personalAccessToken }: z.infer<typeof multiNodeBaseSchema>) => {
      try {
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
        return formatErrorResponse("get_nodes_info", error, FIGMA_LIBRARY_HINT);
      }
    },
  );

  // Get Node React Code Tool (REST API + WebSocket)
  server.registerTool(
    "get_node_react_code",
    {
      description: getSingleNodeDescription(
        "Get the React code for a specific node in Figma. Vectors that match the Karrot icon packs come back as React icon component names.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema,
    },
    async (params: z.infer<typeof singleNodeBaseSchema>) => {
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

        if (!generated)
          return formatErrorResponse(
            "get_node_react_code",
            new Error("Failed to generate code"),
            FIGMA_LIBRARY_HINT,
          );

        return formatTextResponse(`${generated.imports}\n\n${generated.jsx}`);
      } catch (error) {
        return formatErrorResponse("get_node_react_code", error, FIGMA_LIBRARY_HINT);
      }
    },
  );

  // Find Layers Tool (REST API + WebSocket)
  server.registerTool(
    "find_nodes",
    {
      description: getSingleNodeDescription(
        "Find layers by name within a Figma node's subtree. Returns a flat array of matching nodes with their IDs.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema.extend({
        name: z.string().describe("Regex pattern to match layer names (e.g., 'Usage', 'Do$')."),
      }),
    },
    async (params: z.infer<typeof singleNodeBaseSchema> & { name: string }) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const result = await fetchNodeData({ fileKey, nodeId, personalAccessToken }, context);

        const normalizer = createRestNormalizer(result);
        const node = normalizer(result.document);

        let pattern: RegExp;
        try {
          pattern = new RegExp(params.name);
        } catch {
          return formatErrorResponse(
            "find_nodes",
            new Error(`Invalid regex pattern: ${params.name}`),
          );
        }
        const matches = collectMatchingNodes(node, pattern);

        return formatObjectResponse(matches);
      } catch (error) {
        return formatErrorResponse("find_nodes", error);
      }
    },
  );

  // Export Node as Image Tool (REST API + WebSocket)
  server.registerTool(
    "export_node_as_image",
    {
      description: getSingleNodeDescription(
        "Render a Figma node as an image and return it inline. Use it to see what a node actually looks like, e.g. to compare generated UI against the design.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema.extend({
        format: z.enum(IMAGE_FORMATS).default("PNG").describe("Export format"),
        scale: z.number().min(0.01).max(4).default(1).describe("Render scale between 0.01 and 4"),
      }),
    },
    async (
      params: z.infer<typeof singleNodeBaseSchema> & { format: ImageFormat; scale: number },
    ) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const { base64, mimeType } = await fetchNodeImage(
          { fileKey, nodeId, personalAccessToken, format: params.format, scale: params.scale },
          context,
        );

        return formatImageResponse(base64, mimeType);
      } catch (error) {
        return formatErrorResponse("export_node_as_image", error);
      }
    },
  );

  // Export Node as SVG Tool (REST API + WebSocket)
  server.registerTool(
    "export_node_as_svg",
    {
      description: getSingleNodeDescription(
        "Export a Figma node as SVG markup and return it as text. Use it when you need the vector source itself — path data, viewBox, fill — to put into code. A whole screen frame runs to tens of thousands of tokens and may be cut short by the client, so target the smallest node that holds the artwork.",
        mode,
      ),
      inputSchema: singleNodeParamsSchema.extend({
        outlineText: z
          .boolean()
          .default(false)
          .describe(
            "Render text as vector paths instead of <text> elements. Figma defaults this to true; this tool defaults to false so the text stays readable and the output stays small. Set it to true only when the SVG has to match Figma exactly regardless of the viewer's font rendering.",
          ),
      }),
    },
    async (params: z.infer<typeof singleNodeBaseSchema> & { outlineText: boolean }) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const svg = await fetchNodeSvg(
          { fileKey, nodeId, personalAccessToken, outlineText: params.outlineText },
          context,
        );

        return formatTextResponse(svg);
      } catch (error) {
        // Plugin builds that predate this command reject with `Unknown command`, which reads as a
        // server bug unless the stale plugin is named as the cause.
        if (error instanceof Error && error.message.includes("Unknown command"))
          return formatErrorResponse(
            "export_node_as_svg",
            new Error(
              `${error.message}. The connected Figma plugin is too old for this tool — update it, or pass fileKey + personalAccessToken to go through the REST API instead.`,
            ),
          );

        return formatErrorResponse("export_node_as_svg", error);
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
  }

  // Get Annotations Tool (REST API + WebSocket)
  server.registerTool(
    "get_annotations",
    {
      description: getAnnotationsDescription(mode),
      inputSchema: singleNodeParamsSchema,
    },
    async (params: z.infer<typeof singleNodeBaseSchema>) => {
      try {
        const { fileKey, nodeId, personalAccessToken } = resolveSingleNodeParams(params);
        const nodes = await fetchNodeAnnotations({ fileKey, nodeId, personalAccessToken }, context);

        return formatObjectResponse({ nodes });
      } catch (error) {
        return formatErrorResponse("get_annotations", error);
      }
    },
  );
}

function collectMatchingNodes(
  node: NormalizedSceneNode,
  pattern: RegExp,
): Array<{ id: string; name: string; type: string }> {
  const results: Array<{ id: string; name: string; type: string }> = [];

  if ("name" in node && pattern.test(node.name)) {
    results.push({ id: node.id, name: node.name, type: node.type });
  }

  if ("children" in node && node.children) {
    for (const child of node.children) {
      results.push(...collectMatchingNodes(child, pattern));
    }
  }

  return results;
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
