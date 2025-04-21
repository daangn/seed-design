export interface CloneNodeParams {
  nodeId: string;
  x?: number;
  y?: number;
}

export interface CloneNodeResult {
  id: string;
  originalId: string;
  x?: number;
  y?: number;
  success: boolean;
}

export async function cloneNode(params: CloneNodeParams): Promise<CloneNodeResult> {
  const { nodeId, x, y } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  // Check if the node type supports cloning
  if (!("clone" in node)) {
    throw new Error(`Node type does not support cloning: ${nodeId}`);
  }

  try {
    // Clone the node using a type assertion since the Figma typings are incomplete
    const clone = (node as any).clone();

    // If x and y are provided, move the clone to that position
    if (x !== undefined && y !== undefined && "x" in clone && "y" in clone) {
      clone.x = x;
      clone.y = y;
    }

    // Add the clone to the same parent as the original
    if (node.parent) {
      node.parent.appendChild(clone);
    } else {
      figma.currentPage.appendChild(clone);
    }

    return {
      id: clone.id,
      originalId: node.id,
      x: "x" in clone ? clone.x : undefined,
      y: "y" in clone ? clone.y : undefined,
      success: true,
    };
  } catch (error) {
    throw new Error(
      `Error cloning node: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
