declare interface ListVariant {}

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
