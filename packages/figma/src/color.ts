import type { NormalizedFrameNode, NormalizedTextNode } from "./normalizer/types";
import { getColorVariableName } from "./variable";

export function createBackgroundProps(
  node: Pick<NormalizedFrameNode, "fills" | "boundVariables">,
): Partial<Record<"background", string | undefined>> {
  const fills = node.fills;
  if (fills.length === 0) {
    return {};
  }

  const fill = fills[0];
  if (!fill || ("visible" in fill && !fill.visible) || fill.type !== "SOLID") {
    return {};
  }

  if (node.boundVariables?.fills?.length === 1) {
    return {
      background: getColorVariableName(node.boundVariables.fills[0]!.id),
    };
  }

  const color = fill.color;
  return {
    background: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${fill.opacity})`,
  };
}

export function createColorProps(
  node: Pick<NormalizedTextNode, "fills" | "boundVariables">,
): Partial<Record<"color", string | undefined>> {
  const fills = node.fills;
  if (fills.length === 0) {
    return {};
  }

  const fill = fills[0];
  if (!fill || ("visible" in fill && !fill.visible) || fill.type !== "SOLID") {
    return {};
  }
  if (node.boundVariables?.fills?.length === 1) {
    return {
      color: getColorVariableName(node.boundVariables.fills[0]!.id),
    };
  }

  const color = fill.color;
  return {
    color: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${fill.opacity})`,
  };
}

export function createBorderProps(
  node: Pick<NormalizedFrameNode, "strokeWeight" | "strokes" | "boundVariables">,
): Partial<Record<"borderWidth" | "borderColor", string | number | undefined>> {
  const strokes = node.strokes;
  if (strokes === undefined || strokes.length === 0) {
    return {};
  }

  const stroke = strokes[0];
  if (!stroke || ("visible" in stroke && !stroke.visible) || stroke.type !== "SOLID") {
    return {};
  }

  if (node.boundVariables?.strokes?.length === 1) {
    return {
      borderWidth: node.strokeWeight as number,
      borderColor: getColorVariableName(node.boundVariables.strokes[0]!.id),
    };
  }

  const color = stroke.color;
  return {
    borderWidth: node.strokeWeight as number,
    borderColor: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${stroke.opacity})`,
  };
}
