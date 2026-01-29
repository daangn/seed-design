import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import type { FigmaRestClient } from "./figma-rest-client";
import { createFigmaRestClient } from "./figma-rest-client";
import type { FigmaWebSocketClient } from "./websocket";
import type { McpConfig } from "./config";
import { logger } from "./logger";

export interface ToolContext {
  sendCommandToFigma: FigmaWebSocketClient["sendCommandToFigma"] | null;
  restClient: FigmaRestClient | null;
  extend?: McpConfig["extend"];
}

export function createToolContext(
  figmaClient: FigmaWebSocketClient | null,
  config: McpConfig | null,
): ToolContext {
  const pat = process.env["FIGMA_PERSONAL_ACCESS_TOKEN"];

  if (pat) {
    logger.info("initializing REST API client with PAT from environment");
  }

  return {
    sendCommandToFigma: figmaClient?.sendCommandToFigma ?? null,
    restClient: pat ? createFigmaRestClient(pat) : null,
    extend: config?.extend,
  };
}

function resolveRestClient(
  personalAccessToken: string | undefined,
  context: ToolContext,
): FigmaRestClient | null {
  if (personalAccessToken) {
    return createFigmaRestClient(personalAccessToken);
  }

  return context.restClient;
}

export async function fetchNodeData(
  params: { fileKey?: string; nodeId: string; personalAccessToken?: string },
  context: ToolContext,
): Promise<GetFileNodesResponse["nodes"][string]> {
  const { fileKey, nodeId, personalAccessToken } = params;
  const restClient = resolveRestClient(personalAccessToken, context);
  const { sendCommandToFigma } = context;

  if (restClient && fileKey) {
    const response = await restClient.getFileNodes(fileKey, [nodeId]);
    const nodeData = response.nodes[nodeId];

    if (!nodeData) throw new Error(`Node ${nodeId} not found in file ${fileKey}`);

    return nodeData;
  }

  if (sendCommandToFigma) {
    return (await sendCommandToFigma("get_node_info", {
      nodeId,
    })) as GetFileNodesResponse["nodes"][string];
  }

  throw new Error(
    "No connection available. Provide figmaUrl/fileKey with personalAccessToken or FIGMA_PERSONAL_ACCESS_TOKEN, or use WebSocket mode with Figma Plugin.",
  );
}

export async function fetchMultipleNodesData(
  params: { fileKey?: string; nodeIds: string[]; personalAccessToken?: string },
  context: ToolContext,
): Promise<GetFileNodesResponse["nodes"]> {
  const { fileKey, nodeIds, personalAccessToken } = params;
  const restClient = resolveRestClient(personalAccessToken, context);
  const { sendCommandToFigma } = context;

  if (restClient && fileKey) {
    const response = await restClient.getFileNodes(fileKey, nodeIds);

    return response.nodes;
  }

  if (sendCommandToFigma) {
    const results: GetFileNodesResponse["nodes"] = {};

    await Promise.all(
      nodeIds.map(async (nodeId) => {
        const data = (await sendCommandToFigma("get_node_info", {
          nodeId,
        })) as GetFileNodesResponse["nodes"][string];

        results[nodeId] = data;
      }),
    );

    return results;
  }

  throw new Error(
    "No connection available. Provide figmaUrl/fileKey with personalAccessToken or FIGMA_PERSONAL_ACCESS_TOKEN, or use WebSocket mode with Figma Plugin.",
  );
}

export function requireWebSocket(context: ToolContext): asserts context is ToolContext & {
  sendCommandToFigma: NonNullable<ToolContext["sendCommandToFigma"]>;
} {
  if (!context.sendCommandToFigma)
    throw new Error("WebSocket not available. This tool requires Figma Plugin connection.");
}
