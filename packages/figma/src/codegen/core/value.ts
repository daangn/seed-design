import type {
  NormalizedCornerTrait,
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

export interface ValueTransformer<TColor, TDimension, TFontDimension, TFontWeight> {
  getFormattedValue: {
    frameFill: (
      node: NormalizedHasGeometryTrait & NormalizedIsLayerTrait,
    ) => string | TColor | undefined;
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
  };
}

export interface ValueTransformerDeps<TColor, TDimension, TFontDimension, TFontWeight> {
  variableService: VariableService;
  formatters: {
    color: (value: RGBA) => string | TColor;
    dimension: (value: number) => string | TDimension;
    fontDimension: (value: number) => string | TFontDimension;
    fontWeight: (value: number) => string | TFontWeight;
  };
  shouldInferVariableName: boolean;
}

export function createValueTransformer<TColor, TDimension, TFontDimension, TFontWeight>({
  variableService,
  formatters,
  shouldInferVariableName,
}: ValueTransformerDeps<TColor, TDimension, TFontDimension, TFontWeight>): ValueTransformer<
  TColor,
  TDimension,
  TFontDimension,
  TFontWeight
> {
  function processColor(
    key: string | undefined,
    value: RGBA | undefined,
    scope: "FRAME_FILL" | "SHAPE_FILL" | "STROKE_COLOR" | "TEXT_FILL",
  ) {
    if (key) {
      return variableService.getVariableName(key);
    }

    if (value) {
      if (shouldInferVariableName) {
        return variableService.inferVariableName(value, scope) ?? formatters.color(value);
      }

      return formatters.color(value);
    }

    return undefined;
  }

  function processDimension(
    key: string | undefined,
    value: number | undefined,
    scope: "WIDTH_HEIGHT" | "GAP" | "CORNER_RADIUS",
  ) {
    if (key) {
      return variableService.getVariableName(key);
    }

    if (value) {
      if (shouldInferVariableName) {
        return variableService.inferVariableName(value, scope) ?? formatters.dimension(value);
      }

      return formatters.dimension(value);
    }

    return undefined;
  }

  function processFontDimension(
    key: string | undefined,
    value: number | undefined,
    scope: "FONT_SIZE" | "LINE_HEIGHT",
  ) {
    if (key) {
      return variableService.getVariableName(key);
    }

    if (value) {
      if (shouldInferVariableName) {
        return variableService.inferVariableName(value, scope) ?? formatters.fontDimension(value);
      }

      return formatters.fontDimension(value);
    }

    return undefined;
  }

  function processFontWeight(key: string | undefined, value: number | undefined) {
    if (key) {
      return variableService.getVariableName(key);
    }

    if (value) {
      if (shouldInferVariableName) {
        return (
          variableService.inferVariableName(value, "FONT_WEIGHT") ?? formatters.fontWeight(value)
        );
      }

      return formatters.fontWeight(value);
    }

    return undefined;
  }

  const getFormattedValue: ValueTransformer<
    TColor,
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
    frameFill: (node) =>
      processColor(getFirstFillVariable(node)?.id, getFirstSolidFill(node)?.color, "FRAME_FILL"),
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
  };

  return {
    getFormattedValue,
  };
}
