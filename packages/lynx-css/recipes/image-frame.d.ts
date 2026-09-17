declare interface ImageFrameVariant {
  /**
  * @default false
  */
  stroke: boolean;
/**
  * @default false
  */
  loaded: boolean;
/**
  * @default "bottom-end"
  */
  placement: "top-start" | "top-center" | "top-end" | "middle-start" | "middle-center" | "middle-end" | "bottom-start" | "bottom-center" | "bottom-end";
}

declare type ImageFrameVariantMap = {
  [key in keyof ImageFrameVariant]: Array<ImageFrameVariant[key]>;
};

export declare type ImageFrameVariantProps = Partial<ImageFrameVariant>;

export declare type ImageFrameSlotName = "root" | "content" | "fallback" | "stroke" | "floater";

export declare const imageFrameVariantMap: ImageFrameVariantMap;

export declare const imageFrame: ((
  props?: ImageFrameVariantProps,
) => Record<ImageFrameSlotName, string>) & {
  splitVariantProps: <T extends ImageFrameVariantProps>(
    props: T,
  ) => [ImageFrameVariantProps, Omit<T, keyof ImageFrameVariantProps>];
}
