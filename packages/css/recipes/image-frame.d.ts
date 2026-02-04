declare interface ImageFrameVariant {
  /**
  * @default false
  */
  stroke: boolean;
/**
  * @default false
  */
  rounded: boolean;
}

declare type ImageFrameVariantMap = {
  [key in keyof ImageFrameVariant]: Array<ImageFrameVariant[key]>;
};

export declare type ImageFrameVariantProps = Partial<ImageFrameVariant>;

export declare const imageFrameVariantMap: ImageFrameVariantMap;

export declare const imageFrame: ((
  props?: ImageFrameVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameVariantProps>(
    props: T,
  ) => [ImageFrameVariantProps, Omit<T, keyof ImageFrameVariantProps>];
}