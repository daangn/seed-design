declare interface ImageFrameIndicatorVariant {
  
  disabled?: true;
  loading?: true;}

declare type ImageFrameIndicatorVariantMap = {
  [key in keyof ImageFrameIndicatorVariant]: Array<ImageFrameIndicatorVariant[key]>;
};

export declare type ImageFrameIndicatorVariantProps = Partial<ImageFrameIndicatorVariant>;

export declare type ImageFrameIndicatorSlotName = "root" | "text";

export declare const imageFrameIndicatorVariantMap: ImageFrameIndicatorVariantMap;

export declare const imageFrameIndicator: ((
  props?: ImageFrameIndicatorVariantProps,
) => Record<ImageFrameIndicatorSlotName, string>) & {
  splitVariantProps: <T extends ImageFrameIndicatorVariantProps>(
    props: T,
  ) => [ImageFrameIndicatorVariantProps, Omit<T, keyof ImageFrameIndicatorVariantProps>];
}