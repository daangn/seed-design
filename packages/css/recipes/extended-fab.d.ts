declare interface ExtendedFabVariant {
  /**
  * @default "neutralSolid"
  */
  variant: "neutralSolid" | "layerFloating";
/**
  * @default "medium"
  */
  size: "small" | "medium";
}

declare type ExtendedFabVariantMap = {
  [key in keyof ExtendedFabVariant]: Array<ExtendedFabVariant[key]>;
};

export declare type ExtendedFabVariantProps = Partial<ExtendedFabVariant>;

export declare const extendedFabVariantMap: ExtendedFabVariantMap;

export declare const extendedFab: ((
  props?: ExtendedFabVariantProps,
) => string) & {
  splitVariantProps: <T extends ExtendedFabVariantProps>(
    props: T,
  ) => [ExtendedFabVariantProps, Omit<T, keyof ExtendedFabVariantProps>];
}