import type { StyleService, VariableValueResolved } from "@/entities";
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
import { useCodegenOptions } from "./context";

export interface ValueResolver<TColor, TDimension, TFontDimension, TFontWeight> {
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
  getTextStyleValue: (
    node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait,
  ) => string | undefined; // TODO: we might turn this into a generic; not sure yet
}

export interface ValueResolverDeps<TColor, TDimension, TFontDimension, TFontWeight> {
  variableService: VariableService;
  variableNameFormatter: (props: { slug: string[] }) => string;
  styleService: StyleService;
  styleNameFormatter: (props: { slug: string[] }) => string;
  rawValueFormatters: {
    color: (value: RGBA) => string | TColor;
    dimension: (value: number) => string | TDimension;
    fontDimension: (value: number) => string | TFontDimension;
    fontWeight: (value: number) => string | TFontWeight;
  };
}

export function createValueResolver<TColor, TDimension, TFontDimension, TFontWeight>({
  variableService,
  variableNameFormatter,
  styleService,
  styleNameFormatter,
  rawValueFormatters,
}: ValueResolverDeps<TColor, TDimension, TFontDimension, TFontWeight>): ValueResolver<
  TColor,
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
    const { shouldInferVariableName } = useCodegenOptions();

    if (!shouldInferVariableName) {
      return undefined;
    }

    return variableService.infer(value, scope)?.name;
  }

  function getStyleName(key: string) {
    const slug = styleService.getSlug(key);

    if (!slug) {
      return undefined;
    }

    return styleNameFormatter({ slug });
  }

  function processColor(
    key: string | undefined,
    value: RGBA | undefined,
    scope: "FRAME_FILL" | "SHAPE_FILL" | "STROKE_COLOR" | "TEXT_FILL",
  ) {
    if (key) {
      return getVariableName(key);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.color(value);
    }

    return undefined;
  }

  function processDimension(
    key: string | undefined,
    value: number | undefined,
    scope: "WIDTH_HEIGHT" | "GAP" | "CORNER_RADIUS",
  ) {
    if (key) {
      return getVariableName(key);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.dimension(value);
    }

    return undefined;
  }

  function processFontDimension(
    key: string | undefined,
    value: number | undefined,
    scope: "FONT_SIZE" | "LINE_HEIGHT",
  ) {
    if (key) {
      return getVariableName(key);
    }

    if (value !== undefined) {
      return inferVariableName(value, scope) ?? rawValueFormatters.fontDimension(value);
    }

    return undefined;
  }

  function processFontWeight(key: string | undefined, value: number | undefined) {
    if (key) {
      return getVariableName(key);
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

  function getTextStyleValue(node: NormalizedTypePropertiesTrait & NormalizedIsLayerTrait) {
    if (node.textStyleKey) {
      return getStyleName(node.textStyleKey);
    }

    return undefined;
  }

  return {
    getFormattedValue,
    getTextStyleValue,
  };
}
