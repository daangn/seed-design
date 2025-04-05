import type { NormalizedTextNode } from "@/normalizer";
import { compactObject } from "@/utils/common";
import { camelCase } from "change-case";
import { createElement, defineElementTransformer, type ElementTransformer } from "../core";
import type { FillPropsService, ShapeFillProps } from "./props/fill-props.service";
import type { TypeStylePropsService } from "./props/type-style-props.service";
import type { StyleService } from "./style.service";

export interface TextService {
  transform: ElementTransformer<NormalizedTextNode>;
}

export interface SeedTextServiceDeps {
  styleService: StyleService;
  fillPropsService: FillPropsService<ShapeFillProps>;
  typeStylePropsService: TypeStylePropsService;
}

export function createSeedTextService({
  styleService,
  fillPropsService,
  typeStylePropsService,
}: SeedTextServiceDeps): TextService {
  const transform = defineElementTransformer((node: NormalizedTextNode, traverse) => {
    const maxLines =
      node.style.textTruncation === "ENDING" ? (node.style.maxLines ?? undefined) : undefined;

    const hasMultipleFills = node.fills.length > 1;

    const fillProps = fillPropsService.transform(node, traverse);

    const styleName = node.textStyleKey ? styleService.getStyleName(node.textStyleKey) : undefined;
    const { fontSize, fontWeight, lineHeight } = typeStylePropsService.transform(node, traverse);

    const props = styleName
      ? compactObject({
          textStyle: camelCase(styleName, { mergeAmbiguousCharacters: true }),
          maxLines,
          ...fillProps,
        })
      : compactObject({
          fontSize,
          fontWeight,
          lineHeight,
          maxLines,
          ...fillProps,
        });

    return createElement(
      "Text",
      props,
      node.characters.replace(/\n/g, "<br />"),
      hasMultipleFills
        ? "Multiple fills in Text node encountered, only the first fill is used."
        : "",
    );
  });

  return {
    transform,
  };
}
