import { createPropsConverter, definePropsConverter, type PropsConverter } from "@/codegen/core";
import type {
  NormalizedCornerTrait,
  NormalizedHasChildrenTrait,
  NormalizedHasEffectsTrait,
  NormalizedHasFramePropertiesTrait,
  NormalizedHasGeometryTrait,
  NormalizedHasLayoutTrait,
  NormalizedIsLayerTrait,
  NormalizedTypePropertiesTrait,
} from "@/normalizer";
import type { FigmaValueResolver } from "./value-resolver";

export interface PropsConverters {
  containerLayout: PropsConverter<ContainerLayoutTrait, ContainerLayoutProps>;
  selfLayout: PropsConverter<SelfLayoutTrait, SelfLayoutProps>;
  radius: PropsConverter<RadiusTrait, RadiusProps>;
  frameFill: PropsConverter<FillTrait, FillProps>;
  shapeFill: PropsConverter<FillTrait, FillProps>;
  textFill: PropsConverter<FillTrait, FillProps>;
  stroke: PropsConverter<StrokeTrait, StrokeProps>;
  shadow: PropsConverter<ShadowTrait, ShadowProps>;
  typeStyle: PropsConverter<TypeStyleTrait, TypeStyleProps>;
}

export type ContainerLayoutTrait = NormalizedHasFramePropertiesTrait &
  NormalizedHasChildrenTrait &
  NormalizedHasLayoutTrait &
  NormalizedIsLayerTrait;

export type SelfLayoutTrait = NormalizedIsLayerTrait & NormalizedHasLayoutTrait;

export type RadiusTrait = NormalizedCornerTrait & NormalizedIsLayerTrait;

export type FillTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export type StrokeTrait = NormalizedIsLayerTrait & NormalizedHasGeometryTrait;

export type ShadowTrait = NormalizedIsLayerTrait & NormalizedHasEffectsTrait;

export type TypeStyleTrait = NormalizedTypePropertiesTrait & NormalizedIsLayerTrait;

export interface ContainerLayoutProps {
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  primaryAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "CENTER" | "MAX" | "BASELINE";
  layoutWrap?: "WRAP" | "NO_WRAP";
  itemSpacing?: number | string; // string when variable
  counterAxisSpacing?: number | string; // string when variable
  paddingTop?: number | string; // string when variable
  paddingBottom?: number | string; // string when variable
  paddingLeft?: number | string; // string when variable
  paddingRight?: number | string; // string when variable
  horizontalPadding?: number | string; // string when variable
  verticalPadding?: number | string; // string when variable
}

export function createContainerLayoutPropsConverter(
  valueResolver: FigmaValueResolver,
): PropsConverter<ContainerLayoutTrait, ContainerLayoutProps> {
  return createPropsConverter({
    _types: {
      trait: {} as ContainerLayoutTrait,
      props: {} as ContainerLayoutProps,
    },
    handlers: {
      layoutMode: ({ layoutMode }) => (!layoutMode || layoutMode === "GRID" ? "NONE" : layoutMode),
      primaryAxisAlignItems: ({ primaryAxisAlignItems }) => primaryAxisAlignItems,
      counterAxisAlignItems: ({ counterAxisAlignItems }) => counterAxisAlignItems,
      layoutWrap: ({ layoutWrap }) => layoutWrap,
      itemSpacing: (node) => valueResolver.getFormattedValue.itemSpacing(node),
      counterAxisSpacing: (node) => valueResolver.getFormattedValue.counterAxisSpacing(node),
      paddingTop: (node) => valueResolver.getFormattedValue.paddingTop(node),
      paddingBottom: (node) => valueResolver.getFormattedValue.paddingBottom(node),
      paddingLeft: (node) => valueResolver.getFormattedValue.paddingLeft(node),
      paddingRight: (node) => valueResolver.getFormattedValue.paddingRight(node),
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

export function createSelfLayoutPropsConverter(
  valueResolver: FigmaValueResolver,
): PropsConverter<SelfLayoutTrait, SelfLayoutProps> {
  return createPropsConverter({
    _types: {
      trait: {} as SelfLayoutTrait,
      props: {} as SelfLayoutProps,
    },
    handlers: {
      layoutGrow: ({ layoutGrow }) => layoutGrow,
      layoutAlign: ({ layoutAlign }) => layoutAlign,
      layoutSizingVertical: ({ layoutSizingVertical }) => layoutSizingVertical,
      layoutSizingHorizontal: ({ layoutSizingHorizontal }) => layoutSizingHorizontal,
      width: (node) => valueResolver.getFormattedValue.width(node),
      height: (node) => valueResolver.getFormattedValue.height(node),
      minWidth: (node) => valueResolver.getFormattedValue.minWidth(node),
      minHeight: (node) => valueResolver.getFormattedValue.minHeight(node),
      maxWidth: (node) => valueResolver.getFormattedValue.maxWidth(node),
      maxHeight: (node) => valueResolver.getFormattedValue.maxHeight(node),
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

export function createRadiusPropsConverter(valueResolver: FigmaValueResolver) {
  return createPropsConverter({
    _types: {
      trait: {} as RadiusTrait,
      props: {} as RadiusProps,
    },
    handlers: {
      topLeftRadius: (node) => valueResolver.getFormattedValue.topLeftRadius(node),
      topRightRadius: (node) => valueResolver.getFormattedValue.topRightRadius(node),
      bottomLeftRadius: (node) => valueResolver.getFormattedValue.bottomLeftRadius(node),
      bottomRightRadius: (node) => valueResolver.getFormattedValue.bottomRightRadius(node),
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
  fill?: string | { value: string; direction?: string };
}

export function createFrameFillPropsConverter(valueResolver: FigmaValueResolver) {
  return definePropsConverter<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueResolver.getFormattedValue.frameFill(node);

    return {
      fill,
    };
  });
}

export function createShapeFillPropsConverter(valueResolver: FigmaValueResolver) {
  return definePropsConverter<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueResolver.getFormattedValue.shapeFill(node);

    return {
      fill,
    };
  });
}

export function createTextFillPropsConverter(valueResolver: FigmaValueResolver) {
  return definePropsConverter<FillTrait, FillProps>((node: FillTrait) => {
    const fill = valueResolver.getFormattedValue.textFill(node);

    return {
      fill,
    };
  });
}

export interface StrokeProps {
  stroke?: string;
  strokeWeight?: number;
}

export function createStrokePropsConverter(
  valueResolver: FigmaValueResolver,
): PropsConverter<StrokeTrait, StrokeProps> {
  return definePropsConverter((node: StrokeTrait) => {
    const stroke = valueResolver.getFormattedValue.stroke(node);
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

export function createTypeStylePropsConverter(
  valueResolver: FigmaValueResolver,
): PropsConverter<TypeStyleTrait, TypeStyleProps> {
  return definePropsConverter((node) => {
    const styleName = valueResolver.getTextStyleValue(node);
    const maxLines =
      node.style.textTruncation === "ENDING" ? (node.style.maxLines ?? undefined) : undefined;

    if (styleName) {
      return {
        textStyle: styleName,
        maxLines,
      };
    }

    return {
      fontSize: valueResolver.getFormattedValue.fontSize(node),
      fontWeight: valueResolver.getFormattedValue.fontWeight(node),
      lineHeight: valueResolver.getFormattedValue.lineHeight(node),
      maxLines,
    };
  });
}

export interface ShadowProps {
  boxShadowStyle?: string;
  boxShadow?: string;
}

export function createShadowPropsConverter(
  valueResolver: FigmaValueResolver,
): PropsConverter<ShadowTrait, ShadowProps> {
  return definePropsConverter((node: ShadowTrait) => {
    const effectStyleName = valueResolver.getEffectStyleValue(node);
    if (effectStyleName) {
      return {
        boxShadowStyle: effectStyleName,
      };
    }

    const boxShadow = valueResolver.getFormattedValue.boxShadow(node);
    return {
      boxShadow,
    };
  });
}
