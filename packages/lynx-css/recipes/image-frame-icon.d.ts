declare interface ImageFrameIconVariant {
  
  disabled?: boolean;
  loading?: boolean;}

declare type ImageFrameIconVariantMap = {
  [key in keyof ImageFrameIconVariant]: Array<ImageFrameIconVariant[key]>;
};

export declare type ImageFrameIconVariantProps = Partial<ImageFrameIconVariant>;

export declare type ImageFrameIconSlotName = "root" | "text";

export declare const imageFrameIconVariantMap: ImageFrameIconVariantMap;

export declare const imageFrameIcon: ((
  props?: ImageFrameIconVariantProps,
) => Record<ImageFrameIconSlotName, string>) & {
  splitVariantProps: <T extends ImageFrameIconVariantProps>(
    props: T,
  ) => [ImageFrameIconVariantProps, Omit<T, keyof ImageFrameIconVariantProps>];
}