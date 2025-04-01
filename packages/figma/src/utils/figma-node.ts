import type { NormalizedInstanceNode, NormalizedSceneNode } from "../normalizer";

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
