declare interface ImageFrameIndicatorVariant {
  
}

declare type ImageFrameIndicatorVariantMap = {
  [key in keyof ImageFrameIndicatorVariant]: Array<ImageFrameIndicatorVariant[key]>;
};

export declare type ImageFrameIndicatorVariantProps = Partial<ImageFrameIndicatorVariant>;

export declare const imageFrameIndicatorVariantMap: ImageFrameIndicatorVariantMap;

export declare const imageFrameIndicator: ((
  props?: ImageFrameIndicatorVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameIndicatorVariantProps>(
    props: T,
  ) => [ImageFrameIndicatorVariantProps, Omit<T, keyof ImageFrameIndicatorVariantProps>];
}