import type { NormalizedFrameNode } from "../normalizer";
import { getLayoutVariableName, inferDimension } from "./variable";

type SizingPropHandler = (
  props: Pick<
    NormalizedFrameNode,
    "boundVariables" | "layoutSizingHorizontal" | "layoutSizingVertical" | "absoluteBoundingBox"
  >,
) => string | number | boolean | undefined;

const sizingPropHandlers = {
  height: ({ boundVariables, layoutSizingVertical, absoluteBoundingBox }) =>
    layoutSizingVertical === "FIXED"
      ? boundVariables?.size?.y
        ? getLayoutVariableName(boundVariables.size.y.id)
        : inferDimension(absoluteBoundingBox?.height ?? 0)
      : undefined,
  width: ({ boundVariables, layoutSizingHorizontal, absoluteBoundingBox }) =>
    layoutSizingHorizontal === "FIXED"
      ? boundVariables?.size?.x
        ? getLayoutVariableName(boundVariables.size.x.id)
        : inferDimension(absoluteBoundingBox?.width ?? 0)
      : undefined,
} satisfies Record<string, SizingPropHandler>;

export type SizingProps = keyof typeof sizingPropHandlers;

export function createSizingProps(
  node: Pick<
    NormalizedFrameNode,
    "boundVariables" | "layoutSizingHorizontal" | "layoutSizingVertical" | "absoluteBoundingBox"
  >,
): Record<string, string | number | boolean> {
  const boundVariables = node.boundVariables;
  const layoutSizingHorizontal = node.layoutSizingHorizontal ?? "FIXED";
  const layoutSizingVertical = node.layoutSizingVertical ?? "FIXED";
  const absoluteBoundingBox = node.absoluteBoundingBox;

  if (!boundVariables) {
    return {};
  }

  const result: Record<string, string | number | boolean> = {};

  for (const [prop, handler] of Object.entries(sizingPropHandlers)) {
    const value = handler({
      boundVariables,
      layoutSizingHorizontal,
      layoutSizingVertical,
      absoluteBoundingBox,
    });
    if (value !== undefined) {
      result[prop] = value;
    }
  }

  return result;
}
