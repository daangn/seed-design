declare interface ListVariant {
  
}

declare type ListVariantMap = {
  [key in keyof ListVariant]: Array<ListVariant[key]>;
};

export declare type ListVariantProps = Partial<ListVariant>;

export declare const listVariantMap: ListVariantMap;

export declare const list: ((
  props?: ListVariantProps,
) => string) & {
  splitVariantProps: <T extends ListVariantProps>(
    props: T,
  ) => [ListVariantProps, Omit<T, keyof ListVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const listSeedTagSpec: {
  readonly name: "List";
  readonly axes: readonly [];
  readonly defaults: {};
};
