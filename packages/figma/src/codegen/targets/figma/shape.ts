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
    return createElement("Rectangle", { ...propsConverters.selfLayout(node) });
  });
}

export interface VectorTransformerDeps {
  propsConverters: PropsConverters;
}

export function createVectorTransformer({
  propsConverters,
}: VectorTransformerDeps): ElementTransformer<NormalizedVectorNode> {
  return defineElementTransformer((node) => {
    return createElement(
      "Vector",
      {
        ...propsConverters.selfLayout(node),
        ...propsConverters.radius(node),
        ...propsConverters.stroke(node),
        ...propsConverters.shapeFill(node),
        ...propsConverters.shadow(node),
      },
      [],
      {
        comment: "Vector Node Placeholder",
      },
    );
  });
}

export interface BooleanOperationTransformerDeps {
  propsConverters: PropsConverters;
}

export function createBooleanOperationTransformer({
  propsConverters,
}: BooleanOperationTransformerDeps): ElementTransformer<NormalizedBooleanOperationNode> {
  return defineElementTransformer((node, traverse) => {
    return createElement(
      "BooleanOperation",
      {
        ...propsConverters.selfLayout(node),
        ...propsConverters.radius(node),
        ...propsConverters.stroke(node),
        ...propsConverters.shapeFill(node),
      },
      node.children.map(traverse),
    );
  });
}
