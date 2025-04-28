import type { NormalizedInstanceNode } from "@/normalizer";
import type { ElementNode } from "./jsx";

export interface ComponentHandler<
  T extends
    NormalizedInstanceNode["componentProperties"] = NormalizedInstanceNode["componentProperties"],
> {
  key: string;
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode;
}

export function defineComponentHandler<T extends NormalizedInstanceNode["componentProperties"]>(
  key: string,
  transform: (node: NormalizedInstanceNode & { componentProperties: T }) => ElementNode,
): ComponentHandler<T> {
  return { key, transform };
}
