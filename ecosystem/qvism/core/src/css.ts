import postcss from "postcss";
import postcssJs from "postcss-js";
import postcssNested from "postcss-nested";

import { transform } from "lightningcss";
import { compact } from "./compact";
import type {
  Config,
  KeyframeDefinition,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  Theme,
} from "./types";

type RecipeDefinition = SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>;

const prefixName = (name: string, options: { prefix?: string } = {}) =>
  options.prefix ? `${options.prefix}-${name}` : name;

export function generateBaseRules(definition: RecipeDefinition, options: { prefix?: string } = {}) {
  const name = prefixName(definition.name, options);
  return compact(
    Object.entries(definition.base).map(([slot, style]) => {
      if (!style) {
        return undefined;
      }
      const parsed = postcssJs.parse(style);
      return postcss.rule({
        selector: `.${name}__${slot}`,
        nodes: parsed.nodes,
      });
    }),
  );
}

export function generateVariantRules(
  definition: RecipeDefinition,
  options: { prefix?: string } = {},
) {
  const name = prefixName(definition.name, options);
  return compact(
    Object.entries(definition.variants).flatMap(([variantName, variant]) => {
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
    }),
  );
}

export function generateCompoundVariantRules(
  definition: RecipeDefinition,
  options: { prefix?: string } = {},
) {
  const name = prefixName(definition.name, options);
  return compact(
    definition.compoundVariants?.flatMap(({ css, ...selection }) => {
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
    }) ?? [],
  );
}

export function generateKeyframeRules(definitions: Record<string, KeyframeDefinition>) {
  return Object.entries(definitions ?? {}).flatMap(([name, keyframe]) => {
    const parsed = postcssJs.parse(keyframe);
    return postcss.atRule({
      name: "keyframes",
      params: name,
      nodes: parsed.nodes,
    });
  });
}

export async function transpileRulesToCss(rules: postcss.ChildNode[]): Promise<string> {
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

export function generateRecipeRules(recipe: RecipeDefinition, options: { prefix?: string } = {}) {
  const baseRules = generateBaseRules(recipe, options);
  const variantRules = generateVariantRules(recipe, options);
  const compoundVariantRules = generateCompoundVariantRules(recipe, options);

  return [...baseRules, ...variantRules, ...compoundVariantRules];
}

export function generateTokenRules(tokens: Theme["tokens"]): postcss.ChildNode[] {
  return postcss.parse(tokens._raw).nodes;
}

export async function generateCssEach(config: Config): Promise<{ name: string; css: string }[]> {
  const { minify = false, prefix, theme } = config;

  if (minify) {
    throw new Error("Minification is not supported for individual recipe generation yet.");
  }

  const recipes = await Promise.all(
    Object.values(theme.recipes).map(async (recipe) => {
      const name = recipe.name;
      const rules = generateRecipeRules(recipe, { prefix });
      const css = await transpileRulesToCss(rules);

      return { name, css };
    }),
  );

  const keyframes = {
    name: "keyframes",
    css: await transpileRulesToCss(generateKeyframeRules(theme.keyframes)),
  };

  return [...recipes, keyframes];
}

export async function generateCssBundle(config: Config): Promise<string> {
  const { minify = false, prefix, theme } = config;
  const options = { prefix };
  const globalRules = postcssJs.parse(config.globalCss ?? {}).nodes;
  const tokenRules = generateTokenRules(theme.tokens);
  const recipeRules = Object.values(theme.recipes).flatMap((recipe) =>
    generateRecipeRules(recipe, options),
  );
  const keyframeRules = generateKeyframeRules(theme.keyframes);
  const rules = [...globalRules, ...tokenRules, ...recipeRules, ...keyframeRules];
  const css = await transpileRulesToCss(rules);

  return transform({
    filename: "qvism.css",
    code: Buffer.from(css),
    minify,
  }).code.toString();
}
