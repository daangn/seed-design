import type { SolidPaint } from "@figma/rest-api-spec";
import type {
  NormalizedHasGeometryTrait,
  NormalizedInstanceNode,
  NormalizedIsLayerTrait,
  NormalizedSceneNode,
} from "../normalizer";
export function traverseNode(
  node: NormalizedSceneNode,
  callback: (node: NormalizedSceneNode) => void,
) {
  if ("children" in node) {
    node.children.forEach((child) => traverseNode(child, callback));
  } else {
    callback(node);
  }
}

export function findOne(
  node: NormalizedSceneNode,
  callback: (node: NormalizedSceneNode) => boolean,
) {
  let result: NormalizedSceneNode | undefined;

  traverseNode(node, (n) => {
    if (callback(n)) {
      result = n;
    }
  });

  return result;
}

export function findAll(
  node: NormalizedSceneNode,
  callback: (node: NormalizedSceneNode) => boolean,
) {
  const result: NormalizedSceneNode[] = [];

  traverseNode(node, (n) => {
    if (callback(n)) {
      result.push(n);
    }
  });

  return result;
}

export function findAllInstances<T>({ node, key }: { node: NormalizedSceneNode; key: string }) {
  return findAll(
    node,
    (n) => n.type === "INSTANCE" && (n.componentKey === key || n.componentSetKey === key),
  ) as (NormalizedInstanceNode & { componentProperties: T })[];
}

export function getFirstSolidFill(node: NormalizedHasGeometryTrait) {
  const fills = node.fills.filter(
    (fill): fill is SolidPaint =>
      fill.type === "SOLID" && (!("visible" in fill) || fill.visible === true),
  );

  if (fills.length === 0) {
    return undefined;
  }

  return fills[0];
}

export function getFirstFillVariable(node: NormalizedIsLayerTrait) {
  return node.boundVariables?.fills?.[0];
}

export function getFirstStroke(node: NormalizedHasGeometryTrait) {
  const strokes =
    node.strokes?.filter(
      (stroke): stroke is SolidPaint =>
        stroke.type === "SOLID" && (!("visible" in stroke) || stroke.visible === true),
    ) ?? [];

  if (strokes.length === 0) {
    return undefined;
  }

  return strokes[0];
}

export function getFirstStrokeVariable(node: NormalizedIsLayerTrait) {
  return node.boundVariables?.strokes?.[0];
}
