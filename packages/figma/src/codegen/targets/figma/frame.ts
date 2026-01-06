import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsConverters } from "./props";

export interface FrameTransformerDeps {
  propsConverters: PropsConverters;
}

export function createFrameTransformer({
  propsConverters,
}: FrameTransformerDeps): ElementTransformer<
  NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode
> {
  return defineElementTransformer(
    (node: NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode, traverse) => {
      const children = node.children;

      const props = {
        ...propsConverters.radius(node),
        ...propsConverters.containerLayout(node),
        ...propsConverters.selfLayout(node),
        ...propsConverters.frameFill(node),
        ...propsConverters.stroke(node),
        ...propsConverters.shadow(node),
      };

      return createElement(
        "Frame",
        props,
        children.map((child) => traverse(child)),
      );
    },
  );
}
