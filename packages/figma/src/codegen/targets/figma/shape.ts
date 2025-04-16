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
    return createElement("Rectangle", { ...propsTransformers.selfLayout(node, traverse) });
  });
}

export interface VectorTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createVectorTransformer({
  propsTransformers,
}: VectorTransformerDeps): ElementTransformer<NormalizedVectorNode> {
  return defineElementTransformer((node, traverse) => {
    return createElement(
      "Vector",
      {
        ...propsTransformers.selfLayout(node, traverse),
        ...propsTransformers.radius(node, traverse),
        ...propsTransformers.stroke(node, traverse),
        ...propsTransformers.shapeFill(node, traverse),
      },
      [],
      "Vector Node Placeholder",
    );
  });
}

export interface BooleanOperationTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createBooleanOperationTransformer({
  propsTransformers,
}: BooleanOperationTransformerDeps): ElementTransformer<NormalizedBooleanOperationNode> {
  return defineElementTransformer((node, traverse) => {
    return createElement(
      "BooleanOperation",
      {
        ...propsTransformers.selfLayout(node, traverse),
        ...propsTransformers.radius(node, traverse),
        ...propsTransformers.stroke(node, traverse),
        ...propsTransformers.shapeFill(node, traverse),
      },
      node.children.map(traverse),
    );
  });
}
