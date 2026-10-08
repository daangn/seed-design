declare interface ImageFrameReactionButtonVariant {
  
}

declare type ImageFrameReactionButtonVariantMap = {
  [key in keyof ImageFrameReactionButtonVariant]: Array<ImageFrameReactionButtonVariant[key]>;
};

export declare type ImageFrameReactionButtonVariantProps = Partial<ImageFrameReactionButtonVariant>;

export declare type ImageFrameReactionButtonSlotName = "root" | "fillIcon" | "lineIcon";

export declare const imageFrameReactionButtonVariantMap: ImageFrameReactionButtonVariantMap;

export declare const imageFrameReactionButton: ((
  props?: ImageFrameReactionButtonVariantProps,
) => Record<ImageFrameReactionButtonSlotName, string>) & {
  splitVariantProps: <T extends ImageFrameReactionButtonVariantProps>(
    props: T,
  ) => [ImageFrameReactionButtonVariantProps, Omit<T, keyof ImageFrameReactionButtonVariantProps>];
}