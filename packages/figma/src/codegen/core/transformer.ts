import type { ElementNode } from "./jsx";
import type { NormalizedInstanceNode, NormalizedSceneNode } from "@/normalizer";

export type ElementTransformer<T extends NormalizedSceneNode> = (
  node: T,
  traverse: (node: NormalizedSceneNode) => ElementNode | undefined,
) => ElementNode | undefined;

export type PropsTransformer<
  T extends Record<string, any> = Record<string, any>,
  R extends Record<string, any> = Record<string, any>,
> = (node: T, traverse: (node: NormalizedSceneNode) => ElementNode | undefined) => R;

export interface ComponentTransformer<
  T extends
    NormalizedInstanceNode["componentProperties"] = NormalizedInstanceNode["componentProperties"],
> {
  key: string;
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode;
}

export function defineElementTransformer<T extends NormalizedSceneNode>(
  transformer: ElementTransformer<T>,
) {
  return transformer;
}

export function definePropsTransformer<
  T extends Record<string, any>,
  R extends Record<string, any>,
>(transformer: PropsTransformer<T, R>) {
  return transformer;
}

export function defineComponentTransformer<T extends NormalizedInstanceNode["componentProperties"]>(
  key: string,
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode,
): ComponentTransformer<T> {
  return { key, transform };
}
