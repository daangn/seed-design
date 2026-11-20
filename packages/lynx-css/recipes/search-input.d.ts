declare interface SearchInputVariant {
  
}

declare type SearchInputVariantMap = {
  [key in keyof SearchInputVariant]: Array<SearchInputVariant[key]>;
};

export declare type SearchInputVariantProps = Partial<SearchInputVariant>;

export declare type SearchInputSlotName = "root" | "value" | "clearButton" | "clearButtonIcon";

export declare const searchInputVariantMap: SearchInputVariantMap;

export declare const searchInput: ((
  props?: SearchInputVariantProps,
) => Record<SearchInputSlotName, string>) & {
  splitVariantProps: <T extends SearchInputVariantProps>(
    props: T,
  ) => [SearchInputVariantProps, Omit<T, keyof SearchInputVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const searchInputSeedTagSpec: {
  readonly name: "SearchInput";
  readonly axes: readonly [];
  readonly defaults: {};
};
