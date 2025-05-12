import type { NormalizedTextNode } from "@/normalizer";
import { compactObject } from "@/utils/common";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";
import type { PropsConverters } from "./props";

export interface TextTransformerDeps {
  propsConverters: PropsConverters;
}

export function createTextTransformer({
  propsConverters,
}: TextTransformerDeps): ElementTransformer<NormalizedTextNode> {
  return defineElementTransformer((node: NormalizedTextNode) => {
    const hasMultipleFills = node.fills.length > 1;

    const fillProps = propsConverters.textFill(node);
    const typeStyleProps = propsConverters.typeStyle(node);

    const props = compactObject({
      ...typeStyleProps,
      ...fillProps,
    });

    return createElement("Text", props, node.characters, {
      comment: hasMultipleFills
        ? "Multiple fills in Text node encountered, only the first fill is used."
        : undefined,
    });
  });
}
