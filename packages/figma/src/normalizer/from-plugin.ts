/**
 * from-plugin is guaranteed to be run in the Figma Plugin environment
 * so we can use the Plugin API types directly (figma.getNodeByIdAsync, node.getMainComponentAsync etc)
 * however it could be better to make users can DI later
 */

import type {
  NormalizedSceneNode,
  NormalizedFrameNode,
  NormalizedRectangleNode,
  NormalizedTextNode,
  NormalizedComponentNode,
  NormalizedInstanceNode,
  NormalizedVectorNode,
  NormalizedBooleanOperationNode,
  NormalizedHasEffectsTrait,
  NormalizedShadow,
  NormalizedDefaultShapeTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedCornerTrait,
  NormalizedIsLayerTrait,
  NormalizedPaint,
  NormalizedTextSegment,
} from "./types";
import { convertTransformToGradientHandles } from "@/utils/figma-gradient";

export function createPluginNormalizer(): (node: SceneNode) => Promise<NormalizedSceneNode> {
  async function normalizeNodes(nodes: readonly SceneNode[]): Promise<NormalizedSceneNode[]> {
    return Promise.all(nodes.filter((node) => node.visible).map(normalizeNode));
  }

  async function normalizeNode(node: SceneNode): Promise<NormalizedSceneNode> {
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

  /**
   * Pick specific fields from boundVariables
   */
  function normalizeBoundVariables({
    boundVariables,
  }: Pick<FrameNode, "boundVariables">): NormalizedIsLayerTrait["boundVariables"] {
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
      size: {
        x: boundVariables.width,
        y: boundVariables.height,
      },
    };
  }

  function normalizeSolidPaint(paint: SolidPaint): NormalizedPaint {
    return {
      type: paint.type,
      color: {
        r: paint.color.r,
        g: paint.color.g,
        b: paint.color.b,
        a: paint.opacity ?? 1,
      },
      visible: paint.visible,
      blendMode: paint.blendMode ?? "NORMAL",
      opacity: paint.opacity,
      boundVariables: paint.boundVariables,
    };
  }

  function normalizePaint(paint: Paint): NormalizedPaint {
    switch (paint.type) {
      case "SOLID":
        return normalizeSolidPaint(paint);
      case "IMAGE":
        return {
          type: "IMAGE",
          scaleMode: paint.scaleMode === "CROP" ? "STRETCH" : paint.scaleMode,
          imageTransform: paint.imageTransform,
          scalingFactor: paint.scalingFactor,
          filters: paint.filters,
          rotation: paint.rotation,
          imageRef: paint.imageHash ?? "",
          blendMode: paint.blendMode ?? "NORMAL",
          visible: paint.visible,
          opacity: paint.opacity,
        };
      case "GRADIENT_LINEAR":
      case "GRADIENT_RADIAL":
      case "GRADIENT_ANGULAR":
      case "GRADIENT_DIAMOND":
        return {
          type: paint.type,
          gradientStops: [...paint.gradientStops],
          visible: paint.visible,
          opacity: paint.opacity,
          blendMode: paint.blendMode ?? "NORMAL",
          gradientHandlePositions: convertTransformToGradientHandles(paint.gradientTransform),
        };
      default:
        throw new Error(`Unimplemented paint type: ${paint.type}`);
    }
  }

  function normalizePaints(fills: readonly Paint[] | PluginAPI["mixed"]): NormalizedPaint[] {
    if (fills === figma.mixed) {
      console.warn("Mixed fills are not supported");

      return [];
    }

    return fills.map(normalizePaint);
  }

  function normalizeRadiusProps(
    node: Pick<
      RectangleNode,
      "cornerRadius" | "topLeftRadius" | "topRightRadius" | "bottomRightRadius" | "bottomLeftRadius"
    >,
  ): NormalizedCornerTrait {
    return {
      cornerRadius: node.cornerRadius === figma.mixed ? undefined : node.cornerRadius,
      rectangleCornerRadii: [
        node.topLeftRadius,
        node.topRightRadius,
        node.bottomRightRadius,
        node.bottomLeftRadius,
      ],
    };
  }

  async function normalizeEffectProps(
    node: Pick<RectangleNode, "effects" | "effectStyleId">,
  ): Promise<NormalizedHasEffectsTrait> {
    const effectStyleKey =
      typeof node.effectStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.effectStyleId))?.key
        : undefined;

    const effects = node.effects
      .filter((effect): effect is DropShadowEffect | InnerShadowEffect => {
        if (!effect.visible) return false;

        return effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW";
      })
      .map(({ blendMode, visible, ...rest }): NormalizedShadow => rest);

    return {
      ...(effectStyleKey ? { effectStyleKey } : {}),
      effects,
    };
  }

  async function normalizeShapeProps(
    node: Pick<
      RectangleNode,
      | "fills"
      | "fillStyleId"
      | "strokes"
      | "strokeWeight"
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
      | "effectStyleId"
    > &
      Partial<Pick<FrameNode, "inferredAutoLayout">>,
  ): Promise<Omit<NormalizedDefaultShapeTrait, keyof NormalizedIsLayerTrait>> {
    const fillStyleKey =
      typeof node.fillStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.fillStyleId))?.key
        : undefined;

    return {
      // NormalizedHasLayoutTrait
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight ?? undefined,
      minWidth: node.minWidth ?? undefined,
      maxHeight: node.maxHeight ?? undefined,
      maxWidth: node.maxWidth ?? undefined,

      // NormalizedHasGeometryTrait
      fills: await normalizePaints(node.fills),
      fillStyleKey,
      strokes: await normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight === figma.mixed ? undefined : node.strokeWeight,

      // NormalizedHasEffectsTrait
      ...(await normalizeEffectProps(node)),
    };
  }

  async function normalizeAutolayoutProps(
    node: Omit<FrameNode, "type" | "clone">,
  ): Promise<NormalizedHasFramePropertiesTrait> {
    return {
      layoutMode: node.inferredAutoLayout?.layoutMode ?? node.layoutMode,
      layoutWrap: node.inferredAutoLayout?.layoutWrap ?? node.layoutWrap,
      paddingLeft: node.inferredAutoLayout?.paddingLeft ?? node.paddingLeft,
      paddingRight: node.inferredAutoLayout?.paddingRight ?? node.paddingRight,
      paddingTop: node.inferredAutoLayout?.paddingTop ?? node.paddingTop,
      paddingBottom: node.inferredAutoLayout?.paddingBottom ?? node.paddingBottom,
      primaryAxisAlignItems:
        node.inferredAutoLayout?.primaryAxisAlignItems ?? node.primaryAxisAlignItems,
      counterAxisAlignItems:
        node.inferredAutoLayout?.counterAxisAlignItems ?? node.counterAxisAlignItems,
      primaryAxisSizingMode:
        node.inferredAutoLayout?.primaryAxisSizingMode ?? node.primaryAxisSizingMode,
      counterAxisSizingMode:
        node.inferredAutoLayout?.counterAxisSizingMode ?? node.counterAxisSizingMode,
      itemSpacing: node.inferredAutoLayout?.itemSpacing ?? node.itemSpacing,
      counterAxisSpacing:
        node.inferredAutoLayout?.counterAxisSpacing ?? node.counterAxisSpacing ?? undefined,
    };
  }

  async function normalizeFrameNode(node: FrameNode): Promise<NormalizedFrameNode> {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...(await normalizeAutolayoutProps(node)),

      // NormalizedHasChildrenTrait
      children: await normalizeNodes(node.children),
    };
  }

  async function normalizeRectangleNode(node: RectangleNode): Promise<NormalizedRectangleNode> {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),
    };
  }

  async function normalizeTextNode(node: TextNode): Promise<NormalizedTextNode> {
    const segments = node.getStyledTextSegments([
      "fontName",
      "fontWeight",
      "fontSize",
      "letterSpacing",
      "lineHeight",
      "paragraphSpacing",
      "textStyleId",
      "fills",
      "boundVariables",
      "textDecoration",
    ]);
    const first = segments[0];

    const textStyleKey =
      typeof node.textStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.textStyleId))?.key
        : undefined;

    const normalizeLetterSpacing = (
      letterSpacing: LetterSpacing,
      fontSize: number,
    ): NormalizedTextSegment["style"]["letterSpacing"] => {
      if (letterSpacing.unit === "PIXELS") return letterSpacing.value;
      if (letterSpacing.unit === "PERCENT") return (fontSize * letterSpacing.value) / 100;

      return undefined;
    };

    const normalizeLineHeight = (
      lineHeight: LineHeight,
      fontSize: number,
    ): NormalizedTextSegment["style"]["lineHeight"] => {
      if (lineHeight.unit === "PIXELS") return lineHeight.value;
      if (lineHeight.unit === "PERCENT") return (fontSize * lineHeight.value) / 100;

      return undefined;
    };

    const isItalic = (fontName: FontName): boolean => {
      // {
      //   family: "SF Mono",
      //   style: "Bold Italic"
      // }
      return fontName.style.toLowerCase().includes("italic");
    };

    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedTypePropertiesTrait
      // NOTE: this normalization is incomplete compared to from-rest.ts normalizer
      style: {
        fontFamily: first.fontName.family,
        fontPostScriptName: null,
        fontStyle: first.fontName.style,
        italic: isItalic(first.fontName),
        fontWeight: first.fontWeight,
        fontSize: first.fontSize,
        textAlignHorizontal: node.textAlignHorizontal,
        textAlignVertical: node.textAlignVertical,
        letterSpacing: normalizeLetterSpacing(first.letterSpacing, first.fontSize),
        paragraphSpacing: first.paragraphSpacing,
        textDecoration: first.textDecoration,
        lineHeightPx: normalizeLineHeight(first.lineHeight, first.fontSize),
        lineHeightUnit:
          first.lineHeight.unit === "PIXELS"
            ? "PIXELS"
            : first.lineHeight.unit === "PERCENT"
              ? "FONT_SIZE_%"
              : undefined,
        boundVariables: first.boundVariables,
        maxLines: node.maxLines ?? undefined,
      },
      characters: node.characters,
      textStyleKey,
      segments: segments.map((segment) => ({
        characters: segment.characters,
        start: segment.start,
        end: segment.end,
        style: {
          fontSize: segment.fontSize,
          fontWeight: segment.fontWeight,
          fontFamily: segment.fontName.family,
          italic: isItalic(segment.fontName),
          letterSpacing: normalizeLetterSpacing(segment.letterSpacing, segment.fontSize),
          lineHeight: normalizeLineHeight(segment.lineHeight, segment.fontSize),
          textDecoration: segment.textDecoration,
        },
      })),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),
    };
  }

  async function normalizeComponentNode(node: ComponentNode): Promise<NormalizedComponentNode> {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...(await normalizeAutolayoutProps(node)),

      // NormalizedHasChildrenTrait
      children: await normalizeNodes(node.children),
    };
  }

  async function normalizeInstanceNode(node: InstanceNode): Promise<NormalizedInstanceNode> {
    const mainComponent = await node.getMainComponentAsync();
    if (!mainComponent) {
      throw new Error("Instance node has no main component");
    }

    const componentProperties: NormalizedInstanceNode["componentProperties"] = {};

    for (const [key, value] of Object.entries(node.componentProperties)) {
      componentProperties[key] = value;

      if (value.type === "INSTANCE_SWAP") {
        // unless value.type === "BOOLEAN", value.value is string
        const swappedComponent = (await figma.getNodeByIdAsync(
          value.value as string,
        )) as ComponentNode;

        if (swappedComponent) {
          componentProperties[key].componentKey = swappedComponent.key;

          if (swappedComponent.parent?.type === "COMPONENT_SET") {
            componentProperties[key].componentSetKey = swappedComponent.parent.key;
          }
        }
      }
    }

    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),

      // NormalizedCornerTrait
      ...normalizeRadiusProps(node),

      // NormalizedHasFramePropertiesTrait
      ...(await normalizeAutolayoutProps(node)),

      // NormalizedHasChildrenTrait
      children: await normalizeNodes(node.children),

      // NormalizedInstanceNode specific
      componentProperties,
      componentKey: mainComponent.key,
      componentSetKey:
        mainComponent.parent?.type === "COMPONENT_SET" ? mainComponent.parent.key : undefined,
      overrides: node.overrides,
    };
  }

  async function normalizeVectorNode(node: VectorNode): Promise<NormalizedVectorNode> {
    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedCornerTrait
      cornerRadius: node.cornerRadius === figma.mixed ? undefined : node.cornerRadius,
      rectangleCornerRadii: undefined, // VectorNode does not have individual corner radii

      // NormalizedHasLayoutTrait, NormalizedHasGeometryTrait, NormalizedHasEffectsTrait
      ...(await normalizeShapeProps(node)),
    };
  }

  async function normalizeBooleanOperationNode(
    node: BooleanOperationNode,
  ): Promise<NormalizedBooleanOperationNode> {
    const fillStyleKey =
      typeof node.fillStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.fillStyleId))?.key
        : undefined;

    return {
      // NormalizedIsLayerTrait
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedHasLayoutTrait
      layoutGrow: node.layoutGrow as 0 | 1 | undefined,
      layoutAlign: node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight ?? undefined,
      minWidth: node.minWidth ?? undefined,
      maxHeight: node.maxHeight ?? undefined,
      maxWidth: node.maxWidth ?? undefined,

      // NormalizedHasGeometryTrait
      fills: await normalizePaints(node.fills),
      fillStyleKey,
      strokes: await normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight === figma.mixed ? undefined : node.strokeWeight,

      // NormalizedHasEffectsTrait
      ...(await normalizeEffectProps(node)),

      // NormalizedHasChildrenTrait
      children: await normalizeNodes(node.children),
    };
  }

  async function normalizeGroupNodeAsFrameNode(
    node: GroupNode & { inferredAutoLayout?: FrameNode["inferredAutoLayout"] },
  ): Promise<NormalizedFrameNode> {
    return {
      // NormalizedIsLayerTrait
      type: "FRAME",
      id: node.id,
      name: node.name,
      boundVariables: normalizeBoundVariables(node),

      // NormalizedHasLayoutTrait
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      minHeight: node.minHeight ?? undefined,
      minWidth: node.minWidth ?? undefined,
      maxHeight: node.maxHeight ?? undefined,
      maxWidth: node.maxWidth ?? undefined,

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
      layoutMode: node.inferredAutoLayout?.layoutMode,
      layoutWrap: node.inferredAutoLayout?.layoutWrap,
      paddingLeft: node.inferredAutoLayout?.paddingLeft,
      paddingRight: node.inferredAutoLayout?.paddingRight,
      paddingTop: node.inferredAutoLayout?.paddingTop,
      paddingBottom: node.inferredAutoLayout?.paddingBottom,
      primaryAxisAlignItems: node.inferredAutoLayout?.primaryAxisAlignItems,
      counterAxisAlignItems: node.inferredAutoLayout?.counterAxisAlignItems,
      primaryAxisSizingMode: node.inferredAutoLayout?.primaryAxisSizingMode,
      counterAxisSizingMode: node.inferredAutoLayout?.counterAxisSizingMode,
      itemSpacing: node.inferredAutoLayout?.itemSpacing,
      counterAxisSpacing: node.inferredAutoLayout?.counterAxisSpacing ?? undefined,

      // NormalizedHasChildrenTrait
      children: await normalizeNodes(node.children),
    };
  }

  return normalizeNode;
}
