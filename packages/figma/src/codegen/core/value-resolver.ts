import type { StyleService, VariableValueResolved } from "@/entities";
import type {
  NormalizedCornerTrait,
  NormalizedHasEffectsTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedHasGeometryTrait,
  NormalizedHasLayoutTrait,
  NormalizedIsLayerTrait,
  NormalizedTypePropertiesTrait,
} from "@/normalizer";
import {
  getFirstFillVariable,
  getFirstSolidFill,
  getFirstStroke,
  getFirstStrokeVariable,
} from "@/utils/figma-node";
import type { RGBA } from "@figma/rest-api-spec";
import type { VariableService } from "../../entities/variable.service";

export interface ValueResolver<TColor, TGradient, TDimension, TFontDimension, TFontWeight> {
  getFormattedValue: {
    frameFill: (
      node: NormalizedHasGeometryTrait & NormalizedIsLayerTrait,
    ) => string | TColor | TGradient | undefined;
    shapeFill: (
      node: NormalizedHasGeometryTrait & NormalizedIsLayerTrait,
    ) => string | TColor | undefined;
    textFill: (
      node: NormalizedHasGeometryTrait & NormalizedIsLayerTrait,
    ) => string | TColor | undefined;
    stroke: (
      node: NormalizedHasGeometryTrait & NormalizedIsLayerTrait,
    ) => string | TColor | undefined;
    width: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    height: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    minWidth: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    minHeight: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    maxWidth: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    maxHeight: (
      node: NormalizedHasLayoutTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    paddingLeft: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    paddingRight: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    paddingTop: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    paddingBottom: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    itemSpacing: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    counterAxisSpacing: (
      node: NormalizedHasFramePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    topLeftRadius: (
      node: NormalizedCornerTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    topRightRadius: (
      node: NormalizedCornerTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    bottomLeftRadius: (
      node: NormalizedCornerTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    bottomRightRadius: (
      node: NormalizedCornerTrait & NormalizedIsLayerTrait,
    ) => string | TDimension | undefined;
    fontSize: (
      node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TFontDimension | undefined;
    fontWeight: (
      node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TFontWeight | undefined;
    lineHeight: (
      node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait,
    ) => string | TFontDimension | undefined;
    boxShadow: (node: NormalizedHasEffectsTrait & NormalizedIsLayerTrait) => string | undefined;
  };
  getTextStyleValue: (
    node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait,
  ) => string | undefined; // TODO: we might turn this into a generic; not sure yet
  getEffectStyleValue: (
    node: NormalizedHasEffectsTrait & NormalizedIsLayerTrait,
  ) => string | undefined;
}

export interface ValueResolverDeps<TColor, TGradient, TDimension, TFontDimension, TFontWeight> {
  variableService: VariableService;
  variableNameFormatter: (props: { slug: string[] }) => string;
  styleService: StyleService;
  textStyleNameFormatter: (props: { slug: string[] }) => string;
  effectStyleNameFormatter: (props: { slug: string[] }) => string;
  fillStyleResolver: (props: { slug: string[] }) => TGradient | undefined;
  rawValueFormatters: {
    color: (value: RGBA) => string | TColor;
    dimension: (value: number) => string | TDimension;
    fontDimension: (value: number) => string | TFontDimension;
    fontWeight: (value: number) => string | TFontWeight;
    boxShadow: (value: {
      type: "DROP_SHADOW" | "INNER_SHADOW";
      color: RGBA;
      offset: { x: number; y: number };
      radius: number;
      spread?: number;
    }) => string;
  };
  shouldInferVariableName: boolean;
}

export function createValueResolver<TColor, TGradient, TDimension, TFontDimension, TFontWeight>({
  variableService,
  variableNameFormatter,
  styleService,
  textStyleNameFormatter,
  effectStyleNameFormatter,
  fillStyleResolver,
  rawValueFormatters,
  shouldInferVariableName,
}: ValueResolverDeps<TColor, TGradient, TDimension, TFontDimension, TFontWeight>): ValueResolver<
  TColor,
  TGradient,
  TDimension,
  TFontDimension,
  TFontWeight
> {
  function getVariableName(key: string) {
    const slug = variableService.getSlug(key);

    if (!slug) {
      return undefined;
    }

    return variableNameFormatter({ slug });
  }

  function inferVariableName(value: VariableValueResolved, scope: VariableScope) {
    if (!shouldInferVariableName) {
      return undefined;
    }

    try {
      const inferred = variableService.infer(value, scope);

      if (!inferred) {
        return undefined;
      }

      return getVariableName(inferred.key);
    } catch {
      return undefined;
    }
  }

  function processColor(
    id: string | undefined,
    value: RGBA | undefined,
    scope: "FRAME_FILL" | "SHAPE_FILL" | "STROKE_COLOR" | "TEXT_FILL",
  ) {
    if (id) {
      return getVariableName(id);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.color(value);
    }

    return undefined;
  }

  function processFillStyle(key: string) {
    const slug = styleService.getSlug(key);

    if (!slug) {
      return undefined;
    }

    return fillStyleResolver({ slug });
  }

  function processDimension(
    id: string | undefined,
    value: number | undefined,
    scope: "WIDTH_HEIGHT" | "GAP" | "CORNER_RADIUS",
  ) {
    if (id) {
      return getVariableName(id);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.dimension(value);
    }

    return undefined;
  }

  function processFontDimension(
    id: string | undefined,
    value: number | undefined,
    scope: "FONT_SIZE" | "LINE_HEIGHT",
  ) {
    if (id) {
      return getVariableName(id);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.fontDimension(value);
    }

    return undefined;
  }

  function processFontWeight(id: string | undefined, value: number | undefined) {
    if (id) {
      return getVariableName(id);
    }

    if (value !== undefined) {
      const fontWeightToString: Record<number, string> = {
        100: "thin",
        200: "extra-light",
        300: "light",
        400: "regular",
        500: "medium",
        600: "semi-bold",
        700: "bold",
        800: "extra-bold",
        900: "black",
      };

      return (
        inferVariableName(value, "FONT_WEIGHT") ??
        inferVariableName(fontWeightToString[value], "FONT_STYLE") ??
        rawValueFormatters.fontWeight(value)
      );
    }

    return undefined;
  }

  const getFormattedValue: ValueResolver<
    TColor,
    TGradient,
    TDimension,
    TFontDimension,
    TFontWeight
  >["getFormattedValue"] = {
    width: (node) =>
      processDimension(
        node.boundVariables?.size?.x?.id,
        node.absoluteBoundingBox?.width,
        "WIDTH_HEIGHT",
      ),
    height: (node) =>
      processDimension(
        node.boundVariables?.size?.y?.id,
        node.absoluteBoundingBox?.height,
        "WIDTH_HEIGHT",
      ),
    minWidth: (node) =>
      processDimension(node.boundVariables?.minWidth?.id, node.minWidth, "WIDTH_HEIGHT"),
    minHeight: (node) =>
      processDimension(node.boundVariables?.minHeight?.id, node.minHeight, "WIDTH_HEIGHT"),
    maxWidth: (node) =>
      processDimension(node.boundVariables?.maxWidth?.id, node.maxWidth, "WIDTH_HEIGHT"),
    maxHeight: (node) =>
      processDimension(node.boundVariables?.maxHeight?.id, node.maxHeight, "WIDTH_HEIGHT"),
    paddingLeft: (node) =>
      processDimension(node.boundVariables?.paddingLeft?.id, node.paddingLeft, "GAP"),
    paddingRight: (node) =>
      processDimension(node.boundVariables?.paddingRight?.id, node.paddingRight, "GAP"),
    paddingTop: (node) =>
      processDimension(node.boundVariables?.paddingTop?.id, node.paddingTop, "GAP"),
    paddingBottom: (node) =>
      processDimension(node.boundVariables?.paddingBottom?.id, node.paddingBottom, "GAP"),
    itemSpacing: (node) =>
      processDimension(node.boundVariables?.itemSpacing?.id, node.itemSpacing, "GAP"),
    counterAxisSpacing: (node) =>
      processDimension(node.boundVariables?.counterAxisSpacing?.id, node.counterAxisSpacing, "GAP"),
    frameFill: (node) =>
      node.fillStyleKey
        ? processFillStyle(node.fillStyleKey)
        : processColor(
            getFirstFillVariable(node)?.id,
            getFirstSolidFill(node)?.color,
            "FRAME_FILL",
          ),
    shapeFill: (node) =>
      processColor(getFirstFillVariable(node)?.id, getFirstSolidFill(node)?.color, "SHAPE_FILL"),
    textFill: (node) =>
      processColor(getFirstFillVariable(node)?.id, getFirstSolidFill(node)?.color, "TEXT_FILL"),
    stroke: (node) =>
      processColor(getFirstStrokeVariable(node)?.id, getFirstStroke(node)?.color, "STROKE_COLOR"),
    topLeftRadius: (node) =>
      processDimension(
        node.boundVariables?.topLeftRadius?.id,
        node.rectangleCornerRadii?.[0] ?? node.cornerRadius,
        "CORNER_RADIUS",
      ),
    topRightRadius: (node) =>
      processDimension(
        node.boundVariables?.topRightRadius?.id,
        node.rectangleCornerRadii?.[1] ?? node.cornerRadius,
        "CORNER_RADIUS",
      ),
    bottomLeftRadius: (node) =>
      processDimension(
        node.boundVariables?.bottomLeftRadius?.id,
        node.rectangleCornerRadii?.[2] ?? node.cornerRadius,
        "CORNER_RADIUS",
      ),
    bottomRightRadius: (node) =>
      processDimension(
        node.boundVariables?.bottomRightRadius?.id,
        node.rectangleCornerRadii?.[3] ?? node.cornerRadius,
        "CORNER_RADIUS",
      ),
    fontSize: (node) =>
      processFontDimension(
        node.boundVariables?.fontSize?.[0]?.id,
        node.style.fontSize,
        "FONT_SIZE",
      ),
    fontWeight: (node) =>
      processFontWeight(node.boundVariables?.fontWeight?.[0]?.id, node.style.fontWeight),
    lineHeight: (node) =>
      processFontDimension(
        node.boundVariables?.lineHeight?.[0]?.id,
        node.style.lineHeightPx,
        "LINE_HEIGHT",
      ),
    boxShadow: (node) => {
      if (node.effects.length === 0) return undefined;

      return node.effects.map(rawValueFormatters.boxShadow).join(", ");
    },
  };

  function getTextStyleValue(node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait) {
    if (!node.textStyleKey) return undefined;

    const slug = styleService.getSlug(node.textStyleKey);

    if (!slug) {
      return undefined;
    }

    return textStyleNameFormatter({ slug });
  }

  function getEffectStyleValue(node: NormalizedHasEffectsTrait & NormalizedIsLayerTrait) {
    if (!node.effectStyleKey) return undefined;

    const slug = styleService.getSlug(node.effectStyleKey);

    if (!slug) {
      return undefined;
    }

    return effectStyleNameFormatter({ slug });
  }

  return {
    getFormattedValue,
    getTextStyleValue,
    getEffectStyleValue,
  };
}
