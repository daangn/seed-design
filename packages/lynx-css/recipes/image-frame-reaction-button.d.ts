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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const imageFrameReactionButtonSeedTagSpec: {
  readonly name: "ImageFrameReactionButton";
  readonly axes: readonly [];
  readonly defaults: {};
};
