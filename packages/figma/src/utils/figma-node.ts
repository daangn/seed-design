import type {
  NormalizedHasGeometryTrait,
  NormalizedInstanceNode,
  NormalizedSceneNode,
  NormalizedSolidPaint,
} from "../normalizer";

export function traverseNode(
  node: NormalizedSceneNode,
  callback: (node: NormalizedSceneNode) => void,
) {
  callback(node);

  if (!("children" in node)) return;

  for (const child of node.children) {
    traverseNode(child, callback);
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
  ) as (Omit<NormalizedInstanceNode, "componentProperties"> & { componentProperties: T })[];
}

export function getFirstSolidFill(node: NormalizedHasGeometryTrait) {
  const fills = node.fills.filter(
    (fill): fill is NormalizedSolidPaint =>
      fill.type === "SOLID" && (!("visible" in fill) || fill.visible === true),
  );

  if (fills.length === 0) {
    return undefined;
  }

  return fills[0];
}

export function getFirstFillVariable(node: NormalizedHasGeometryTrait) {
  const fill = getFirstSolidFill(node);

  return fill?.boundVariables?.color;
}

export function getFirstStroke(node: NormalizedHasGeometryTrait) {
  const strokes =
    node.strokes?.filter(
      (stroke): stroke is NormalizedSolidPaint =>
        stroke.type === "SOLID" && (!("visible" in stroke) || stroke.visible === true),
    ) ?? [];

  if (strokes.length === 0) {
    return undefined;
  }

  return strokes[0];
}

export function getFirstStrokeVariable(node: NormalizedHasGeometryTrait) {
  const stroke = getFirstStroke(node);

  return stroke?.boundVariables?.color;
}
