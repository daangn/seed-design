declare interface ListHeaderVariant {
  
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