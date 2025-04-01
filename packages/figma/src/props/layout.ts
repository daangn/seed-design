import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "../normalizer";
import { getLayoutVariableName, inferDimension, inferRadius } from "./variable";

// Basic handlers
type LayoutPropHandler = (
  props: Pick<
    NormalizedFrameNode,
    | "layoutMode"
    | "layoutWrap"
    | "paddingLeft"
    | "paddingRight"
    | "paddingTop"
    | "paddingBottom"
    | "primaryAxisAlignItems"
    | "counterAxisAlignItems"
    | "primaryAxisSizingMode"
    | "counterAxisSizingMode"
    | "layoutGrow"
    | "layoutAlign"
    | "itemSpacing"
    | "counterAxisSpacing"
    | "boundVariables"
    | "cornerRadius"
    | "rectangleCornerRadii"
    | "children"
  >,
) => string | number | boolean | undefined;

const layoutPropHandlers = {
  flexDirection: ({ layoutMode }) => (layoutMode === "HORIZONTAL" ? "row" : "column"),
  justifyContent: ({ primaryAxisAlignItems }) => {
    switch (primaryAxisAlignItems) {
      case "MIN":
        return "flexStart";
      case "CENTER":
        return "center";
      case "MAX":
        return "flexEnd";
      case "SPACE_BETWEEN":
        return "spaceBetween";
    }
  },
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

    switch (counterAxisAlignItems) {
      case "MIN":
        return "flexStart";
      case "CENTER":
        return "center";
      case "MAX":
        return "flexEnd";
      case "BASELINE":
        return "baseline";
    }
  },
  flexWrap: ({ layoutWrap }) => (layoutWrap === "WRAP" ? "wrap" : "nowrap"),
  flexGrow: ({ layoutGrow }) => layoutGrow,
  alignSelf: ({ layoutAlign }) => {
    switch (layoutAlign) {
      case "STRETCH":
        return "stretch";
      case "MIN":
        return "flexStart";
      case "CENTER":
        return "center";
      case "MAX":
        return "flexEnd";
    }
  },
  gap: ({ itemSpacing, boundVariables, primaryAxisAlignItems, children }) =>
    children.length <= 1
      ? 0
      : primaryAxisAlignItems === "SPACE_BETWEEN"
        ? 0
        : boundVariables?.itemSpacing
          ? getLayoutVariableName(boundVariables.itemSpacing.id)
          : inferDimension(itemSpacing ?? 0),
  paddingTop: ({ paddingTop, boundVariables }) =>
    boundVariables?.paddingTop
      ? getLayoutVariableName(boundVariables.paddingTop.id)
      : inferDimension(paddingTop ?? 0),
  paddingBottom: ({ paddingBottom, boundVariables }) =>
    boundVariables?.paddingBottom
      ? getLayoutVariableName(boundVariables.paddingBottom.id)
      : inferDimension(paddingBottom ?? 0),
  paddingLeft: ({ paddingLeft, boundVariables }) =>
    boundVariables?.paddingLeft
      ? getLayoutVariableName(boundVariables.paddingLeft.id)
      : inferDimension(paddingLeft ?? 0),
  paddingRight: ({ paddingRight, boundVariables }) =>
    boundVariables?.paddingRight
      ? getLayoutVariableName(boundVariables.paddingRight.id)
      : inferDimension(paddingRight ?? 0),
  borderRadius: ({ cornerRadius, boundVariables }) => {
    // If all corner radii are the same, use the first one
    if (
      cornerRadius &&
      boundVariables?.bottomLeftRadius === boundVariables?.bottomRightRadius &&
      boundVariables?.bottomLeftRadius === boundVariables?.topLeftRadius &&
      boundVariables?.bottomLeftRadius === boundVariables?.topRightRadius
    ) {
      return boundVariables?.bottomLeftRadius
        ? getLayoutVariableName(boundVariables.bottomLeftRadius.id)
        : inferRadius(cornerRadius ?? 0);
    }

    // TODO: handle individual corner radii
    return undefined;
  },
  borderTopLeftRadius: ({ rectangleCornerRadii, boundVariables }) =>
    boundVariables?.topLeftRadius
      ? getLayoutVariableName(boundVariables.topLeftRadius.id)
      : inferRadius(rectangleCornerRadii?.[0] ?? 0),
  borderTopRightRadius: ({ rectangleCornerRadii, boundVariables }) =>
    boundVariables?.topRightRadius
      ? getLayoutVariableName(boundVariables.topRightRadius.id)
      : inferRadius(rectangleCornerRadii?.[1] ?? 0),
  borderBottomLeftRadius: ({ rectangleCornerRadii, boundVariables }) =>
    boundVariables?.bottomLeftRadius
      ? getLayoutVariableName(boundVariables.bottomLeftRadius.id)
      : inferRadius(rectangleCornerRadii?.[2] ?? 0),
  borderBottomRightRadius: ({ rectangleCornerRadii, boundVariables }) =>
    boundVariables?.bottomRightRadius
      ? getLayoutVariableName(boundVariables.bottomRightRadius.id)
      : inferRadius(rectangleCornerRadii?.[3] ?? 0),
} satisfies Record<string, LayoutPropHandler>;

type LayoutProps = keyof typeof layoutPropHandlers;

// Shorthand handlers
type LayoutShorthandHandler = (props: Record<LayoutProps, string | number | boolean | undefined>) =>
  | {
      value: string | number | boolean | undefined;
      exclude: LayoutProps[];
    }
  | undefined;

const layoutShorthandHandlers = {
  paddingX: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
    if (
      paddingLeft === paddingRight &&
      paddingTop === paddingBottom &&
      paddingLeft === paddingTop
    ) {
      return undefined;
    }
    if (paddingLeft === paddingRight) {
      const value =
        paddingLeft === "globalGutter" || paddingLeft === "betweenChips"
          ? `spacingX.${paddingLeft}`
          : paddingLeft;
      return {
        value,
        exclude: ["paddingLeft", "paddingRight"],
      };
    }
    return undefined;
  },
  paddingY: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
    if (
      paddingLeft === paddingRight &&
      paddingTop === paddingBottom &&
      paddingLeft === paddingTop
    ) {
      return undefined;
    }
    if (paddingTop === paddingBottom) {
      return {
        value: paddingTop,
        exclude: ["paddingTop", "paddingBottom"],
      };
    }
    return undefined;
  },
  padding: ({ paddingLeft, paddingRight, paddingTop, paddingBottom }) => {
    if (
      paddingLeft === paddingRight &&
      paddingTop === paddingBottom &&
      paddingLeft === paddingTop
    ) {
      return {
        value: paddingLeft,
        exclude: ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
      };
    }
    return undefined;
  },
} satisfies Record<string, LayoutShorthandHandler>;

type LayoutShorthandProps = keyof typeof layoutShorthandHandlers;

// Default values
const layoutPropDefaults: Record<string, string | number | boolean> = {
  flexDirection: "row",
  justifyContent: "flexStart",
  alignItems: "stretch",
  flexWrap: "nowrap",
  flexGrow: 0,
  alignSelf: "auto",
  gap: 0,
  padding: 0,
  paddingX: 0,
  paddingY: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  borderRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
} satisfies Record<LayoutProps | LayoutShorthandProps, string | number | boolean>;

type FrameLikeNode = NormalizedFrameNode | NormalizedComponentNode | NormalizedInstanceNode;

export function createLayoutProps(
  node: FrameLikeNode,
): Record<LayoutProps | LayoutShorthandProps, string | number | boolean> {
  const boundVariables = node.boundVariables;
  const children = node.children;

  const autoLayoutProperties = {
    layoutMode: node.layoutMode,
    layoutWrap: node.layoutWrap,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    layoutGrow: node.layoutGrow,
    layoutAlign: node.layoutAlign,
    itemSpacing: node.itemSpacing,
    counterAxisSpacing: node.counterAxisSpacing,
  };

  const radiusProperties = {
    cornerRadius: node.cornerRadius,
    topLeftRadius: node.rectangleCornerRadii?.[0],
    topRightRadius: node.rectangleCornerRadii?.[1],
    bottomRightRadius: node.rectangleCornerRadii?.[2],
    bottomLeftRadius: node.rectangleCornerRadii?.[3],
  };

  const result: Record<string, string | number | boolean> = {};

  for (const [prop, handler] of Object.entries(layoutPropHandlers)) {
    const value = handler({
      ...autoLayoutProperties,
      ...radiusProperties,
      boundVariables,
      children,
    });
    if (value !== undefined && value !== layoutPropDefaults[prop]) {
      result[prop] = value;
    }
  }

  for (const [prop, handler] of Object.entries(layoutShorthandHandlers)) {
    const shorthandResult = handler(result);
    if (shorthandResult === undefined) {
      continue;
    }
    const { value, exclude } = shorthandResult;
    if (value !== undefined && value !== layoutPropDefaults[prop]) {
      result[prop] = value;
      for (const excludedProp of exclude) {
        delete result[excludedProp];
      }
    }
  }

  return result;
}
