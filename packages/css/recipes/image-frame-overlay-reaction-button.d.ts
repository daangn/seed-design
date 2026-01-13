declare interface ImageFrameOverlayReactionButtonVariant {
  
}

declare type ImageFrameOverlayReactionButtonVariantMap = {
  [key in keyof ImageFrameOverlayReactionButtonVariant]: Array<ImageFrameOverlayReactionButtonVariant[key]>;
};

export declare type ImageFrameOverlayReactionButtonVariantProps = Partial<ImageFrameOverlayReactionButtonVariant>;

export declare const imageFrameOverlayReactionButtonVariantMap: ImageFrameOverlayReactionButtonVariantMap;

export declare const imageFrameOverlayReactionButton: ((
  props?: ImageFrameOverlayReactionButtonVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameOverlayReactionButtonVariantProps>(
    props: T,
  ) => [ImageFrameOverlayReactionButtonVariantProps, Omit<T, keyof ImageFrameOverlayReactionButtonVariantProps>];
}