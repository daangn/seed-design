declare interface ListHeaderVariant {
  /**
  * @default "mediumWeak"
  */
  variant: "mediumWeak" | "boldSolid";
}

declare type ListHeaderVariantMap = {
  [key in keyof ListHeaderVariant]: Array<ListHeaderVariant[key]>;
};

export declare type ListHeaderVariantProps = Partial<ListHeaderVariant>;

export declare const listHeaderVariantMap: ListHeaderVariantMap;

export declare const listHeader: ((
  props?: ListHeaderVariantProps,
) => string) & {
  splitVariantProps: <T extends ListHeaderVariantProps>(
    props: T,
  ) => [ListHeaderVariantProps, Omit<T, keyof ListHeaderVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const listHeaderSeedTagSpec: {
  readonly name: "ListHeader";
  readonly axes: readonly ["variant"];
  readonly defaults: { readonly variant: "mediumWeak" };
};
