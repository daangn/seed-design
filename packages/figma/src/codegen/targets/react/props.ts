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
import { match } from "ts-pattern";

export interface PropsTransformers {
  containerLayout: PropsTransformer<ContainerLayoutTrait, ContainerLayoutProps>;
  selfLayout: PropsTransformer<SelfLayoutTrait, SelfLayoutProps>;
  radius: PropsTransformer<RadiusTrait, RadiusProps>;
  frameFill: PropsTransformer<FillTrait, FrameFillProps>;
  shapeFill: PropsTransformer<FillTrait, ShapeFillProps>;
  textFill: PropsTransformer<FillTrait, TextFillProps>;
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
  flexDirection?: "row" | "column";
  justifyContent?: "flexStart" | "center" | "flexEnd" | "spaceBetween";
  alignItems?: "stretch" | "flexStart" | "center" | "flexEnd" | "baseline";
  flexWrap?: "wrap" | "nowrap";
  gap?: string | 0;
  paddingBottom?: string | 0;
  paddingLeft?: string | 0;
  paddingRight?: string | 0;
  paddingTop?: string | 0;
  paddingX?: string | 0;
  paddingY?: string | 0;
  padding?: string | 0;
}

type ReactValueTransformer = ValueTransformer<string, string, string, number>;

export function createContainerLayoutPropsTransformer(
  valueTransformer: ReactValueTransformer,
): PropsTransformer<ContainerLayoutTrait, ContainerLayoutProps> {
  return createPropsTransformer({
    _types: {
      trait: {} as ContainerLayoutTrait,
      props: {} as ContainerLayoutProps,
    },
    handlers: {
      flexDirection: ({ layoutMode }) =>
        match(layoutMode)
          .with("HORIZONTAL", () => "row" as const)
          .with("VERTICAL", () => "column" as const)
          .with("NONE", () => undefined)
          .with(undefined, () => undefined)
          .exhaustive(),
      justifyContent: ({ primaryAxisAlignItems }) =>
        match(primaryAxisAlignItems)
          .with("MIN", () => "flexStart" as const)
          .with("CENTER", () => "center" as const)
          .with("MAX", () => "flexEnd" as const)
          .with("SPACE_BETWEEN", () => "spaceBetween" as const)
          .with(undefined, () => undefined)
          .exhaustive(),
      alignItems: ({ counterAxisAlignItems, children }) => {
        const isStretch = children.every((child) => {
          if (!("layoutAlign" in child)) {
            return false;
          }

          return child.layoutAlign === "STRETCH";
        });

        if (isStretch) {
          return "stretch";
        }

        return match(counterAxisAlignItems)
          .with("MIN", () => "flexStart" as const)
          .with("CENTER", () => "center" as const)
          .with("MAX", () => "flexEnd" as const)
          .with("BASELINE", () => "baseline" as const)
          .with(undefined, () => undefined)
          .exhaustive();
      },
      flexWrap: ({ layoutWrap }) =>
        match(layoutWrap)
          .with("WRAP", () => "wrap" as const)
          .with("NO_WRAP", () => "nowrap" as const)
          .with(undefined, () => undefined)
          .exhaustive(),
      gap: (node) => {
        if (node.children.length <= 1) {
          return undefined;
        }

        if (node.primaryAxisAlignItems === "SPACE_BETWEEN") {
          return undefined;
        }

        return valueTransformer.getFormattedValue.itemSpacing(node);
      },
      paddingTop: (node) => valueTransformer.getFormattedValue.paddingTop(node),
      paddingBottom: (node) => valueTransformer.getFormattedValue.paddingBottom(node),
      paddingLeft: (node) => valueTransformer.getFormattedValue.paddingLeft(node),
      paddingRight: (node) => valueTransformer.getFormattedValue.paddingRight(node),
    },
    shorthands: {
      padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
      paddingX: ["paddingLeft", "paddingRight"],
      paddingY: ["paddingTop", "paddingBottom"],
    },
    defaults: {
      justifyContent: "flexStart",
      alignItems: "stretch",
      flexWrap: "nowrap",
      gap: 0,
      padding: 0,
      paddingX: 0,
      paddingY: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
    },
  });
}

export interface SelfLayoutProps {
  flexGrow?: number;
  alignSelf?: "stretch" | "flexStart" | "center" | "flexEnd";
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export function createSelfLayoutPropsTransformer(
  valueTransformer: ReactValueTransformer,
): PropsTransformer<SelfLayoutTrait, SelfLayoutProps> {
  return createPropsTransformer({
    _types: {
      trait: {} as SelfLayoutTrait,
      props: {} as SelfLayoutProps,
    },
    handlers: {
      flexGrow: ({ layoutGrow }) => layoutGrow,
      alignSelf: ({ layoutAlign }) =>
        match(layoutAlign)
          .with("STRETCH", () => "stretch" as const)
          .with("INHERIT", () => undefined)
          .with("MIN", () => undefined) // Deprecated in Figma
          .with("CENTER", () => undefined) // Deprecated in Figma
          .with("MAX", () => undefined) // Deprecated in Figma
          .with(undefined, () => undefined)
          .exhaustive(),
      height: (node) =>
        node.layoutSizingVertical === "FIXED"
          ? valueTransformer.getFormattedValue.height(node)
          : undefined,
      width: (node) =>
        node.layoutSizingHorizontal === "FIXED"
          ? valueTransformer.getFormattedValue.width(node)
          : undefined,
      minHeight: (node) =>
        node.layoutSizingVertical === "HUG"
          ? valueTransformer.getFormattedValue.minHeight(node)
          : undefined,
      maxHeight: (node) =>
        node.layoutSizingVertical === "HUG"
          ? valueTransformer.getFormattedValue.maxHeight(node)
          : undefined,
      minWidth: (node) =>
        node.layoutSizingHorizontal === "HUG"
          ? valueTransformer.getFormattedValue.minWidth(node)
          : undefined,
      maxWidth: (node) =>
        node.layoutSizingHorizontal === "HUG"
          ? valueTransformer.getFormattedValue.maxWidth(node)
          : undefined,
    },
    defaults: {
      flexGrow: 0,
    },
  });
}

export interface RadiusProps {
  borderRadius?: string | 0;
  borderTopLeftRadius?: string | 0;
  borderTopRightRadius?: string | 0;
  borderBottomLeftRadius?: string | 0;
  borderBottomRightRadius?: string | 0;
}

export function createRadiusPropsTransformer(valueTransformer: ReactValueTransformer) {
  return createPropsTransformer({
    _types: {
      trait: {} as RadiusTrait,
      props: {} as RadiusProps,
    },
    handlers: {
      borderTopLeftRadius: (node) => valueTransformer.getFormattedValue.topLeftRadius(node),
      borderTopRightRadius: (node) => valueTransformer.getFormattedValue.topRightRadius(node),
      borderBottomLeftRadius: (node) => valueTransformer.getFormattedValue.bottomLeftRadius(node),
      borderBottomRightRadius: (node) => valueTransformer.getFormattedValue.bottomRightRadius(node),
    },
    shorthands: {
      borderRadius: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    defaults: {
      borderRadius: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  });
}

export interface TypeStyleProps {
  textStyle?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string;
  maxLines?: number;
}

export function createTypeStylePropsTransformer({
  valueTransformer,
  styleService,
}: {
  valueTransformer: ReactValueTransformer;
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

export interface FrameFillProps {
  background?: string;
}

export function createFrameFillPropsTransformer(valueTransformer: ReactValueTransformer) {
  return definePropsTransformer<FillTrait, FrameFillProps>((node) => {
    const background = valueTransformer.getFormattedValue.frameFill(node);

    return {
      background,
    };
  });
}

export interface ShapeFillProps {
  color?: string;
}

export function createShapeFillPropsTransformer(valueTransformer: ReactValueTransformer) {
  return definePropsTransformer<FillTrait, ShapeFillProps>((node) => {
    const color = valueTransformer.getFormattedValue.shapeFill(node);

    return {
      color,
    };
  });
}

export interface TextFillProps {
  color?: string;
}

export function createTextFillPropsTransformer(valueTransformer: ReactValueTransformer) {
  return definePropsTransformer<FillTrait, TextFillProps>((node) => {
    const color = valueTransformer.getFormattedValue.textFill(node);

    return {
      color,
    };
  });
}

export interface StrokeProps {
  borderWidth?: number;
  borderColor?: string;
}

export function createStrokePropsTransformer(
  valueTransformer: ReactValueTransformer,
): PropsTransformer<StrokeTrait, StrokeProps> {
  return definePropsTransformer((node) => {
    const borderColor = valueTransformer.getFormattedValue.stroke(node);
    const borderWidth = node.strokeWeight;

    return {
      borderColor,
      borderWidth,
    };
  });
}
