import type { NormalizedSceneNode } from "@/normalizer";
import type { ElementNode } from "./jsx";

export type ElementTransformer<T extends NormalizedSceneNode> = (
  node: T,
  traverse: (node: NormalizedSceneNode) => ElementNode | undefined,
) => ElementNode | undefined;

export function defineElementTransformer<T extends NormalizedSceneNode>(
  transformer: ElementTransformer<T>,
) {
  return transformer;
}
