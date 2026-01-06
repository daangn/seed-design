import type {
  NormalizedBooleanOperationNode,
  NormalizedRectangleNode,
  NormalizedVectorNode,
} from "@/normalizer";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import { createSeedReactElement } from "./element-factories";
import type { PropsConverters } from "./props";

export interface RectangleTransformerDeps {
  propsConverters: PropsConverters;
}

export function createRectangleTransformer({
  propsConverters,
}: RectangleTransformerDeps): ElementTransformer<NormalizedRectangleNode> {
  return defineElementTransformer((node: NormalizedRectangleNode) => {
    return createSeedReactElement(
      "Box",
      {
        ...propsConverters.selfLayout(node),
        ...propsConverters.shadow(node),
        background: "palette.gray200",
      },
      undefined,
      {
        comment: "Rectangle Node Placeholder",
      },
    );
  });
}

export function createVectorTransformer(): ElementTransformer<NormalizedVectorNode> {
  return defineElementTransformer(() => {
    return createElement("svg", {}, [], {
      comment: "Vector Node Placeholder",
    });
  });
}

export function createBooleanOperationTransformer(): ElementTransformer<NormalizedBooleanOperationNode> {
  return defineElementTransformer(() => {
    return createElement("svg", {}, [], {
      comment: "Boolean Operation Node Placeholder",
    });
  });
}
