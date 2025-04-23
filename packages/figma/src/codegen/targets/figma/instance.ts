import type { NormalizedInstanceNode } from "@/normalizer";
import { defineElementTransformer, type ElementTransformer } from "../../core";

export interface InstanceTransformerDeps {
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
}

export function createInstanceTransformer({
  frameTransformer,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    return frameTransformer(node, traverse);
  });

  return transform;
}
