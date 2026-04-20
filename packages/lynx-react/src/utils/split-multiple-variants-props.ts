type Recipe = { splitVariantProps: (...args: never[]) => [unknown, unknown] };

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
 * Split props into multiple recipe variant buckets at once.
 *
 * Each recipe in `recipesMap` picks the variant keys it knows about via its
 * `splitVariantProps`. Keys that appear in more than one recipe (e.g. a shared
 * `size` variant) land in every matching bucket. The second element is the
 * props that no recipe claimed.
 */
export function splitMultipleVariantsProps<R extends Record<string, Recipe>, P>(
  props: P,
  recipesMap: R,
): [{ [K in keyof R]: ExtractVariantProps<R[K]> }, Omit<P, ExtractAllVariantKeys<R>>] {
  const multipleVariantsProps = {} as { [K in keyof R]: ExtractVariantProps<R[K]> };
  const extractedKeys = new Set<string>();

  for (const recipeKey in recipesMap) {
    const [variantProps] = recipesMap[recipeKey].splitVariantProps(props as never);
    multipleVariantsProps[recipeKey] = variantProps as ExtractVariantProps<R[typeof recipeKey]>;
    for (const k in variantProps as Record<string, unknown>) extractedKeys.add(k);
  }

  const remainingProps = {} as Record<string, unknown>;
  for (const k in props as Record<string, unknown>) {
    if (!extractedKeys.has(k)) remainingProps[k] = (props as Record<string, unknown>)[k];
  }

  return [multipleVariantsProps, remainingProps as Omit<P, ExtractAllVariantKeys<R>>];
}
