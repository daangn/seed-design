import type { NormalizedFrameNode } from "./normalizer/types";
import { getLayoutVariableName, inferDimension } from "./variable";

type SizingPropHandler = (props: {
  boundVariables: NonNullable<NormalizedFrameNode["boundVariables"]>;
  layoutSizingHorizontal: FrameNode["layoutSizingHorizontal"];
  layoutSizingVertical: FrameNode["layoutSizingVertical"];
  width: FrameNode["width"];
  height: FrameNode["height"];
}) => string | number | boolean | undefined;

const sizingPropHandlers = {
  height: ({ boundVariables, layoutSizingVertical, height }) =>
    layoutSizingVertical === "FIXED"
      ? boundVariables.size?.y
        ? getLayoutVariableName(boundVariables.size.y.id)
        : inferDimension(height)
      : undefined,
  width: ({ boundVariables, layoutSizingHorizontal, width }) =>
    layoutSizingHorizontal === "FIXED"
      ? boundVariables.size?.x
        ? getLayoutVariableName(boundVariables.size.x.id)
        : inferDimension(width)
      : undefined,
} satisfies Record<string, SizingPropHandler>;

export function createSizingProps(
  node: Pick<
    NormalizedFrameNode,
    "boundVariables" | "layoutSizingHorizontal" | "layoutSizingVertical" | "absoluteBoundingBox"
  >,
): Record<string, string | number | boolean> {
  const boundVariables = node.boundVariables;
  const layoutSizingHorizontal = node.layoutSizingHorizontal ?? "FIXED";
  const layoutSizingVertical = node.layoutSizingVertical ?? "FIXED";
  const { width, height } = node.absoluteBoundingBox ?? { width: 0, height: 0 };

  if (!boundVariables) {
    return {};
  }

  const result: Record<string, string | number | boolean> = {};

  for (const [prop, handler] of Object.entries(sizingPropHandlers)) {
    const value = handler({
      boundVariables,
      layoutSizingHorizontal,
      layoutSizingVertical,
      width,
      height,
    });
    if (value !== undefined) {
      result[prop] = value;
    }
  }

  return result;
}
