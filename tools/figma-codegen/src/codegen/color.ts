import { getColorVariableName } from "./variable";

export function createBackgroundProps(
  node: DefaultShapeMixin,
): Record<string, string> {
  const fills = node.fills;
  if (fills === figma.mixed || fills.length === 0) {
    return {};
  }

  const fill = fills[0];
  if (!fill || !fill.visible || fill.type !== "SOLID") {
    return {};
  }

  if (node.boundVariables?.fills?.length === 1) {
    return {
      backgroundColor: getColorVariableName(node.boundVariables.fills[0]!.id),
    };
  }

  const color = fill.color;
  return {
    backgroundColor: `rgba(${color.r * 255}, ${color.g * 255}, ${
      color.b * 255
    }, ${fill.opacity})`,
  };
}

export function createColorProps(
  node: DefaultShapeMixin,
): Record<string, string> {
  const fills = node.fills;
  if (fills === figma.mixed || fills.length === 0) {
    return {};
  }

  const fill = fills[0];
  if (!fill || !fill.visible || fill.type !== "SOLID") {
    return {};
  }

  if (node.boundVariables?.fills?.length === 1) {
    return {
      color: getColorVariableName(node.boundVariables.fills[0]!.id),
    };
  }

  const color = fill.color;
  return {
    color: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${
      fill.opacity
    })`,
  };
}

export function createBorderProps(
  node: DefaultShapeMixin,
): Record<string, string | number> {
  const strokes = node.strokes;
  if (strokes.length === 0) {
    return {};
  }

  const stroke = strokes[0];
  if (!stroke || !stroke.visible || stroke.type !== "SOLID") {
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
    borderColor: `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${
      stroke.opacity
    })`,
  };
}
