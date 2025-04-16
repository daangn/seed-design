import type {
  NormalizedBooleanOperationNode,
  NormalizedRectangleNode,
  NormalizedVectorNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsTransformers } from "./props";

export interface RectangleTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createRectangleTransformer({
  propsTransformers,
}: RectangleTransformerDeps): ElementTransformer<NormalizedRectangleNode> {
  return defineElementTransformer((node: NormalizedRectangleNode, traverse) => {
    return createElement(
      "Box",
      { ...propsTransformers.selfLayout(node, traverse), background: "palette.gray200" },
      undefined,
      "Rectangle Node Placeholder",
    );
  });
}

export function createVectorTransformer(): ElementTransformer<NormalizedVectorNode> {
  return defineElementTransformer(() => {
    return createElement("svg", {}, [], "Vector Node Placeholder");
  });
}

export function createBooleanOperationTransformer(): ElementTransformer<NormalizedBooleanOperationNode> {
  return defineElementTransformer(() => {
    return createElement("svg", {}, [], "Boolean Operation Node Placeholder");
  });
}
