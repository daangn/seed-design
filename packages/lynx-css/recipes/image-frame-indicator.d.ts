declare interface ImageFrameIndicatorVariant {
  
}

declare type ImageFrameIndicatorVariantMap = {
  [key in keyof ImageFrameIndicatorVariant]: Array<ImageFrameIndicatorVariant[key]>;
};

export declare type ImageFrameIndicatorVariantProps = Partial<ImageFrameIndicatorVariant>;

export declare type ImageFrameIndicatorSlotName = "root" | "label";

export declare const imageFrameIndicatorVariantMap: ImageFrameIndicatorVariantMap;

export declare const imageFrameIndicator: ((
  props?: ImageFrameIndicatorVariantProps,
) => Record<ImageFrameIndicatorSlotName, string>) & {
  splitVariantProps: <T extends ImageFrameIndicatorVariantProps>(
    props: T,
  ) => [ImageFrameIndicatorVariantProps, Omit<T, keyof ImageFrameIndicatorVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const imageFrameIndicatorSeedTagSpec: {
  readonly name: "ImageFrameIndicator";
  readonly axes: readonly [];
  readonly defaults: {};
};
