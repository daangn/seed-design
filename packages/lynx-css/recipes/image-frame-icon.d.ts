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