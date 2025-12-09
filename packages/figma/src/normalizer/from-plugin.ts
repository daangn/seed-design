/**
 * from-plugin is guaranteed to be run in the Figma Plugin environment
 * so we can use the Plugin API types directly (figma.getNodeByIdAsync etc)
 * however it could be better to make users can DI later
 */

import type * as FigmaRestSpec from "@figma/rest-api-spec";
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
  NormalizedVariableAlias,
  NormalizedCornerTrait,
  NormalizedIsLayerTrait,
} from "./types";
import { convertTransformToGradientHandles } from "@/utils/figma-gradient";

export function createPluginNormalizer(): (node: SceneNode) => Promise<NormalizedSceneNode> {
  async function normalizeNodes(nodes: readonly SceneNode[]): Promise<NormalizedSceneNode[]> {
    return Promise.all(nodes.filter((node) => node.visible).map(normalizeNode));
  }

  async function normalizeNode(node: SceneNode): Promise<NormalizedSceneNode> {
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

  async function normalizeFrameNode(node: FrameNode): Promise<NormalizedFrameNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...(await normalizeAutolayoutProps(node)),
      children: await normalizeNodes(node.children),
    };
  }

  async function normalizeGroupNode(
    node: GroupNode & { inferredAutoLayout?: FrameNode["inferredAutoLayout"] },
  ): Promise<NormalizedFrameNode> {
    return {
      type: "FRAME",
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      cornerRadius: undefined,
      rectangleCornerRadii: undefined,
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
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
      fills: [],
      strokes: [],
      effects: [],
      children: await normalizeNodes(node.children),
    };
  }

  async function normalizeRectangleNode(node: RectangleNode): Promise<NormalizedRectangleNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...(await normalizeShapeProps(node)),
    };
  }

  async function normalizeVectorNode(node: VectorNode): Promise<NormalizedVectorNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      cornerRadius: node.cornerRadius === figma.mixed ? undefined : node.cornerRadius,
      rectangleCornerRadii: undefined,
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
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
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
      fills: normalizePaints(node.fills),
      ...(fillStyleKey ? { fillStyleKey } : {}),
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight === figma.mixed ? undefined : node.strokeWeight,
      children: await normalizeNodes(node.children),
    };
  }
  async function normalizeTextNode(node: TextNode): Promise<NormalizedTextNode> {
    const segments = node.getStyledTextSegments([
      "fontSize",
      "fontWeight",
      "fontName",
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
      ls: typeof first.letterSpacing,
      fontSize: number,
    ): number | undefined => {
      if (ls.unit === "PIXELS") return ls.value;
      if (ls.unit === "PERCENT") return (fontSize * ls.value) / 100;

      return undefined;
    };

    const normalizeLineHeight = (
      lh: typeof first.lineHeight,
      fontSize: number,
    ): number | undefined => {
      if (lh.unit === "PIXELS") return lh.value;
      if (lh.unit === "PERCENT") return (fontSize * lh.value) / 100;

      return undefined;
    };

    const isItalic = (fontName: FontName): boolean => {
      return fontName.style.toLowerCase().includes("italic");
    };

    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
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
        textDecoration: segments[0].textDecoration,
        lineHeightPx: normalizeLineHeight(first.lineHeight, first.fontSize),
        lineHeightUnit:
          first.lineHeight.unit === "PIXELS"
            ? "PIXELS"
            : first.lineHeight.unit === "PERCENT"
              ? "FONT_SIZE_%"
              : undefined,
      },
      ...(textStyleKey ? { textStyleKey } : {}),
      characters: node.characters,
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
      ...(await normalizeShapeProps(node)),
    };
  }

  async function normalizeComponentNode(node: ComponentNode): Promise<NormalizedComponentNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...(await normalizeAutolayoutProps(node)),
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
        const mainComponent = (await figma.getNodeByIdAsync(
          value.value as string,
        )) as ComponentNode;
        if (mainComponent) {
          componentProperties[key].componentKey = mainComponent.key;
          if (mainComponent.parent?.type === "COMPONENT_SET") {
            componentProperties[key].componentSetKey = mainComponent.parent.key;
          }
        }
      }
    }

    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...(await normalizeAutolayoutProps(node)),
      children: await normalizeNodes(node.children),
      componentKey: mainComponent.key,
      componentSetKey:
        mainComponent.parent?.type === "COMPONENT_SET" ? mainComponent.parent.key : undefined,
      componentProperties,
      overrides: node.overrides,
    };
  }

  function normalizeSolidPaint(
    paint: SolidPaint,
  ): FigmaRestSpec.SolidPaint & { boundVariables?: SolidPaint["boundVariables"] } {
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
      boundVariables: paint.boundVariables,
    };
  }

  function normalizePaint(paint: Paint): FigmaRestSpec.Paint {
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

  function normalizePaints(fills: readonly Paint[] | PluginAPI["mixed"]): FigmaRestSpec.Paint[] {
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
  ): Promise<Omit<NormalizedDefaultShapeTrait, "type" | "id" | "name" | "boundVariables">> {
    const fillStyleKey =
      typeof node.fillStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.fillStyleId))?.key
        : undefined;

    return {
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      relativeTransform: node.relativeTransform,
      layoutPositioning: node.layoutPositioning,
      fills: normalizePaints(node.fills),
      ...(fillStyleKey ? { fillStyleKey } : {}),
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight === figma.mixed ? undefined : node.strokeWeight,
      minHeight: node.minHeight ?? undefined,
      minWidth: node.minWidth ?? undefined,
      maxHeight: node.maxHeight ?? undefined,
      maxWidth: node.maxWidth ?? undefined,
      ...(await normalizeEffectProps(node)),
    };
  }

  async function normalizeEffectProps(
    node: Pick<RectangleNode, "effects" | "effectStyleId">,
  ): Promise<NormalizedHasEffectsTrait> {
    const effectStyleKey =
      typeof node.effectStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.effectStyleId))?.key
        : undefined;

    const effects = (
      await Promise.all(
        node.effects.map(async (effect) => {
          if (!effect.visible) return null;

          switch (effect.type) {
            case "DROP_SHADOW":
            case "INNER_SHADOW": {
              const { type, color, offset, radius, boundVariables, spread } = effect;

              return {
                type,
                color,
                offset,
                radius,
                spread,
                ...(boundVariables && {
                  boundVariables: Object.fromEntries(
                    await Promise.all(
                      Object.entries(boundVariables)
                        // Figma API sometimes includes null values in boundVariables
                        .filter(([_, value]) => value)
                        .map(async ([key, value]) => [key, await normalizeVariableAlias(value)]),
                    ),
                  ),
                }),
              } satisfies NormalizedShadow;
            }
            case "BACKGROUND_BLUR":
            case "GLASS":
            case "LAYER_BLUR":
            case "NOISE":
            case "TEXTURE": {
              return null;
            }
            default:
              // @ts-expect-error
              throw new Error(`Unimplemented effect type: ${effect.type}`);
          }
        }),
      )
    ).filter((effect) => effect !== null);

    return {
      ...(effectStyleKey ? { effectStyleKey } : {}),
      // ...(effects.length > 0 ? { effects } : {}),
      effects,
    };
  }

  async function normalizeAutolayoutProps(
    node: Omit<FrameNode, "type" | "clone">,
  ): Promise<
    NormalizedHasFramePropertiesTrait &
      Omit<NormalizedDefaultShapeTrait, "type" | "id" | "name" | "boundVariables">
  > {
    return {
      ...(await normalizeShapeProps(node)),
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

  async function normalizeVariableAlias({
    id,
    type,
  }: VariableAlias): Promise<NormalizedVariableAlias> {
    return {
      type,
      key: (await figma.variables.getVariableByIdAsync(id))?.key ?? id,
    };
  }

  /**
   * normalize bound variables to have variable keys instead of ids
   */
  async function normalizeBoundVariables({
    boundVariables,
  }: Pick<FrameNode, "boundVariables">): Promise<NormalizedIsLayerTrait["boundVariables"]> {
    if (!boundVariables) return undefined;

    const { width, height, componentProperties: _componentProperties, ...rest } = boundVariables;

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

    const entries = await Promise.all(
      Object.entries(rest)
        // Figma API sometimes includes null values in boundVariables
        .filter(([key, value]) => value && needsResolution.includes(key))
        .map(async ([key, value]) => {
          if (Array.isArray(value))
            return [key, await Promise.all(value.map(normalizeVariableAlias))];

          return [key, await normalizeVariableAlias(value)];
        }),
    );

    const resolved: Omit<NormalizedFrameNode["boundVariables"], "width" | "height"> =
      Object.fromEntries(entries);

    return {
      ...resolved,
      ...(width &&
        height && {
          size: {
            x: await normalizeVariableAlias(width),
            y: await normalizeVariableAlias(height),
          },
        }),
    };
  }

  return normalizeNode;
}
