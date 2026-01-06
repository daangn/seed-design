import type { GetFileNodesResponse } from "@figma/rest-api-spec";

type NodeInfo = GetFileNodesResponse["nodes"][string];

/**
 * Get information about a specific node by ID
 */
export async function getNodeInfo(nodeId: string): Promise<NodeInfo> {
  const node = await figma.getNodeByIdAsync(nodeId);

  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  const exportableNode = node as unknown as {
    exportAsync: (options: ExportSettingsREST) => Promise<NodeInfo>;
  };

  // Check if the node supports export
  if (!("exportAsync" in node)) {
    throw new Error(`Node does not support export: ${nodeId}`);
  }

  const response = await exportableNode.exportAsync({
    format: "JSON_REST_V1",
  });

  return response;
}

/**
 * Get information about multiple nodes by ID
 */
export async function getNodesInfo(nodeIds: string[]): Promise<any[]> {
  try {
    // Load all nodes in parallel
    const nodes = await Promise.all(nodeIds.map((id: string) => figma.getNodeByIdAsync(id)));

    // Filter out any null values (nodes that weren't found)
    const validNodes = nodes.filter((node) => node !== null);

    // Export all valid nodes in parallel
    const responses = await Promise.all(
      validNodes.map(async (node) => {
        try {
          const exportableNode = node as unknown as {
            exportAsync: (options: ExportSettingsREST) => Promise<any>;
          };

          // Check if the node supports export
          if (!("exportAsync" in node)) {
            return { id: node.id, error: "Node does not support export" };
          }

          const data = await exportableNode.exportAsync({
            format: "JSON_REST_V1",
          });

          return { id: node.id, data };
        } catch (error) {
          return { id: node.id, error: error instanceof Error ? error.message : "Unknown error" };
        }
      }),
    );

    return responses;
  } catch (error) {
    throw new Error(
      `Error getting nodes info: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get the current selection in the document
 */
export async function getSelection() {
  return {
    nodes: figma.currentPage.selection.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
    })),
  };
}
