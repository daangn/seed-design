declare interface ImageFrameOverlayIndicatorVariant {
  
}

declare type ImageFrameOverlayIndicatorVariantMap = {
  [key in keyof ImageFrameOverlayIndicatorVariant]: Array<ImageFrameOverlayIndicatorVariant[key]>;
};

export declare type ImageFrameOverlayIndicatorVariantProps = Partial<ImageFrameOverlayIndicatorVariant>;

export declare const imageFrameOverlayIndicatorVariantMap: ImageFrameOverlayIndicatorVariantMap;

export declare const imageFrameOverlayIndicator: ((
  props?: ImageFrameOverlayIndicatorVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameOverlayIndicatorVariantProps>(
    props: T,
  ) => [ImageFrameOverlayIndicatorVariantProps, Omit<T, keyof ImageFrameOverlayIndicatorVariantProps>];
}