declare interface AspectRatioVariant {
  
}

declare type AspectRatioVariantMap = {
  [key in keyof AspectRatioVariant]: Array<AspectRatioVariant[key]>;
};

export declare type AspectRatioVariantProps = Partial<AspectRatioVariant>;

export declare const aspectRatioVariantMap: AspectRatioVariantMap;

export declare const aspectRatio: ((
  props?: AspectRatioVariantProps,
) => string) & {
  splitVariantProps: <T extends AspectRatioVariantProps>(
    props: T,
  ) => [AspectRatioVariantProps, Omit<T, keyof AspectRatioVariantProps>];
}