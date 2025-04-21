import type { NormalizedTextNode } from "@/normalizer";
import { compactObject } from "@/utils/common";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsTransformers } from "./props";

export interface TextTransformerDeps {
  propsTransformers: PropsTransformers;
}

export function createTextTransformer({
  propsTransformers,
}: TextTransformerDeps): ElementTransformer<NormalizedTextNode> {
  return defineElementTransformer((node: NormalizedTextNode, traverse) => {
    const hasMultipleFills = node.fills.length > 1;

    const fillProps = propsTransformers.textFill(node, traverse);
    const typeStyleProps = propsTransformers.typeStyle(node, traverse);

    const props = compactObject({
      ...typeStyleProps,
      ...fillProps,
    });

    return createElement(
      "Text",
      props,
      node.characters,
      hasMultipleFills
        ? "Multiple fills in Text node encountered, only the first fill is used."
        : "",
    );
  });
}
