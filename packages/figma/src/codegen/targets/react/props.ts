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
  iconSelfLayout: PropsTransformer<SelfLayoutTrait, IconSelfLayoutProps>;
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
  direction?: "row" | "column";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
  wrap?: "wrap" | "nowrap" | true;
  gap?: string | 0;
  pb?: string | 0;
  pl?: string | 0;
  pr?: string | 0;
  pt?: string | 0;
  px?: string | 0;
  py?: string | 0;
  p?: string | 0;
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
      direction: ({ layoutMode }) =>
        match(layoutMode)
          .with("HORIZONTAL", () => "row" as const)
          .with("VERTICAL", () => "column" as const)
          .with("NONE", () => undefined)
          .with(undefined, () => undefined)
          .exhaustive(),
      justify: ({ primaryAxisAlignItems }) =>
        match(primaryAxisAlignItems)
          .with("MIN", () => "flex-start" as const)
          .with("CENTER", () => "center" as const)
          .with("MAX", () => "flex-end" as const)
          .with("SPACE_BETWEEN", () => "space-between" as const)
          .with(undefined, () => undefined)
          .exhaustive(),
      align: ({ counterAxisAlignItems, children }) => {
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
          .with("MIN", () => "flex-start" as const)
          .with("CENTER", () => "center" as const)
          .with("MAX", () => "flex-end" as const)
          .with("BASELINE", () => "baseline" as const)
          .with(undefined, () => undefined)
          .exhaustive();
      },
      wrap: ({ layoutWrap }) =>
        match(layoutWrap)
          .with("WRAP", () => true as const)
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
      pt: (node) => valueTransformer.getFormattedValue.paddingTop(node),
      pb: (node) => valueTransformer.getFormattedValue.paddingBottom(node),
      pl: (node) => valueTransformer.getFormattedValue.paddingLeft(node),
      pr: (node) => valueTransformer.getFormattedValue.paddingRight(node),
    },
    shorthands: {
      p: ["pt", "pb", "pl", "pr"],
      px: ["pl", "pr"],
      py: ["pt", "pb"],
    },
    defaults: {
      justify: "flex-start",
      align: "stretch",
      wrap: "nowrap",
      gap: 0,
      p: 0,
      px: 0,
      py: 0,
      pb: 0,
      pl: 0,
      pr: 0,
      pt: 0,
    },
  });
}

export interface SelfLayoutProps {
  grow?: 0 | 1 | true;
  alignSelf?: "stretch";
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
      grow: ({ layoutGrow }) => (layoutGrow === 1 ? true : layoutGrow),
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
      grow: 0,
    },
  });
}

export interface IconSelfLayoutProps {
  size?: string | number;
}

export function createIconSelfLayoutPropsTransformer(valueTransformer: ReactValueTransformer) {
  return createPropsTransformer({
    _types: {
      trait: {} as SelfLayoutTrait,
      props: {} as IconSelfLayoutProps,
    },
    handlers: {
      size: (node) => valueTransformer.getFormattedValue.width(node),
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
  bg?: string;
}

export function createFrameFillPropsTransformer(valueTransformer: ReactValueTransformer) {
  return definePropsTransformer<FillTrait, FrameFillProps>((node) => {
    const bg = valueTransformer.getFormattedValue.frameFill(node);

    return {
      bg,
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
    const borderWidth = borderColor ? node.strokeWeight : undefined;

    return {
      borderColor,
      borderWidth,
    };
  });
}
