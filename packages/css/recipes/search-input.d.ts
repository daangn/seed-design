declare interface SearchInputVariant {
  
}

declare type SearchInputVariantMap = {
  [key in keyof SearchInputVariant]: Array<SearchInputVariant[key]>;
};

export declare type SearchInputVariantProps = Partial<SearchInputVariant>;

export declare type SearchInputSlotName = "root" | "value" | "clearButton";

export declare const searchInputVariantMap: SearchInputVariantMap;

export declare const searchInput: ((
  props?: SearchInputVariantProps,
) => Record<SearchInputSlotName, string>) & {
  splitVariantProps: <T extends SearchInputVariantProps>(
    props: T,
  ) => [SearchInputVariantProps, Omit<T, keyof SearchInputVariantProps>];
}