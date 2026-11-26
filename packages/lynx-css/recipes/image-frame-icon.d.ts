declare interface ImageFrameIconVariant {
  
}

declare type ImageFrameIconVariantMap = {
  [key in keyof ImageFrameIconVariant]: Array<ImageFrameIconVariant[key]>;
};

export declare type ImageFrameIconVariantProps = Partial<ImageFrameIconVariant>;

export declare const imageFrameIconVariantMap: ImageFrameIconVariantMap;

export declare const imageFrameIcon: ((
  props?: ImageFrameIconVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameIconVariantProps>(
    props: T,
  ) => [ImageFrameIconVariantProps, Omit<T, keyof ImageFrameIconVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const imageFrameIconSeedTagSpec: {
  readonly name: "ImageFrameIcon";
  readonly axes: readonly [];
  readonly defaults: {};
};
