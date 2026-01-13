declare interface ImageFrameOverlayIconVariant {
  
}

declare type ImageFrameOverlayIconVariantMap = {
  [key in keyof ImageFrameOverlayIconVariant]: Array<ImageFrameOverlayIconVariant[key]>;
};

export declare type ImageFrameOverlayIconVariantProps = Partial<ImageFrameOverlayIconVariant>;

export declare const imageFrameOverlayIconVariantMap: ImageFrameOverlayIconVariantMap;

export declare const imageFrameOverlayIcon: ((
  props?: ImageFrameOverlayIconVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameOverlayIconVariantProps>(
    props: T,
  ) => [ImageFrameOverlayIconVariantProps, Omit<T, keyof ImageFrameOverlayIconVariantProps>];
}