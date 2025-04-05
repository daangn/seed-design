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
} from "./types";

export function createPluginNormalizer() {
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
      ...normalizeAutolayoutProps(node),
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
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
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
      ...normalizeShapeProps(node),
    };
  }

  async function normalizeVectorNode(node: VectorNode): Promise<NormalizedVectorNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeShapeProps(node),
    };
  }

  async function normalizeBooleanOperationNode(
    node: BooleanOperationNode,
  ): Promise<NormalizedBooleanOperationNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      children: await normalizeNodes(node.children),
      ...normalizeShapeProps(node),
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
    ]);
    const first = segments[0]!;

    const textStyleKey =
      typeof node.textStyleId === "string"
        ? (await figma.getStyleByIdAsync(node.textStyleId))?.key
        : undefined;

    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      style: {
        fontSize: first.fontSize,
        fontWeight: first.fontWeight,
        fontFamily: first.fontName.family,
        // TODO: handle other units
        letterSpacing:
          first.letterSpacing.unit === "PIXELS" ? first.letterSpacing.value : undefined,
        lineHeightPx: first.lineHeight.unit === "PIXELS" ? first.lineHeight.value : undefined,
        paragraphSpacing: first.paragraphSpacing,
        textAlignHorizontal: node.textAlignHorizontal,
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
          letterSpacing:
            segment.letterSpacing.unit === "PIXELS" ? segment.letterSpacing.value : undefined,
          lineHeightPx: segment.lineHeight.unit === "PIXELS" ? segment.lineHeight.value : undefined,
        },
      })),
      ...normalizeShapeProps(node),
    };
  }

  async function normalizeComponentNode(node: ComponentNode): Promise<NormalizedComponentNode> {
    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...normalizeAutolayoutProps(node),
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
        }
      }
    }

    return {
      type: node.type,
      id: node.id,
      name: node.name,
      boundVariables: await normalizeBoundVariables(node),
      ...normalizeRadiusProps(node),
      ...normalizeAutolayoutProps(node),
      children: await normalizeNodes(node.children),
      componentKey: mainComponent.key,
      componentSetKey:
        mainComponent.parent?.type === "COMPONENT_SET" ? mainComponent.parent.key : undefined,
      componentProperties,
    };
  }

  function normalizeSolidPaint(paint: SolidPaint): FigmaRestSpec.SolidPaint {
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
    if (paint.type === "SOLID") {
      return normalizeSolidPaint(paint);
    }
    if (paint.type === "IMAGE") {
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
    }
    throw new Error(`Unimplemented paint type: ${paint.type}`);
  }

  function normalizePaints(fills: readonly Paint[] | PluginAPI["mixed"]): FigmaRestSpec.Paint[] {
    if (fills === figma.mixed) {
      throw new Error("Mixed fills are not supported");
    }

    return fills.map(normalizePaint);
  }

  function normalizeRadiusProps(
    node: Pick<
      RectangleNode,
      "cornerRadius" | "topLeftRadius" | "topRightRadius" | "bottomRightRadius" | "bottomLeftRadius"
    >,
  ) {
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

  function normalizeShapeProps(
    node: Pick<
      RectangleNode,
      | "fills"
      | "strokes"
      | "strokeWeight"
      | "layoutGrow"
      | "layoutAlign"
      | "layoutSizingHorizontal"
      | "layoutSizingVertical"
      | "absoluteBoundingBox"
      | "minHeight"
      | "minWidth"
      | "maxHeight"
      | "maxWidth"
    > &
      Partial<Pick<FrameNode, "inferredAutoLayout">>,
  ) {
    return {
      layoutGrow: (node.inferredAutoLayout?.layoutGrow ?? node.layoutGrow) as 0 | 1 | undefined,
      layoutAlign: node.inferredAutoLayout?.layoutAlign ?? node.layoutAlign,
      layoutSizingHorizontal: node.layoutSizingHorizontal,
      layoutSizingVertical: node.layoutSizingVertical,
      absoluteBoundingBox: node.absoluteBoundingBox,
      fills: normalizePaints(node.fills),
      strokes: normalizePaints(node.strokes),
      strokeWeight: node.strokeWeight === figma.mixed ? undefined : node.strokeWeight,
      minHeight: node.minHeight ?? undefined,
      minWidth: node.minWidth ?? undefined,
      maxHeight: node.maxHeight ?? undefined,
      maxWidth: node.maxWidth ?? undefined,
    };
  }

  function normalizeAutolayoutProps(node: Omit<FrameNode, "type" | "clone">) {
    return {
      ...normalizeShapeProps(node),
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

  async function normalizeBoundVariables(node: Pick<FrameNode, "boundVariables">) {
    return {
      ...node.boundVariables,
      fills: await Promise.all(
        node.boundVariables?.fills?.map((fill) =>
          figma.variables.getVariableByIdAsync(fill.id).then((res) => {
            return {
              ...fill,
              id: res?.key ?? fill.id,
            };
          }),
        ) ?? [],
      ),
      size: {
        x: node.boundVariables?.width,
        y: node.boundVariables?.height,
      },
    };
  }

  return normalizeNode;
}
