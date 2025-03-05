import postcss from "postcss";
import postcssNested from "postcss-nested";

import { transform } from "lightningcss";
import { compact } from "./compact";
import parseCssJs from "./parser";
import type {
  CssgenConfig,
  CssKeyframes,
  Config,
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
      const parsed = parseCssJs(style);
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
          const parsed = parseCssJs(style);
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
        const parsed = parseCssJs(style);

        return postcss.rule({
          selector: selector,
          nodes: parsed.nodes,
        });
      });
    }) ?? [],
  );
}

export function generateKeyframeRules(definitions: CssKeyframes) {
  return Object.entries(definitions ?? {}).flatMap(([name, keyframe]) => {
    const parsed = parseCssJs(keyframe);
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
    .process(root, { from: undefined, parser: parseCssJs })
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

export async function generateEachRecipe(
  config: Config,
  cssConfig: CssgenConfig = {},
): Promise<{ name: string; css: string }[]> {
  const { prefix, theme } = config;
  const { minify = false } = cssConfig;

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

  return [...recipes];
}

export async function generateBaseBundle(
  config: Config,
  cssConfig: CssgenConfig = {},
): Promise<string> {
  const { theme } = config;
  const { minify = false } = cssConfig;
  const globalRules = parseCssJs(theme.globalCss ?? {}).nodes;
  const tokenRules = generateTokenRules(theme.tokens);
  const keyframeRules = generateKeyframeRules(theme.keyframes);
  const rules = [...globalRules, ...tokenRules, ...keyframeRules];
  const css = await transpileRulesToCss(rules);

  return transform({
    filename: "qvism.css",
    code: Buffer.from(css),
    minify,
  }).code.toString();
}

export async function generateAllBundle(
  config: Config,
  cssConfig: CssgenConfig = {},
): Promise<string> {
  const { prefix, theme } = config;
  const { minify = false } = cssConfig;
  const options = { prefix };
  const globalRules = parseCssJs(theme.globalCss ?? {}).nodes;
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
