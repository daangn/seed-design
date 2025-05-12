import { createPropsConverter, definePropsConverter, type PropsConverter } from "@/codegen/core";
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
import type { ReactValueResolver } from "./value-resolver";

export interface PropsConverters {
  containerLayout: PropsConverter<ContainerLayoutTrait, ContainerLayoutProps>;
  selfLayout: PropsConverter<SelfLayoutTrait, SelfLayoutProps>;
  iconSelfLayout: PropsConverter<SelfLayoutTrait, IconSelfLayoutProps>;
  radius: PropsConverter<RadiusTrait, RadiusProps>;
  frameFill: PropsConverter<FillTrait, FrameFillProps>;
  shapeFill: PropsConverter<FillTrait, ShapeFillProps>;
  textFill: PropsConverter<FillTrait, TextFillProps>;
  vectorChildrenFill: PropsConverter<ContainerLayoutTrait, VectorChildrenFillProps>;
  stroke: PropsConverter<StrokeTrait, StrokeProps>;
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

export function createContainerLayoutPropsConverter(
  valueResolver: ReactValueResolver,
): PropsConverter<ContainerLayoutTrait, ContainerLayoutProps> {
  return createPropsConverter({
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

        return valueResolver.getFormattedValue.itemSpacing(node);
      },
      pt: (node) => valueResolver.getFormattedValue.paddingTop(node),
      pb: (node) => valueResolver.getFormattedValue.paddingBottom(node),
      pl: (node) => valueResolver.getFormattedValue.paddingLeft(node),
      pr: (node) => valueResolver.getFormattedValue.paddingRight(node),
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

export function createSelfLayoutPropsConverter(
  valueResolver: ReactValueResolver,
): PropsConverter<SelfLayoutTrait, SelfLayoutProps> {
  return createPropsConverter({
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
          ? valueResolver.getFormattedValue.height(node)
          : undefined,
      width: (node) =>
        node.layoutSizingHorizontal === "FIXED"
          ? valueResolver.getFormattedValue.width(node)
          : undefined,
      minHeight: (node) =>
        node.layoutSizingVertical === "HUG"
          ? valueResolver.getFormattedValue.minHeight(node)
          : undefined,
      maxHeight: (node) =>
        node.layoutSizingVertical === "HUG"
          ? valueResolver.getFormattedValue.maxHeight(node)
          : undefined,
      minWidth: (node) =>
        node.layoutSizingHorizontal === "HUG"
          ? valueResolver.getFormattedValue.minWidth(node)
          : undefined,
      maxWidth: (node) =>
        node.layoutSizingHorizontal === "HUG"
          ? valueResolver.getFormattedValue.maxWidth(node)
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

export function createIconSelfLayoutPropsConverter(valueResolver: ReactValueResolver) {
  return createPropsConverter({
    _types: {
      trait: {} as SelfLayoutTrait,
      props: {} as IconSelfLayoutProps,
    },
    handlers: {
      size: (node) => valueResolver.getFormattedValue.width(node),
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

export function createRadiusPropsConverter(valueResolver: ReactValueResolver) {
  return createPropsConverter({
    _types: {
      trait: {} as RadiusTrait,
      props: {} as RadiusProps,
    },
    handlers: {
      borderTopLeftRadius: (node) => valueResolver.getFormattedValue.topLeftRadius(node),
      borderTopRightRadius: (node) => valueResolver.getFormattedValue.topRightRadius(node),
      borderBottomLeftRadius: (node) => valueResolver.getFormattedValue.bottomLeftRadius(node),
      borderBottomRightRadius: (node) => valueResolver.getFormattedValue.bottomRightRadius(node),
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

export function createTypeStylePropsConverter({
  valueResolver,
}: {
  valueResolver: ReactValueResolver;
}): PropsConverter<TypeStyleTrait, TypeStyleProps> {
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

export interface FrameFillProps {
  bg?: string;
}

export function createFrameFillPropsConverter(valueResolver: ReactValueResolver) {
  return definePropsConverter<FillTrait, FrameFillProps>((node) => {
    const bg = valueResolver.getFormattedValue.frameFill(node);

    return {
      bg,
    };
  });
}

export interface ShapeFillProps {
  color?: string;
}

export function createShapeFillPropsConverter(valueResolver: ReactValueResolver) {
  return definePropsConverter<FillTrait, ShapeFillProps>((node) => {
    const color = valueResolver.getFormattedValue.shapeFill(node);

    return {
      color,
    };
  });
}

export interface TextFillProps {
  color?: string;
}

export function createTextFillPropsConverter(valueResolver: ReactValueResolver) {
  return definePropsConverter<FillTrait, TextFillProps>((node) => {
    const color = valueResolver.getFormattedValue.textFill(node);

    return {
      color,
    };
  });
}

export interface VectorChildrenFillProps {
  color?: string;
}

export function createVectorChildrenFillPropsConverter(valueResolver: ReactValueResolver) {
  return definePropsConverter<ContainerLayoutTrait, VectorChildrenFillProps>((node) => {
    if (node.children.length === 0) {
      console.warn(
        `createVectorChildrenFillPropsConverter: Node has no children. Name:${node.name}, ID:${node.id}`,
      );
      return {};
    }

    const vectors = node.children.filter(
      (child) => child.type === "VECTOR" || child.type === "BOOLEAN_OPERATION",
    );

    const colors = vectors.map((vector) => valueResolver.getFormattedValue.shapeFill(vector));

    const fills = new Set(colors.filter((color) => color !== undefined));

    // If there are more than 1 color, colors are likely pre-defined in the icon component; we should ignore the color prop.
    if (fills.size > 1) {
      return {};
    }

    return { color: fills.values().next().value };
  });
}

export interface StrokeProps {
  borderWidth?: number;
  borderColor?: string;
}

export function createStrokePropsConverter(
  valueResolver: ReactValueResolver,
): PropsConverter<StrokeTrait, StrokeProps> {
  return definePropsConverter((node) => {
    const borderColor = valueResolver.getFormattedValue.stroke(node);
    const borderWidth = borderColor ? node.strokeWeight : undefined;

    return {
      borderColor,
      borderWidth,
    };
  });
}
