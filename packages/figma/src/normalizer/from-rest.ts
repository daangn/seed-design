/**
 * from-rest could be run outside of the Figma Plugin environment
 * so we cannot use the Plugin API types directly e.g. getNodeByIdAsync
 */

/**
 * NOTE: types of MinimalFillsTrait["styles"] can be found here:
 * https://developers.figma.com/docs/rest-api/component-types/#style-type
 * Record<"text" | "fill" | "stroke" | "effect" | "grid", string>
 */

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
  NormalizedShadow,
  NormalizedCornerTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedPaint,
  NormalizedDefaultShapeTrait,
  NormalizedHasEffectsTrait,
  NormalizedIsLayerTrait,
} from "./types";

export interface RestNormalizerContext {
  /**
   * A map of style **ID** to style data
   */
  styles: Record<string, FigmaRestSpec.Style>;
  /**
   * A map of component **ID** to component data
   */
  components: Record<string, FigmaRestSpec.Component>;
  /**
   * A map of component set **ID** to component set data
   */
  componentSets: Record<string, FigmaRestSpec.ComponentSet>;
}

export function createRestNormalizer(
  ctx: RestNormalizerContext,
): (node: FigmaRestSpec.Node) => NormalizedSceneNode {
  function normalizeNodes(nodes: readonly FigmaRestSpec.Node[]): NormalizedSceneNode[] {
    // Figma REST API omits default values for some fields, "visible" is one of them
    return nodes.filter((node) => !("visible" in node) || node.visible).map(normalizeNode);
  }

  function normalizeNode(node: FigmaRestSpec.Node): NormalizedSceneNode {
    switch (node.type) {
      case "FRAME":
        return normalizeFrameNode(node);
      case "RECTANGLE":
        return normalizeRectangleNode(node);
      case "TEXT":
        return normalizeTextNode(node);
      case "COMPONENT":
        return normalizeComponentNode(node);
      case "INSTANCE":
        return normalizeInstanceNode(node);
      case "VECTOR":
        return normalizeVectorNode(node);
      case "BOOLEAN_OPERATION":
        return normalizeBooleanOperationNode(node);
      case "GROUP":
        return normalizeGroupNodeAsFrameNode(node);
      default:
        return {
          type: "UNHANDLED",
          id: node.id,
          original: node,
        };
    }
  }

  function normalizeBoundVariables(
    boundVariables: FigmaRestSpec.IsLayerTrait["boundVariables"] | undefined,
  ) {
    if (!boundVariables) return undefined;

    return {
      fills: boundVariables.fills,
      strokes: boundVariables.strokes,
      itemSpacing: boundVariables.itemSpacing,
      counterAxisSpacing: boundVariables.counterAxisSpacing,
      topLeftRadius: boundVariables.topLeftRadius,
      topRightRadius: boundVariables.topRightRadius,
      bottomLeftRadius: boundVariables.bottomLeftRadius,
      bottomRightRadius: boundVariables.bottomRightRadius,
      paddingTop: boundVariables.paddingTop,
      paddingRight: boundVariables.paddingRight,
      paddingBottom: boundVariables.paddingBottom,
      paddingLeft: boundVariables.paddingLeft,
      minWidth: boundVariables.minWidth,
      maxWidth: boundVariables.maxWidth,
      minHeight: boundVariables.minHeight,
      maxHeight: boundVariables.maxHeight,
      fontSize: boundVariables.fontSize,
      fontWeight: boundVariables.fontWeight,
      lineHeight: boundVariables.lineHeight,
      size: boundVariables.size,
    };
  }

  function normalizePaint(paint: FigmaRestSpec.Paint): NormalizedPaint {
    switch (paint.type) {
      case "SOLID":
      case "IMAGE":
      case "GRADIENT_LINEAR":
      case "GRADIENT_RADIAL":
      case "GRADIENT_ANGULAR":
      case "GRADIENT_DIAMOND":
        return paint;
      default:
        throw new Error(`Unimplemented paint type: ${paint.type}`);
    }
  }

  function normalizePaints(paints: FigmaRestSpec.Paint[] | undefined): NormalizedPaint[] {
    if (!paints) return [];

    return paints.map(normalizePaint);
  }

  function normalizeRadiusProps({
    cornerRadius,
    rectangleCornerRadii,
  }: Pick<
    FigmaRestSpec.RectangleNode,
    "cornerRadius" | "rectangleCornerRadii"
  >): NormalizedCornerTrait {
    return { cornerRadius, rectangleCornerRadii };
  }

  function normalizeEffectProps(
    node: Pick<FigmaRestSpec.FrameNode, "effects" | "styles">,
  ): NormalizedHasEffectsTrait {
    const effects = (node.effects ?? [])
      .filter(
        (effect): effect is FigmaRestSpec.DropShadowEffect | FigmaRestSpec.InnerShadowEffect =>
          effect.visible !== false &&
          (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"),
      )
      .map((effect): NormalizedShadow => {
        const { type, color, offset, radius, spread, boundVariables } = effect;

        return {
          // remove fallback when resolved: https://github.com/figma/rest-api-spec/issues/84
          type: type ?? "INNER_SHADOW",
          color,
          offset,
          radius,
          spread,
          boundVariables,
        };
      });

    return {
      effects,
      effectStyleKey: node.styles?.["effect"] ? ctx.styles[node.styles["effect"]]?.key : undefined,
    };
  }

  function normalizeShapeProps(
    node: Pick<
      FigmaRestSpec.FrameNode,
      | "fills"
      | "strokes"
      | "strokeWeight"
      | "styles"
      | "layoutGrow"
      | "layoutAlign"
      | "layoutSizingHorizontal"
      | "layoutSizingVertical"
      | "absoluteBoundingBox"
      | "relativeTransform"
      | "layoutPositioning"
      | "minHeight"
      | "minWidth"
      | "maxHeight"
      | "maxWidth"
      | "effects"
    >,
  ): Omit<NormalizedDefaultShapeTrait, keyof NormalizedIsLayerTrait> {
    return {
      // NormalizedHasLayoutTrait
      layoutGrow: node.layoutGrow,
      layoutAlign: node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight,
      minWidth: node.minWidth,
      maxHeight: node.maxHeight,
      maxWidth: node.maxWidth,

      // NormalizedHasGeometryTrait
      fills: normalizePaints(node.fills),
      fillStyleKey: node.styles?.["fill"] ? ctx.styles[node.styles["fill"]]?.key : undefined,
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight,

      // NormalizedHasEffectsTrait
      ...normalizeEffectProps(node),
    };
  }

  function normalizeAutolayoutProps(
    node: Pick<
      FigmaRestSpec.FrameNode,
      | "layoutMode"
      | "layoutWrap"
      | "paddingLeft"
      | "paddingRight"
      | "paddingTop"
      | "paddingBottom"
      | "primaryAxisAlignItems"
      | "primaryAxisSizingMode"
      | "counterAxisAlignItems"
      | "counterAxisSizingMode"
      | "itemSpacing"
      | "counterAxisSpacing"
    >,
  ): NormalizedHasFramePropertiesTrait {
    return {
      layoutMode: node.layoutMode,
      layoutWrap: node.layoutWrap,
      paddingLeft: node.paddingLeft,
      paddingRight: node.paddingRight,
      paddingTop: node.paddingTop,
      paddingBottom: node.paddingBottom,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisAlignItems: node.counterAxisAlignItems,
      counterAxisSizingMode: node.counterAxisSizingMode,
      itemSpacing: node.itemSpacing,
      counterAxisSpacing: node.counterAxisSpacing,
    };
  }

  function normalizeFrameNode(node: FigmaRestSpec.FrameNode): NormalizedFrameNode {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait, NormalizedHasFramePropertiesTrait
      ...normalizeShapeProps(node),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...normalizeAutolayoutProps(node),

      // NormalizedHasChildrenTrait
      children: normalizeNodes(node.children),
    };
  }

  function normalizeRectangleNode(node: FigmaRestSpec.RectangleNode): NormalizedRectangleNode {
    return {
      //  NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),
    };
  }

  function normalizeTextNode(node: FigmaRestSpec.TextNode): NormalizedTextNode {
    // Convert TypeStyle to NormalizedTextSegment.style format
    function normalizeSegmentStyle(
      typeStyle: FigmaRestSpec.TypeStyle,
    ): NormalizedTextSegment["style"] {
      return {
        fontFamily: typeStyle.fontFamily,
        fontWeight: typeStyle.fontWeight,
        fontSize: typeStyle.fontSize,
        italic: typeStyle.italic,
        textDecoration: typeStyle.textDecoration,
        letterSpacing: typeStyle.letterSpacing,
        lineHeight: typeStyle.lineHeightPx,
      };
    }

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
            style: normalizeSegmentStyle(textNode.style),
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
            style: styleId ? normalizeSegmentStyle(styleTable[styleId]) : {},
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
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedTypePropertiesTrait
      style: node.style, // this style is the style of the first segment
      characters: node.characters,
      textStyleKey: node.styles?.["text"] ? ctx.styles[node.styles["text"]]?.key : undefined,
      segments: segmentTextNode(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),
    };
  }

  function normalizeComponentNode(node: FigmaRestSpec.ComponentNode): NormalizedComponentNode {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),

      // NormalizedHasCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...normalizeAutolayoutProps(node),

      // NormalizedHasChildrenTrait
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
        // unless value.type === "BOOLEAN", value.value is string
        const swappedComponent = ctx.components[value.value as string];

        if (swappedComponent) {
          componentProperties[key].componentKey = swappedComponent.key;

          const swappedComponentSet = swappedComponent?.componentSetId
            ? ctx.componentSets[swappedComponent.componentSetId]
            : undefined;

          if (swappedComponentSet) {
            componentProperties[key].componentSetKey = swappedComponentSet.key;
          }
        }
      }
    }

    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...normalizeAutolayoutProps(node),

      // NormalizedHasChildrenTrait
      children: normalizeNodes(node.children),

      // NormalizedInstanceNode specific
      componentProperties,
      componentKey: mainComponent.key,
      componentSetKey: componentSet?.key,
      overrides: node.overrides,
    };
  }

  function normalizeVectorNode(node: FigmaRestSpec.VectorNode): NormalizedVectorNode {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),
    };
  }

  function normalizeBooleanOperationNode(
    node: FigmaRestSpec.BooleanOperationNode,
  ): NormalizedBooleanOperationNode {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedHasLayoutTrait
      layoutGrow: node.layoutGrow,
      layoutAlign: node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight,
      minWidth: node.minWidth,
      maxHeight: node.maxHeight,
      maxWidth: node.maxWidth,

      // NormalizedHasGeometryTrait
      fills: normalizePaints(node.fills),
      fillStyleKey: node.styles?.["fill"] ? ctx.styles[node.styles["fill"]]?.key : undefined,
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight,

      // NormalizedHasEffectsTrait
      ...normalizeEffectProps(node),

      // NormalizedHasChildrenTrait
      children: normalizeNodes(node.children),
    };
  }

  function normalizeGroupNodeAsFrameNode(node: FigmaRestSpec.GroupNode): NormalizedFrameNode {
    return {
      // NormalizedIsLayerTrait
      type: "FRAME",
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node.boundVariables),

      // NormalizedHasLayoutTrait
      layoutGrow: node.layoutGrow,
      layoutAlign: node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight,
      minWidth: node.minWidth,
      maxHeight: node.maxHeight,
      maxWidth: node.maxWidth,

      // NormalizedHasGeometryTrait
      fills: [],
      fillStyleKey: undefined,
      strokes: [],
      strokeWeight: undefined,

      // NormalizedHasEffectsTrait
      effects: [],
      effectStyleKey: undefined,

      // NormalizedCornerTrait
      cornerRadius: undefined,
      rectangleCornerRadii: undefined,

      // NormalizedHasFramePropertiesTrait
      // these are undefined compared to from-plugin normalizer
      // since inferredAutoLayout isn't available in REST API
      layoutMode: undefined,
      layoutWrap: undefined,
      paddingLeft: undefined,
      paddingRight: undefined,
      paddingTop: undefined,
      paddingBottom: undefined,
      primaryAxisAlignItems: undefined,
      primaryAxisSizingMode: undefined,
      counterAxisAlignItems: undefined,
      counterAxisSizingMode: undefined,
      itemSpacing: undefined,
      counterAxisSpacing: undefined,

      // NormalizedHasChildrenTrait
      children: normalizeNodes(node.children),
    };
  }

  return normalizeNode;
}
