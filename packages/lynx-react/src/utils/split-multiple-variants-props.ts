type RecipeLike = {
  splitVariantProps: (props: Record<string, unknown>) => [Record<string, unknown>, unknown];
};

type ExtractVariantProps<T> = T extends {
  splitVariantProps: (...args: never[]) => [infer V, unknown];
}
  ? V
  : never;

type ExtractAllVariantKeys<R> = {
  [K in keyof R]: ExtractVariantProps<R[K]> extends infer V
    ? V extends Record<string, unknown>
      ? keyof V
      : never
    : never;
}[keyof R];

/**
 * Split `props` across multiple recipes' variant extractors in one pass.
 *
 * Given `recipesMap` of `{ [recipeKey]: recipe }`, returns:
 * - A bucket per recipe key with that recipe's variant-only props.
 * - `remainingProps` with every recipe variant key stripped out.
 *
 * Keys that appear in more than one recipe (e.g. shared `size`) are copied
 * into each corresponding bucket. `remainingProps` never includes any key
 * that any recipe claimed as a variant.
 *
 * Mirror of `packages/react/src/utils/splitMultipleVariantsProps` adapted
 * to TypeScript for Lynx. Use when a single compound component composes two
 * or more recipes (e.g. Switch's `switch` + `switchmark`).
 */
export function splitMultipleVariantsProps<R extends Record<string, RecipeLike>, P>(
  props: P,
  recipesMap: R,
): [{ [K in keyof R]: ExtractVariantProps<R[K]> }, Omit<P, ExtractAllVariantKeys<R>>] {
  const multipleVariantsProps = {} as { [K in keyof R]: ExtractVariantProps<R[K]> };
  const extractedKeys = new Set<string>();
  const propsRecord = props as Record<string, unknown>;

  for (const recipeKey in recipesMap) {
    const [variantProps] = recipesMap[recipeKey].splitVariantProps(propsRecord);
    multipleVariantsProps[recipeKey] = variantProps as ExtractVariantProps<R[keyof R]>;

    for (const variantPropKey in variantProps) {
      extractedKeys.add(variantPropKey);
    }
  }

  const remainingProps = {} as Record<string, unknown>;

  for (const propKey in propsRecord) {
    if (extractedKeys.has(propKey)) continue;
    remainingProps[propKey] = propsRecord[propKey];
  }

  return [multipleVariantsProps, remainingProps as Omit<P, ExtractAllVariantKeys<R>>];
}
