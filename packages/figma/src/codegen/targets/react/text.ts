import type { NormalizedTextNode } from "@/normalizer";
import { compactObject } from "@/utils/common";
import { defineElementTransformer, type ElementTransformer } from "../../core";
import { createSeedReactElement } from "./element-factories";
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

    return createSeedReactElement("Text", props, node.characters.replace(/\n/g, "<br />"), {
      comment: hasMultipleFills
        ? "Multiple fills in Text node encountered, only the first fill is used."
        : undefined,
    });
  });
}
