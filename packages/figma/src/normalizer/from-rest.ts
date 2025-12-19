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
  NormalizedVariableAlias,
  NormalizedIsLayerTrait,
  NormalizedCornerTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedPaint,
  NormalizedSolidPaint,
  NormalizedDefaultShapeTrait,
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
  /**
   * A map of variable **ID** to variable data
   */
  variables: Record<string, { key: string }>;
}

export function createRestNormalizer(
  ctx: RestNormalizerContext,
): (node: FigmaRestSpec.Node) => NormalizedSceneNode {
  function normalizeVariableAlias(alias: FigmaRestSpec.VariableAlias): NormalizedVariableAlias {
    const variable = ctx.variables?.[alias.id];
    return {
      type: alias.type,
      key: variable?.key ?? alias.id, // fallback to id if not found
    };
  }

  function normalizeBoundVariables(
    boundVariables: FigmaRestSpec.IsLayerTrait["boundVariables"] | undefined,
  ): NormalizedIsLayerTrait["boundVariables"] {
    if (!boundVariables) return undefined;

    const { size, componentProperties: _componentProperties, ...rest } = boundVariables;

    const needsResolution = [
      "fills",
      "itemSpacing",
      "counterAxisSpacing",
      "bottomLeftRadius",
      "bottomRightRadius",
      "topLeftRadius",
      "topRightRadius",
      "paddingBottom",
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "maxHeight",
      "minHeight",
      "maxWidth",
      "minWidth",
    ];

    const entries = Object.entries(rest)
      .filter(([key, value]) => value && needsResolution.includes(key))
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.map(normalizeVariableAlias)];
        }
        return [key, normalizeVariableAlias(value as FigmaRestSpec.VariableAlias)];
      });

    const resolved = Object.fromEntries(entries);

    return {
      ...resolved,
      ...(size && {
        size: {
          ...(size.x && { x: normalizeVariableAlias(size.x) }),
          ...(size.y && { y: normalizeVariableAlias(size.y) }),
        },
      }),
    };
  }

  function normalizeSolidPaint(paint: FigmaRestSpec.SolidPaint): NormalizedSolidPaint {
    return {
      type: paint.type,
      color: paint.color,
      visible: paint.visible,
      blendMode: paint.blendMode,
      opacity: paint.opacity,
      ...(paint.boundVariables?.color && {
        boundVariables: {
          color: normalizeVariableAlias(paint.boundVariables.color),
        },
      }),
    };
  }

  function normalizePaint(paint: FigmaRestSpec.Paint): NormalizedPaint {
    switch (paint.type) {
      case "SOLID":
        return normalizeSolidPaint(paint);
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
      fills: normalizePaints(node.fills),
      fillStyleKey: node.styles?.["fill"] ? ctx.styles[node.styles["fill"]]?.key : undefined,
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight,
      effects: normalizeEffects(node.effects),
      effectStyleKey: node.styles?.["effect"] ? ctx.styles[node.styles["effect"]]?.key : undefined,
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

  function normalizeNodes(nodes: readonly FigmaRestSpec.Node[]): NormalizedSceneNode[] {
    // Figma REST API omits default values for some fields, "visible" is one of them
    return nodes.filter((node) => !("visible" in node) || node.visible).map(normalizeNode);
  }

  function normalizeNode(node: FigmaRestSpec.Node): NormalizedSceneNode {
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
      id: node.id,
      original: node,
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

  function normalizeGroupNode(node: FigmaRestSpec.GroupNode): NormalizedFrameNode {
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
      effects: normalizeEffects(node.effects),
      effectStyleKey: node.styles?.["effect"] ? ctx.styles[node.styles["effect"]]?.key : undefined,

      // NormalizedHasChildrenTrait
      children: normalizeNodes(node.children),
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
      style: node.style,
      characters: node.characters,
      textStyleKey: node.styles?.["text"] ? ctx.styles[node.styles["text"]]?.key : undefined,
      segments: segmentTextNode(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...normalizeShapeProps(node),
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
        }

        const swappedComponentSet = swappedComponent?.componentSetId
          ? ctx.componentSets[swappedComponent.componentSetId]
          : undefined;

        if (swappedComponentSet) {
          componentProperties[key].componentSetKey = swappedComponentSet.key;
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

  function normalizeEffects(effects: FigmaRestSpec.Effect[] | undefined): NormalizedShadow[] {
    if (!effects) return [];

    return effects
      .filter(
        (effect): effect is FigmaRestSpec.DropShadowEffect | FigmaRestSpec.InnerShadowEffect =>
          effect.visible !== false &&
          (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"),
      )
      .map((effect): NormalizedShadow => {
        const { type, color, offset, radius, spread, boundVariables } = effect;
        return {
          type,
          color,
          offset,
          radius,
          spread,
          ...(boundVariables && {
            // Filter out undefined values to match plugin behavior
            boundVariables: Object.fromEntries(
              Object.entries(boundVariables)
                .filter(([_, value]) => value)
                .map(([key, value]) => [key, normalizeVariableAlias(value)]),
            ),
          }),
        };
      });
  }

  return normalizeNode;
}
