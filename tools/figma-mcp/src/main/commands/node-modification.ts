import { getFigmaVariableKey } from "@seed-design/figma";

export interface FillColorParams {
  nodeId: string;
  colorToken: string;
}

export interface FillColorResult {
  id: string;
  success: boolean;
}

/**
 * Set the fill color of a node
 */
export async function setFillColor(params: FillColorParams): Promise<FillColorResult> {
  const { nodeId, colorToken } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  figma.currentPage.selection = [node as SceneNode];

  if (!("fills" in node)) {
    throw new Error(`Node type does not support fills: ${nodeId}`);
  }

  const variableKey = getFigmaVariableKey(colorToken);
  if (!variableKey) {
    throw new Error(`Variable not found: ${colorToken}`);
  }

  const variable = await figma.variables.importVariableByKeyAsync(variableKey);
  if (!variable) {
    throw new Error(`Variable key not found: ${variableKey}`);
  }

  const solidPaint = figma.util.solidPaint("#000000");
  node.fills = [figma.variables.setBoundVariableForPaint(solidPaint, "color", variable)];

  return {
    id: node.id,
    success: true,
  };
}

export interface StrokeColorParams {
  nodeId: string;
  colorToken: string;
}

export interface StrokeColorResult {
  id: string;
  success: boolean;
}

/**
 * Set the stroke color of a node
 */
export async function setStrokeColor(params: StrokeColorParams): Promise<StrokeColorResult> {
  const { nodeId, colorToken } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  figma.currentPage.selection = [node as SceneNode];

  if (!("strokes" in node)) {
    throw new Error(`Node does not support strokes: ${nodeId}`);
  }

  const variableKey = getFigmaVariableKey(colorToken);
  if (!variableKey) {
    throw new Error(`Variable key not found: ${colorToken}`);
  }

  const variable = await figma.variables.importVariableByKeyAsync(variableKey);
  if (!variable) {
    throw new Error(`Variable not found: ${colorToken}`);
  }

  const solidPaint = figma.util.solidPaint(colorToken);
  node.strokes = [figma.variables.setBoundVariableForPaint(solidPaint, "color", variable)];

  return {
    id: node.id,
    success: true,
  };
}

export interface SetAutoLayoutParams {
  nodeId: string;
  layoutMode?: "HORIZONTAL" | "VERTICAL";
  primaryAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "BASELINE";
  layoutWrap?: "NO_WRAP" | "WRAP";
  itemSpacing?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface SetAutoLayoutResult {
  id: string;
  success: boolean;
}

export async function setAutoLayout(params: SetAutoLayoutParams): Promise<SetAutoLayoutResult> {
  const {
    nodeId,
    layoutMode,
    primaryAxisAlignItems,
    counterAxisAlignItems,
    layoutWrap,
    itemSpacing,
    horizontalPadding,
    verticalPadding,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  figma.currentPage.selection = [node as SceneNode];

  if (!("layoutMode" in node)) {
    throw new Error(`Node does not support layout: ${nodeId}`);
  }

  if (layoutMode) {
    node.layoutMode = layoutMode;
  }

  if (primaryAxisAlignItems) {
    node.primaryAxisAlignItems = primaryAxisAlignItems;
  }

  if (counterAxisAlignItems) {
    node.counterAxisAlignItems = counterAxisAlignItems;
  }

  if (layoutWrap) {
    node.layoutWrap = layoutWrap;
  }

  if (itemSpacing) {
    node.itemSpacing = itemSpacing;
  }

  if (horizontalPadding) {
    node.horizontalPadding = horizontalPadding;
  }

  if (verticalPadding) {
    node.verticalPadding = verticalPadding;
  }

  if (paddingLeft) {
    node.paddingLeft = paddingLeft;
  }

  if (paddingRight) {
    node.paddingRight = paddingRight;
  }

  if (paddingTop) {
    node.paddingTop = paddingTop;
  }

  if (paddingBottom) {
    node.paddingBottom = paddingBottom;
  }

  return {
    id: node.id,
    success: true,
  };
}

export interface SetSizeParams {
  nodeId: string;
  layoutSizingHorizontal?: "FILL" | "HUG";
  layoutSizingVertical?: "FILL" | "HUG";
  width?: number;
  height?: number;
}

export interface SetSizeResult {
  id: string;
  success: boolean;
}

export async function setSize(params: SetSizeParams): Promise<SetSizeResult> {
  const { nodeId, layoutSizingHorizontal, layoutSizingVertical, width, height } = params || {};

  if (!nodeId) {
    throw new Error("Node ID is required");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  figma.currentPage.selection = [node as SceneNode];

  if (layoutSizingHorizontal === "FILL") {
    if (!("layoutSizingHorizontal" in node)) {
      throw new Error(`Node does not support layout sizing: ${nodeId}`);
    }
    node.layoutSizingHorizontal = "FILL";
  }

  if (layoutSizingHorizontal === "HUG") {
    if (!("layoutSizingHorizontal" in node)) {
      throw new Error(`Node does not support layout sizing: ${nodeId}`);
    }
    node.layoutSizingHorizontal = "HUG";
  }

  if (layoutSizingVertical === "FILL") {
    if (!("layoutSizingVertical" in node)) {
      throw new Error(`Node does not support layout sizing: ${nodeId}`);
    }
    node.layoutSizingVertical = "FILL";
  }

  if (layoutSizingVertical === "HUG") {
    if (!("layoutSizingVertical" in node)) {
      throw new Error(`Node does not support layout sizing: ${nodeId}`);
    }
    node.layoutSizingVertical = "HUG";
  }

  if (typeof width === "number" || typeof height === "number") {
    if (!("resize" in node)) {
      throw new Error(`Node does not support resize: ${nodeId}`);
    }
    node.resize(width ?? node.width, height ?? node.height);
  }

  return {
    id: node.id,
    success: true,
  };
}
