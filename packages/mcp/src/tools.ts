import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createRestNormalizer, getFigmaColorVariableNames, react, figma } from "@seed-design/figma";
import { z } from "zod";
import type { McpConfig } from "./config";
import {
  formatErrorResponse,
  formatImageResponse,
  formatObjectResponse,
  formatTextResponse,
} from "./responses";
import type { FigmaWebSocketClient } from "./websocket";

export function registerTools(
  server: McpServer,
  figmaClient: FigmaWebSocketClient,
  config: McpConfig | null = {},
): void {
  const { joinChannel, sendCommandToFigma } = figmaClient;
  const { extend } = config ?? {};

  const figmaPipeline = figma.createPipeline();
  const reactPipeline = react.createPipeline({
    extend,
  });

  // join_channel tool
  server.tool(
    "join_channel",
    "Join a specific channel to communicate with Figma",
    {
      channel: z.string().describe("The name of the channel to join").default(""),
    },
    async ({ channel }) => {
      try {
        if (!channel) {
          // If no channel provided, ask the user for input
          return {
            ...formatTextResponse("Please provide a channel name to join:"),
            followUp: {
              tool: "join_channel",
              description: "Join the specified channel",
            },
          };
        }

        await joinChannel(channel);
        return formatTextResponse(`Successfully joined channel: ${channel}`);
      } catch (error) {
        return formatErrorResponse("join_channel", error);
      }
    },
  );

  // Document Info Tool
  server.tool(
    "get_document_info",
    "Get detailed information about the current Figma document",
    {},
    async () => {
      try {
        const result = await sendCommandToFigma("get_document_info");
        return formatObjectResponse(result);
      } catch (error) {
        return formatErrorResponse("get_document_info", error);
      }
    },
  );

  // Selection Tool
  server.tool(
    "get_selection",
    "Get information about the current selection in Figma",
    {},
    async () => {
      try {
        const result = await sendCommandToFigma("get_selection");
        return formatObjectResponse(result);
      } catch (error) {
        return formatErrorResponse("get_selection", error);
      }
    },
  );

  // Annotation Tool
  server.tool(
    "add_annotations",
    "Add annotations to multiple nodes in Figma",
    {
      annotations: z.array(
        z.object({
          nodeId: z.string().describe("The ID of the node to add an annotation to"),
          labelMarkdown: z
            .string()
            .describe("The markdown label for the annotation, do not escape newlines"),
        }),
      ),
    },
    async ({ annotations }) => {
      try {
        await sendCommandToFigma("add_annotations", { annotations });

        return formatTextResponse(
          `Annotations added to nodes ${annotations.map((annotation) => annotation.nodeId).join(", ")}`,
        );
      } catch (error) {
        return formatErrorResponse("add_annotations", error);
      }
    },
  );

  // Get Annotations Tool
  server.tool(
    "get_annotations",
    "Get annotations for a specific node in Figma",
    { nodeId: z.string().describe("The ID of the node to get annotations for") },
    async ({ nodeId }) => {
      try {
        const result = await sendCommandToFigma("get_annotations", { nodeId });
        return formatObjectResponse(result);
      } catch (error) {
        return formatErrorResponse("get_annotations", error);
      }
    },
  );

  // Component Info Tool
  server.tool(
    "get_component_info",
    "Get detailed information about a specific component node in Figma",
    {
      nodeId: z.string().describe("The ID of the component node to get information about"),
    },
    async ({ nodeId }) => {
      try {
        const result = (await sendCommandToFigma("get_node_info", {
          nodeId,
        })) as GetFileNodesResponse["nodes"][string];

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
        return formatErrorResponse("get_node_info", error);
      }
    },
  );

  // Node Info Tool
  server.tool(
    "get_node_info",
    "Get detailed information about a specific node in Figma",
    {
      nodeId: z.string().describe("The ID of the node to get information about"),
    },
    async ({ nodeId }) => {
      try {
        const result: any = await sendCommandToFigma("get_node_info", { nodeId });
        const normalizer = createRestNormalizer(result);
        const node = normalizer(result.document);

        const original =
          figmaPipeline.generateCode(node, {
            shouldPrintSource: true,
            shouldInferVariableName: false,
            shouldInferAutoLayout: false,
          }) ?? "Failed to generate summarized node info";
        const inferred =
          figmaPipeline.generateCode(node, {
            shouldPrintSource: true,
            shouldInferVariableName: false,
            shouldInferAutoLayout: true,
          }) ?? "Failed to generate summarized node info";

        return formatObjectResponse({
          original: {
            data: original,
            description: "Original Figma node info",
          },
          inferred: {
            data: inferred,
            description: "AutoLayout Inferred Figma node info (fix suggestions)",
          },
        });
      } catch (error) {
        return formatErrorResponse("get_node_info", error);
      }
    },
  );

  // Nodes Info Tool
  server.tool(
    "get_nodes_info",
    "Get detailed information about multiple nodes in Figma",
    {
      nodeIds: z.array(z.string()).describe("Array of node IDs to get information about"),
    },
    async ({ nodeIds }) => {
      try {
        const results = await Promise.all(
          nodeIds.map(async (nodeId) => {
            const result: any = await sendCommandToFigma("get_node_info", { nodeId });
            const normalizer = createRestNormalizer(result);
            const node = normalizer(result.document);

            const original =
              figmaPipeline.generateCode(node, {
                shouldInferVariableName: false,
                shouldPrintSource: true,
                shouldInferAutoLayout: false,
              }) ?? "Failed to generate summarized node info";
            const inferred =
              figmaPipeline.generateCode(node, {
                shouldInferVariableName: true,
                shouldPrintSource: true,
                shouldInferAutoLayout: false,
              }) ?? "Failed to generate summarized node info";

            return {
              nodeId,
              original: {
                data: original,
                description: "Original Figma node info",
              },
              inferred: {
                data: inferred,
                description: "AutoLayout Inferred Figma node info (fix suggestions)",
              },
            };
          }),
        );
        return formatObjectResponse(results);
      } catch (error) {
        return formatErrorResponse("get_nodes_info", error);
      }
    },
  );

  server.tool(
    "get_node_react_code",
    "Get the React code for a specific node in Figma",
    { nodeId: z.string().describe("The ID of the node to get code for") },
    async ({ nodeId }) => {
      try {
        const result: any = await sendCommandToFigma("get_node_info", { nodeId });
        const normalizer = createRestNormalizer(result);

        const code =
          reactPipeline.generateCode(normalizer(result.document), {
            shouldInferVariableName: true,
            shouldPrintSource: false,
            shouldInferAutoLayout: true,
          }) ?? "Failed to generate code";

        return formatTextResponse(code);
      } catch (error) {
        return formatErrorResponse("get_node_react_code", error);
      }
    },
  );

  // Export Node as Image Tool
  server.tool(
    "export_node_as_image",
    "Export a node as an image from Figma",
    {
      nodeId: z.string().describe("The ID of the node to export"),
      format: z.enum(["PNG", "JPG", "SVG", "PDF"]).optional().describe("Export format"),
      scale: z.number().positive().optional().describe("Export scale"),
    },
    async ({ nodeId, format, scale }) => {
      try {
        const result = await sendCommandToFigma("export_node_as_image", {
          nodeId,
          format: format || "PNG",
          scale: scale || 1,
        });
        const typedResult = result as { imageData: string; mimeType: string };
        return formatImageResponse(typedResult.imageData, typedResult.mimeType || "image/png");
      } catch (error) {
        return formatErrorResponse("export_node_as_image", error);
      }
    },
  );

  // Retrieve Color Variable Names Tool
  server.tool(
    "retrieve_color_variable_names",
    "Retrieve available color variable names in scope",
    {
      scope: z
        .enum(["fg", "bg", "stroke", "palette"])
        .array()
        .describe("The scope of the color variable names to retrieve"),
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
}

export function registerEditingTools(server: McpServer, figmaClient: FigmaWebSocketClient): void {
  const { sendCommandToFigma } = figmaClient;

  // Clone Node Tool
  server.tool(
    "clone_node",
    "Clone an existing node in Figma",
    {
      nodeId: z.string().describe("The ID of the node to clone"),
      x: z.number().optional().describe("New X position for the clone"),
      y: z.number().optional().describe("New Y position for the clone"),
    },
    async ({ nodeId, x, y }) => {
      try {
        const result = await sendCommandToFigma("clone_node", { nodeId, x, y });
        const typedResult = result as { name: string; id: string };
        return formatTextResponse(
          `Cloned node "${typedResult.name}" with new ID: ${typedResult.id}${x !== undefined && y !== undefined ? ` at position (${x}, ${y})` : ""}`,
        );
      } catch (error) {
        return formatErrorResponse("clone_node", error);
      }
    },
  );

  server.tool(
    "set_fill_color",
    "Set the fill color of a node",
    {
      nodeId: z.string().describe("The ID of the node to set the fill color of"),
      colorToken: z
        .string()
        .describe(
          "The color token to set the fill color to. Format: `{category}/{name}`. Example: `bg/brand`",
        ),
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

  server.tool(
    "set_stroke_color",
    "Set the stroke color of a node",
    {
      nodeId: z.string().describe("The ID of the node to set the stroke color of"),
      colorToken: z
        .string()
        .describe(
          "The color token to set the stroke color to. Format: `{category}/{name}`. Example: `stroke/neutral`",
        ),
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

  server.tool(
    "set_auto_layout",
    "Set the auto layout of a node",
    {
      nodeId: z.string().describe("The ID of the node to set the auto layout of"),
      layoutMode: z.enum(["HORIZONTAL", "VERTICAL"]).optional().describe("The layout mode to set"),
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
      paddingRight: z.number().optional().describe("The padding right to set (when left != right)"),
      paddingTop: z.number().optional().describe("The padding top to set (when top != bottom)"),
      paddingBottom: z
        .number()
        .optional()
        .describe("The padding bottom to set (when top != bottom)"),
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

  server.tool(
    "set_size",
    "Set the size of a node",
    {
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
