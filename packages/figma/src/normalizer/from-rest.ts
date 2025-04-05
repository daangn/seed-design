import type * as FigmaRestSpec from "@figma/rest-api-spec";
import type {
  NormalizedSceneNode,
  NormalizedFrameNode,
  NormalizedRectangleNode,
  NormalizedTextNode,
  NormalizedComponentNode,
  NormalizedInstanceNode,
  NormalizedTextSegment,
  NormalizedVectorNode,
  NormalizedBooleanOperationNode,
} from "./types";

export interface RestNormalizerContext {
  styles: Record<string, FigmaRestSpec.Style>;
  components: Record<string, FigmaRestSpec.Component>;
  componentSets: Record<string, FigmaRestSpec.ComponentSet>;
}

export function createRestNormalizer(ctx: RestNormalizerContext) {
  function normalizeNodes(nodes: readonly FigmaRestSpec.SubcanvasNode[]): NormalizedSceneNode[] {
    // Figma REST API omits default values for some fields, "visible" is one of them
    return nodes.filter((node) => !("visible" in node) || node.visible).map(normalizeNode);
  }

  function normalizeNode(node: FigmaRestSpec.SubcanvasNode): NormalizedSceneNode {
    if (node.type === "FRAME") {
      return normalizeFrameNode(node);
    }
    if (node.type === "GROUP") {
      return normalizeGroupNode(node);
    }
    if (node.type === "RECTANGLE") {
      return normalizeRectangleNode(node);
    }
    if (node.type === "VECTOR") {
      return normalizeVectorNode(node);
    }
    if (node.type === "BOOLEAN_OPERATION") {
      return normalizeBooleanOperationNode(node);
    }
    if (node.type === "TEXT") {
      return normalizeTextNode(node);
    }
    if (node.type === "COMPONENT") {
      return normalizeComponentNode(node);
    }
    if (node.type === "INSTANCE") {
      return normalizeInstanceNode(node);
    }

    return {
      type: "UNHANDLED",
      original: node,
    };
  }

  function normalizeFrameNode(node: FigmaRestSpec.FrameNode): NormalizedFrameNode {
    return {
      ...node,
      children: normalizeNodes(node.children),
    };
  }

  function normalizeGroupNode(node: FigmaRestSpec.GroupNode): NormalizedFrameNode {
    return {
      ...node,
      type: "FRAME",
      children: normalizeNodes(node.children),
    };
  }

  function normalizeRectangleNode(node: FigmaRestSpec.RectangleNode): NormalizedRectangleNode {
    return node;
  }

  function normalizeVectorNode(node: FigmaRestSpec.VectorNode): NormalizedVectorNode {
    return node;
  }

  function normalizeBooleanOperationNode(
    node: FigmaRestSpec.BooleanOperationNode,
  ): NormalizedBooleanOperationNode {
    return {
      ...node,
      children: normalizeNodes(node.children),
    };
  }

  function normalizeTextNode(node: FigmaRestSpec.TextNode): NormalizedTextNode {
    // Function to segment a text node based on style overrides
    function segmentTextNode(textNode: FigmaRestSpec.TextNode): NormalizedTextSegment[] {
      const segments: NormalizedTextSegment[] = [];
      const characters = textNode.characters;
      const styleOverrides = textNode.characterStyleOverrides || [];
      const styleTable = textNode.styleOverrideTable || {};

      // If no style overrides, return the entire text as one segment
      if (!styleOverrides.length) {
        return [
          {
            characters: characters,
            start: 0,
            end: characters.length,
            style: textNode.style || {},
          },
        ];
      }

      let currentSegment: NormalizedTextSegment = {
        characters: "",
        start: 0,
        end: 0,
        style: {},
      };

      let currentStyleId: string | null = null;

      for (let i = 0; i < characters.length; i++) {
        const styleId = styleOverrides[i]?.toString() || null;

        // If style changes or it's the first character
        if (styleId !== currentStyleId || i === 0) {
          // Add the previous segment if it exists
          if (i > 0) {
            currentSegment.end = i;
            currentSegment.characters = characters.substring(
              currentSegment.start,
              currentSegment.end,
            );
            segments.push({ ...currentSegment });
          }

          // Start a new segment
          currentStyleId = styleId;
          currentSegment = {
            characters: "",
            start: i,
            end: 0,
            style: styleId ? styleTable[styleId] || {} : {},
          };
        }
      }

      // Add the last segment
      if (currentSegment.start < characters.length) {
        currentSegment.end = characters.length;
        currentSegment.characters = characters.substring(currentSegment.start, currentSegment.end);
        segments.push(currentSegment);
      }

      return segments;
    }

    return {
      ...node,
      textStyleKey: node.styles?.["text"] ? ctx.styles[node.styles["text"]]?.key : undefined,
      segments: segmentTextNode(node),
    };
  }

  function normalizeComponentNode(node: FigmaRestSpec.ComponentNode): NormalizedComponentNode {
    return {
      ...node,
      children: normalizeNodes(node.children),
    };
  }

  function normalizeInstanceNode(node: FigmaRestSpec.InstanceNode): NormalizedInstanceNode {
    const mainComponent = ctx.components[node.componentId];
    if (!mainComponent) {
      throw new Error(`Component ${node.componentId} not found`);
    }
    const componentSet = mainComponent.componentSetId
      ? ctx.componentSets[mainComponent.componentSetId]
      : undefined;
    const componentProperties: NormalizedInstanceNode["componentProperties"] = {};

    for (const [key, value] of Object.entries(node.componentProperties ?? {})) {
      componentProperties[key] = value;
      if (value.type === "INSTANCE_SWAP") {
        const mainComponent = ctx.components[value.value as string];
        if (mainComponent) {
          componentProperties[key].componentKey = mainComponent.key;
        }
      }
    }

    return {
      ...node,
      children: normalizeNodes(node.children),
      componentKey: mainComponent.key,
      componentSetKey: componentSet?.key,
      componentProperties,
    };
  }

  return normalizeNode;
}
