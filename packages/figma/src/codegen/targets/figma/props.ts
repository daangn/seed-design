import {
  createPropsTransformer,
  definePropsTransformer,
  type PropsTransformer,
  type ValueTransformer,
} from "@/codegen/core";
import type { StyleService } from "@/entities";
import type {
  NormalizedCornerTrait,
  NormalizedHasChildrenTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedHasGeometryTrait,
  NormalizedHasLayoutTrait,
  NormalizedIsLayerTrait,
  NormalizedTypePropertiesTrait,
} from "@/normalizer";

export interface PropsTransformers {
  containerLayout: PropsTransformer<ContainerLayoutTrait, ContainerLayoutProps>;
  selfLayout: PropsTransformer<SelfLayoutTrait, SelfLayoutProps>;
  radius: PropsTransformer<RadiusTrait, RadiusProps>;
  frameFill: PropsTransformer<FillTrait, FillProps>;
  shapeFill: PropsTransformer<FillTrait, FillProps>;
  textFill: PropsTransformer<FillTrait, FillProps>;
  stroke: PropsTransformer<StrokeTrait, StrokeProps>;
  typeStyle: PropsTransformer<TypeStyleTrait, TypeStyleProps>;
}

export type ContainerLayoutTrait = NormalizedHasFramePropertiesTrait &
  NormalizedHasChildrenTrait &
  NormalizedHasLayoutTrait &
  NormalizedIsLayerTrait;

export type SelfLayoutTrait = NormalizedIsLayerTrait & NormalizedHasLayoutTrait;

export type RadiusTrait = NormalizedCornerTrait & NormalizedIsLayerTrait;

export type FillTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export type StrokeTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export type TypeStyleTrait = NormalizedTypePropertiesTrait & NormalizedIsLayerTrait;

export interface ContainerLayoutProps {
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE";
  layoutWrap?: "WRAP" | "NO_WRAP";
  itemSpacing?: number | string; // string when variable
  paddingTop?: number | string; // string when variable
  paddingBottom?: number | string; // string when variable
  paddingLeft?: number | string; // string when variable
  paddingRight?: number | string; // string when variable
  horizontalPadding?: number | string; // string when variable
  verticalPadding?: number | string; // string when variable
}

type FigmaValueTransformer = ValueTransformer<string, number, number, number>;

export function createContainerLayoutPropsTransformer(
  valueTransformer: FigmaValueTransformer,
): PropsTransformer<ContainerLayoutTrait, ContainerLayoutProps> {
  return createPropsTransformer({
    _types: {
      trait: {} as ContainerLayoutTrait,
      props: {} as ContainerLayoutProps,
    },
    handlers: {
      layoutMode: ({ layoutMode }) => layoutMode ?? "NONE",
      primaryAxisAlignItems: ({ primaryAxisAlignItems }) => primaryAxisAlignItems,
      counterAxisAlignItems: ({ counterAxisAlignItems }) => counterAxisAlignItems,
      layoutWrap: ({ layoutWrap }) => layoutWrap,
      itemSpacing: ({ itemSpacing }) => itemSpacing,
      paddingTop: (node) => valueTransformer.getFormattedValue.paddingTop(node),
      paddingBottom: (node) => valueTransformer.getFormattedValue.paddingBottom(node),
      paddingLeft: (node) => valueTransformer.getFormattedValue.paddingLeft(node),
      paddingRight: (node) => valueTransformer.getFormattedValue.paddingRight(node),
    },
    shorthands: {
      horizontalPadding: ["paddingLeft", "paddingRight"],
      verticalPadding: ["paddingTop", "paddingBottom"],
    },
    defaults: {},
  });
}

export interface SelfLayoutProps {
  layoutGrow?: number;
  layoutAlign?: "STRETCH" | "INHERIT" | "MIN" | "CENTER" | "MAX";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  width?: string | number; // string when variable
  height?: string | number; // string when variable
  minWidth?: string | number; // string when variable
  minHeight?: string | number; // string when variable
  maxWidth?: string | number; // string when variable
  maxHeight?: string | number; // string when variable
}

export function createSelfLayoutPropsTransformer(
  valueTransformer: FigmaValueTransformer,
): PropsTransformer<SelfLayoutTrait, SelfLayoutProps> {
  return createPropsTransformer({
    _types: {
      trait: {} as SelfLayoutTrait,
      props: {} as SelfLayoutProps,
    },
    handlers: {
      layoutGrow: ({ layoutGrow }) => layoutGrow,
      layoutAlign: ({ layoutAlign }) => layoutAlign,
      layoutSizingVertical: ({ layoutSizingVertical }) => layoutSizingVertical,
      layoutSizingHorizontal: ({ layoutSizingHorizontal }) => layoutSizingHorizontal,
      width: (node) => valueTransformer.getFormattedValue.width(node),
      height: (node) => valueTransformer.getFormattedValue.height(node),
      minWidth: (node) => valueTransformer.getFormattedValue.minWidth(node),
      minHeight: (node) => valueTransformer.getFormattedValue.minHeight(node),
      maxWidth: (node) => valueTransformer.getFormattedValue.maxWidth(node),
      maxHeight: (node) => valueTransformer.getFormattedValue.maxHeight(node),
    },
    defaults: {},
  });
}

export interface RadiusProps {
  cornerRadius?: number | string; // string when variable
  topLeftRadius?: number | string; // string when variable
  topRightRadius?: number | string; // string when variable
  bottomLeftRadius?: number | string; // string when variable
  bottomRightRadius?: number | string; // string when variable
}

export function createRadiusPropsTransformer(valueTransformer: FigmaValueTransformer) {
  return createPropsTransformer({
    _types: {
      trait: {} as RadiusTrait,
      props: {} as RadiusProps,
    },
    handlers: {
      topLeftRadius: (node) => valueTransformer.getFormattedValue.topLeftRadius(node),
      topRightRadius: (node) => valueTransformer.getFormattedValue.topRightRadius(node),
      bottomLeftRadius: (node) => valueTransformer.getFormattedValue.bottomLeftRadius(node),
      bottomRightRadius: (node) => valueTransformer.getFormattedValue.bottomRightRadius(node),
    },
    shorthands: {
      cornerRadius: ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"],
    },
    defaults: {
      cornerRadius: 0,
      topLeftRadius: 0,
      topRightRadius: 0,
      bottomLeftRadius: 0,
      bottomRightRadius: 0,
    },
  });
}

export interface FillProps {
  fill?: string;
}

export function createFrameFillPropsTransformer(valueTransformer: FigmaValueTransformer) {
  return definePropsTransformer<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueTransformer.getFormattedValue.frameFill(node);

    return {
      fill,
    };
  });
}

export function createShapeFillPropsTransformer(valueTransformer: FigmaValueTransformer) {
  return definePropsTransformer<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueTransformer.getFormattedValue.shapeFill(node);

    return {
      fill,
    };
  });
}

export function createTextFillPropsTransformer(valueTransformer: FigmaValueTransformer) {
  return definePropsTransformer<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueTransformer.getFormattedValue.textFill(node);

    return {
      fill,
    };
  });
}

export interface StrokeProps {
  stroke?: string;
  strokeWeight?: number;
}

export function createStrokePropsTransformer(
  valueTransformer: FigmaValueTransformer,
): PropsTransformer<StrokeTrait, StrokeProps> {
  return definePropsTransformer((node: StrokeTrait) => {
    const stroke = valueTransformer.getFormattedValue.stroke(node);
    const strokeWeight = node.strokeWeight;

    return {
      stroke,
      strokeWeight,
    };
  });
}

export interface TypeStyleProps {
  textStyle?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  maxLines?: number;
}

export function createTypeStylePropsTransformer({
  valueTransformer,
  styleService,
}: {
  valueTransformer: FigmaValueTransformer;
  styleService: StyleService;
}): PropsTransformer<TypeStyleTrait, TypeStyleProps> {
  return definePropsTransformer((node) => {
    const styleName = node.textStyleKey ? styleService.getStyleName(node.textStyleKey) : undefined;
    const maxLines =
      node.style.textTruncation === "ENDING" ? (node.style.maxLines ?? undefined) : undefined;

    if (styleName) {
      return {
        textStyle: styleName,
        maxLines,
      };
    }

    return {
      fontSize: valueTransformer.getFormattedValue.fontSize(node),
      fontWeight: valueTransformer.getFormattedValue.fontWeight(node),
      lineHeight: valueTransformer.getFormattedValue.lineHeight(node),
      maxLines,
    };
  });
}
