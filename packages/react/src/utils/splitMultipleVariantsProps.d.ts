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

export declare function splitMultipleVariantsProps<
  R extends Record<string, { splitVariantProps: (...args: never[]) => unknown[] }>,
  P,
>(
  props: P,
  recipesMap: R,
): [{ [K in keyof R]: ExtractVariantProps<R[K]> }, Omit<P, ExtractAllVariantKeys<R>>];
