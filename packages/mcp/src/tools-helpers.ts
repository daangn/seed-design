import type {
  Annotation,
  GetFileNodesResponse,
  GetImagesQueryParams,
  Node,
} from "@figma/rest-api-spec";
import type { FigmaRestClient } from "./figma-rest-client";
import { createFigmaRestClient } from "./figma-rest-client";
import type { FigmaWebSocketClient } from "./websocket";
import type { McpConfig } from "./config";

export type ToolMode = "rest" | "websocket" | "all";

export interface ToolContext {
  sendCommandToFigma: FigmaWebSocketClient["sendCommandToFigma"] | null;
  restClient: FigmaRestClient | null;
  mode: ToolMode;
  extend?: McpConfig["extend"];
}

export function createToolContext(
  figmaClient: FigmaWebSocketClient | null,
  restClient: FigmaRestClient | null,
  config: McpConfig | null,
  mode: ToolMode,
): ToolContext {
  return {
    sendCommandToFigma: figmaClient?.sendCommandToFigma ?? null,
    restClient,
    mode,
    extend: config?.extend,
  };
}

function resolveRestClient(
  personalAccessToken: string | undefined,
  context: ToolContext,
): FigmaRestClient | null {
  if (context.mode === "websocket") {
    return null;
  }

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

export const IMAGE_FORMATS = ["PNG", "JPG"] as const;

export type ImageFormat = (typeof IMAGE_FORMATS)[number];

/**
 * The plugin names formats in upper case and the REST API in lower case, so every format needs
 * both spellings plus the MIME type the tool reports back.
 */
const IMAGE_FORMAT = {
  PNG: { restFormat: "png", mimeType: "image/png" },
  JPG: { restFormat: "jpg", mimeType: "image/jpeg" },
} as const satisfies Record<
  ImageFormat,
  { restFormat: NonNullable<GetImagesQueryParams["format"]>; mimeType: string }
>;

export async function fetchNodeImage(
  params: {
    fileKey?: string;
    nodeId: string;
    personalAccessToken?: string;
    format: ImageFormat;
    scale: number;
  },
  context: ToolContext,
) {
  const { fileKey, nodeId, personalAccessToken, format, scale } = params;
  const { restFormat, mimeType } = IMAGE_FORMAT[format];
  const restClient = resolveRestClient(personalAccessToken, context);
  const { sendCommandToFigma } = context;

  if (restClient && fileKey) {
    const imageUrl = await restClient.getNodeImageUrl(fileKey, nodeId, {
      format: restFormat,
      scale,
    });
    const response = await fetch(imageUrl);

    if (!response.ok)
      throw new Error(`Image download failed: ${response.status} ${response.statusText}`);

    return {
      base64: Buffer.from(await response.arrayBuffer()).toString("base64"),
      mimeType,
    };
  }

  if (sendCommandToFigma) {
    const result = (await sendCommandToFigma("export_node_as_image", {
      nodeId,
      format,
      scale,
    })) as { base64: string };

    return { base64: result.base64, mimeType };
  }

  throw new Error(
    "No connection available. Provide figmaUrl/fileKey with personalAccessToken or FIGMA_PERSONAL_ACCESS_TOKEN, or use WebSocket mode with Figma Plugin.",
  );
}

export async function fetchNodeSvg(
  params: {
    fileKey?: string;
    nodeId: string;
    personalAccessToken?: string;
    outlineText: boolean;
  },
  context: ToolContext,
) {
  const { fileKey, nodeId, personalAccessToken, outlineText } = params;
  const restClient = resolveRestClient(personalAccessToken, context);
  const { sendCommandToFigma } = context;

  if (restClient && fileKey) {
    const svgUrl = await restClient.getNodeImageUrl(fileKey, nodeId, {
      format: "svg",
      svg_outline_text: outlineText,
    });
    const response = await fetch(svgUrl);

    if (!response.ok)
      throw new Error(`SVG download failed: ${response.status} ${response.statusText}`);

    return await response.text();
  }

  if (sendCommandToFigma) {
    const result = (await sendCommandToFigma("export_node_as_svg", {
      nodeId,
      outlineText,
    })) as { svg: string };

    return result.svg;
  }

  throw new Error(
    "No connection available. Provide figmaUrl/fileKey with personalAccessToken or FIGMA_PERSONAL_ACCESS_TOKEN, or use WebSocket mode with Figma Plugin.",
  );
}

/**
 * `labelMarkdown` and `category` are absent from `Annotation` because the REST endpoint serializes
 * neither the authored markdown nor the annotation's category; only the plugin, and therefore only
 * the WebSocket path, can read them.
 */
export interface ToolAnnotation extends Annotation {
  labelMarkdown?: string;
  category?: {
    id: string;
    label: string;
    color: string;
    isPreset: boolean;
  };
}

export interface AnnotatedNode {
  nodeId: string;
  annotations: ToolAnnotation[];
}

/**
 * Mirrors the plugin's traversal — the queried node first, then everything under it — so both
 * transports answer the same question.
 */
function collectAnnotatedNodes(root: Node) {
  const collected: AnnotatedNode[] = [];

  const visit = (node: Node) => {
    if ("annotations" in node && node.annotations && node.annotations.length > 0) {
      collected.push({ nodeId: node.id, annotations: node.annotations });
    }

    if (!("children" in node)) return;

    for (const child of node.children) {
      visit(child);
    }
  };

  visit(root);

  return collected;
}

export async function fetchNodeAnnotations(
  params: { fileKey?: string; nodeId: string; personalAccessToken?: string },
  context: ToolContext,
): Promise<AnnotatedNode[]> {
  const { fileKey, nodeId, personalAccessToken } = params;
  const restClient = resolveRestClient(personalAccessToken, context);
  const { sendCommandToFigma } = context;

  if (restClient && fileKey) {
    const response = await restClient.getFileNodes(fileKey, [nodeId]);
    const nodeData = response.nodes[nodeId];

    if (!nodeData) throw new Error(`Node ${nodeId} not found in file ${fileKey}`);

    return collectAnnotatedNodes(nodeData.document);
  }

  if (sendCommandToFigma) {
    const result = (await sendCommandToFigma("get_annotations", { nodeId })) as {
      nodes: AnnotatedNode[];
    };

    return result.nodes;
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
