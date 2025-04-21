export interface AddAnnotation {
  nodeId: string;
  labelMarkdown: string;
}

export interface AddAnnotationsParams {
  annotations: AddAnnotation[];
}

export interface AddAnnotationsResult {
  success: boolean;
}

export async function addAnnotations(params: AddAnnotationsParams) {
  const { annotations } = params;

  for (const annotation of annotations) {
    const { nodeId, labelMarkdown } = annotation;

    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    if (!("annotations" in node)) {
      throw new Error(`Node does not support annotations: ${nodeId}`);
    }

    try {
      node.annotations = [
        ...node.annotations,
        {
          labelMarkdown,
        },
      ];
    } catch {
      node.annotations = [
        {
          labelMarkdown,
        },
      ];
    }
  }

  return {
    success: true,
  };
}

export interface GetAnnotation {
  nodeId: string;
  labelMarkdowns: string[];
}

export interface GetAnnotationsParams {
  nodeId: string;
}

export interface GetAnnotationsResult {
  annotations: GetAnnotation[];
}

// Get annotations under given node id
export async function getAnnotations(params: GetAnnotationsParams) {
  const { nodeId } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  if (!("findAll" in node)) {
    throw new Error(`Node does not support findAll: ${nodeId}`);
  }

  const nodeWithAnnotations = node.findAll(
    (node) => "annotations" in node && node.annotations.length > 0,
  ) as Array<SceneNode & AnnotationsMixin>;

  const annotations = nodeWithAnnotations.map((node) => ({
    nodeId: node.id,
    labelMarkdowns: node.annotations.map((annotation) => annotation.labelMarkdown),
  }));

  return {
    annotations,
  };
}
