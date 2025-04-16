import { customBase64Encode } from "../utils/base64";

export interface ExportNodeParams {
  nodeId: string;
  scale?: number;
}

export interface ExportNodeResult {
  id: string;
  base64: string;
  mimeType: string;
}

export async function exportNodeAsImage(params: ExportNodeParams): Promise<ExportNodeResult> {
  const { nodeId, scale = 1 } = params || {};

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
      format: "PNG",
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

    const mimeType = "image/png";

    // Encode to base64
    const base64 = customBase64Encode(bytes);

    return {
      id: node.id,
      base64,
      mimeType,
    };
  } catch (error) {
    throw new Error(
      `Error exporting node as image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
