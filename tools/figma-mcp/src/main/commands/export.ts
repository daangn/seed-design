import { customBase64Encode } from "../utils/base64";

const MIME_TYPE = {
  PNG: "image/png",
  JPG: "image/jpeg",
} as const;

function resolveFormat(format: unknown): keyof typeof MIME_TYPE {
  // `@seed-design/mcp` releases before 2.2 offered SVG and PDF, which this command never honoured
  // — it always exported PNG. Those clients label the response from their own request, so handing
  // them real SVG bytes would leave the payload contradicting its `mimeType`.
  if (format === "JPG") return "JPG";

  return "PNG";
}

export interface ExportNodeParams {
  nodeId: string;
  format?: string;
  scale?: number;
}

export interface ExportNodeResult {
  id: string;
  base64: string;
  mimeType: string;
}

export async function exportNodeAsImage(params: ExportNodeParams): Promise<ExportNodeResult> {
  const { nodeId, scale = 1 } = params || {};
  const format = resolveFormat(params?.format);

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  try {
    // Create export settings
    const settings: ExportSettings = {
      format,
      constraint: {
        type: "SCALE",
        value: scale,
      },
    };

    const exportableNode = node as unknown as {
      exportAsync: (settings: ExportSettings) => Promise<Uint8Array>;
    };

    if (!("exportAsync" in node)) {
      throw new Error(`Node does not support export: ${nodeId}`);
    }

    const bytes = await exportableNode.exportAsync(settings);

    // Encode to base64
    const base64 = customBase64Encode(bytes);

    return {
      id: node.id,
      base64,
      mimeType: MIME_TYPE[format],
    };
  } catch (error) {
    throw new Error(
      `Error exporting node as image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export interface ExportNodeSvgParams {
  nodeId: string;
  outlineText?: boolean;
}

export interface ExportNodeSvgResult {
  id: string;
  svg: string;
}

export async function exportNodeAsSvg(params: ExportNodeSvgParams): Promise<ExportNodeSvgResult> {
  const { nodeId, outlineText = false } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("exportAsync" in node)) {
    throw new Error(`Node does not support export: ${nodeId}`);
  }

  try {
    // `SVG_STRING` resolves to a string rather than the `Uint8Array` every other format returns,
    // so there is no base64 round trip here.
    const svg = await node.exportAsync({ format: "SVG_STRING", svgOutlineText: outlineText });

    return {
      id: node.id,
      svg,
    };
  } catch (error) {
    throw new Error(
      `Error exporting node as SVG: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
