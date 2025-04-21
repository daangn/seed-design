import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsTransformers } from "./props";

export interface FrameTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createFrameTransformer({
  propsTransformers,
}: FrameTransformerDeps): ElementTransformer<
  NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode
> {
  return defineElementTransformer(
    (node: NormalizedFrameNode | NormalizedInstanceNode | NormalizedComponentNode, traverse) => {
      const children = node.children;

      const props = {
        ...propsTransformers.radius(node, traverse),
        ...propsTransformers.containerLayout(node, traverse),
        ...propsTransformers.selfLayout(node, traverse),
        ...propsTransformers.frameFill(node, traverse),
        ...propsTransformers.stroke(node, traverse),
      };

      return createElement(
        "Frame",
        props,
        children.map((child) => traverse(child)),
      );
    },
  );
}
