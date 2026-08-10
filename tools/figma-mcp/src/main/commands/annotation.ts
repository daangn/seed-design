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

export interface ResolvedAnnotationCategory {
  id: string;
  label: string;
  color: AnnotationCategoryColor;
  isPreset: boolean;
}

export interface ResolvedAnnotation extends Omit<Annotation, "categoryId"> {
  category?: ResolvedAnnotationCategory;
}

export interface AnnotatedNode {
  nodeId: string;
  name: string;
  type: BaseNode["type"];
  /**
   * Ancestors between the queried node and this one, outermost first, and empty on the queried
   * node itself. Relative rather than absolute so it matches what the REST path can build from its
   * subtree-only response.
   *
   * Carries `id` because layer names are not unique — a page routinely repeats `Label` or `Slot`
   * across hundreds of nodes — so the names alone read as a breadcrumb but cannot address the
   * ancestor a caller wants to act on.
   */
  path: { id: string; name: string }[];
  annotations: ResolvedAnnotation[];
}

export interface GetAnnotationsParams {
  nodeId: string;
}

export interface GetAnnotationsResult {
  nodes: AnnotatedNode[];
}

/**
 * An `AnnotationCategory` carries `remove`/`setColor`/`setLabel`, so it has to be copied field by
 * field to survive the JSON hop to the MCP server.
 */
function createCategoryResolver() {
  const resolved = new Map<string, ResolvedAnnotationCategory | undefined>();

  return async (categoryId: string) => {
    // A whole subtree usually shares a handful of categories, so each id is looked up once.
    if (!resolved.has(categoryId)) {
      const category = await figma.annotations.getAnnotationCategoryByIdAsync(categoryId);

      resolved.set(
        categoryId,
        category
          ? {
              id: category.id,
              label: category.label,
              color: category.color,
              isPreset: category.isPreset,
            }
          : undefined,
      );
    }

    return resolved.get(categoryId);
  };
}

/**
 * Deliberately not `node.findAll`: it skips the node it is called on, and it only exists on
 * container nodes even though leaf nodes such as TEXT and RECTANGLE carry annotations too. Asking
 * about a frame whose own annotation is the only one would come back empty, and asking about a
 * TEXT node would throw.
 */
async function collectAnnotatedNodes(root: BaseNode) {
  const collected: AnnotatedNode[] = [];
  const resolveCategory = createCategoryResolver();

  const resolveAnnotation = async ({ categoryId, ...annotation }: Annotation) => {
    if (!categoryId) return annotation;

    const category = await resolveCategory(categoryId);

    return { ...annotation, ...(category && { category }) };
  };

  const visit = async (node: BaseNode, path: AnnotatedNode["path"]) => {
    // `documentAccess: "dynamic-page"` keeps a page's children unavailable until it is loaded.
    if (node.type === "PAGE") await node.loadAsync();

    if ("annotations" in node && node.annotations.length > 0) {
      collected.push({
        nodeId: node.id,
        name: node.name,
        type: node.type,
        path,
        annotations: await Promise.all(node.annotations.map(resolveAnnotation)),
      });
    }

    if (!("children" in node)) return;

    const childPath = [...path, { id: node.id, name: node.name }];

    for (const child of node.children) {
      await visit(child, childPath);
    }
  };

  await visit(root, []);

  return collected;
}

// Get annotations on the given node and every node under it
export async function getAnnotations(params: GetAnnotationsParams) {
  const { nodeId } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  return {
    nodes: await collectAnnotatedNodes(node),
  };
}
