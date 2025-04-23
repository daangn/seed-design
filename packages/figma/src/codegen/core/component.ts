import type { NormalizedInstanceNode } from "@/normalizer";
import type { ElementNode } from "./jsx";

export interface ComponentTransformer<
  T extends
    NormalizedInstanceNode["componentProperties"] = NormalizedInstanceNode["componentProperties"],
> {
  key: string;
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode;
}

export function defineComponentTransformer<T extends NormalizedInstanceNode["componentProperties"]>(
  key: string,
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode,
): ComponentTransformer<T> {
  return { key, transform };
}
