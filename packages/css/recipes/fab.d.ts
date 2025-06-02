declare interface FabVariant {
  
}

declare type FabVariantMap = {
  [key in keyof FabVariant]: Array<FabVariant[key]>;
};

export declare type FabVariantProps = Partial<FabVariant>;

export declare const fabVariantMap: FabVariantMap;

export declare const fab: ((
  props?: FabVariantProps,
) => string) & {
  splitVariantProps: <T extends FabVariantProps>(
    props: T,
  ) => [FabVariantProps, Omit<T, keyof FabVariantProps>];
}