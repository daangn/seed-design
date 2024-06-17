import postcss from "postcss";
import postcssJs from "postcss-js";
import postcssNested from "postcss-nested";

import { compact } from "./compact";
import type { SlotRecipeDefinition, SlotRecipeVariantRecord } from "./types";

type Definition = SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>;

export function generateBaseRules({
  name,
  definition,
}: {
  name: string;
  definition: Definition["base"];
}) {
  return Object.entries(definition).map(([slot, style]) => {
    if (!style) {
      return undefined;
    }
    const parsed = postcssJs.parse(style);
    return postcss.rule({
      selector: `.${name}__${slot}`,
      nodes: parsed.nodes,
    });
  });
}

export function generateVariantRules({
  name,
  definition,
}: {
  name: string;
  definition: Definition["variants"];
}) {
  return Object.entries(definition).flatMap(([variantName, variant]) => {
    return Object.entries(variant).flatMap(([variantValue, variantStyles]) => {
      return Object.entries(variantStyles).map(([slot, style]) => {
        if (!style) {
          return undefined;
        }
        const parsed = postcssJs.parse(style);
        return postcss.rule({
          selector: `.${name}__${slot}--${variantName}_${variantValue}`,
          nodes: parsed.nodes,
        });
      });
    });
  });
}

export function generateCompoundVariantRules({
  name,
  definition,
}: {
  name: string;
  definition: NonNullable<Definition["compoundVariants"]>;
}) {
  return definition.flatMap(({ css, ...selection }) => {
    return Object.entries(css).map(([slot, style]) => {
      if (!style) {
        return undefined;
      }

      const selector = `.${name}__${slot}--${Object.entries(selection)
        .map(([variantName, variantValue]) => `${variantName}_${variantValue}`)
        .join("-")}`;
      const parsed = postcssJs.parse(style);

      return postcss.rule({
        selector: selector,
        nodes: parsed.nodes,
      });
    });
  });
}

export function generateKeyframeRules(definition: Definition["keyframes"]) {
  return Object.entries(definition ?? {}).flatMap(
    ([keyframeName, keyframe]) => {
      const parsed = postcssJs.parse(keyframe);
      return postcss.atRule({
        name: "keyframes",
        params: keyframeName,
        nodes: parsed.nodes,
      });
    },
  );
}

export async function transpileRulesToCss(
  rules: (postcss.AtRule | postcss.Rule | undefined)[],
) {
  const root = postcss.root({
    nodes: compact(rules),
  });

  const css = await postcss([postcssNested()])
    // @ts-expect-error
    .process(root, { from: undefined, parser: postcssJs })
    .then((result) => {
      return result.css;
    });

  return css;
}

export async function generateCss(definition: Definition): Promise<string> {
  const baseRules = generateBaseRules({
    name: definition.name,
    definition: definition.base,
  });
  const variantRules = generateVariantRules({
    name: definition.name,
    definition: definition.variants,
  });
  const compoundVariantRules = generateCompoundVariantRules({
    name: definition.name,
    definition: definition.compoundVariants ?? [],
  });
  const keyframeRules = generateKeyframeRules(definition.keyframes);

  return transpileRulesToCss([
    ...baseRules,
    ...variantRules,
    ...compoundVariantRules,
    ...keyframeRules,
  ]);
}
