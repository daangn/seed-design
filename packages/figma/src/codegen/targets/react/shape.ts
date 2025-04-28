import type {
  NormalizedBooleanOperationNode,
  NormalizedRectangleNode,
  NormalizedVectorNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsConverters } from "./props";

export interface RectangleTransformerDeps {
  propsConverters: PropsConverters;
}

export function createRectangleTransformer({
  propsConverters,
}: RectangleTransformerDeps): ElementTransformer<NormalizedRectangleNode> {
  return defineElementTransformer((node: NormalizedRectangleNode) => {
    return createElement(
      "Box",
      { ...propsConverters.selfLayout(node), background: "palette.gray200" },
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
