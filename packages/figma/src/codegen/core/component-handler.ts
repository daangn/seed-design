import type { NormalizedInstanceNode, NormalizedSceneNode } from "@/normalizer";
import type { ElementNode } from "./jsx";

export interface ComponentHandler<
  T extends
    NormalizedInstanceNode["componentProperties"] = NormalizedInstanceNode["componentProperties"],
> {
  key: string;
  transform: (
    node: Omit<NormalizedInstanceNode, "componentProperties"> & { componentProperties: T },
    traverse: (node: NormalizedSceneNode) => ElementNode | undefined,
  ) => ElementNode;
}

export function defineComponentHandler<T extends NormalizedInstanceNode["componentProperties"]>(
  key: string,
  transform: (
    node: Omit<NormalizedInstanceNode, "componentProperties"> & { componentProperties: T },
    traverse: (node: NormalizedSceneNode) => ElementNode | undefined,
  ) => ElementNode,
): ComponentHandler<T> {
  return { key, transform };
}
