declare interface ImageFrameOverlayPositionerVariant {
  /**
  * @default "top-left"
  */
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

declare type ImageFrameOverlayPositionerVariantMap = {
  [key in keyof ImageFrameOverlayPositionerVariant]: Array<ImageFrameOverlayPositionerVariant[key]>;
};

export declare type ImageFrameOverlayPositionerVariantProps = Partial<ImageFrameOverlayPositionerVariant>;

export declare const imageFrameOverlayPositionerVariantMap: ImageFrameOverlayPositionerVariantMap;

export declare const imageFrameOverlayPositioner: ((
  props?: ImageFrameOverlayPositionerVariantProps,
) => string) & {
  splitVariantProps: <T extends ImageFrameOverlayPositionerVariantProps>(
    props: T,
  ) => [ImageFrameOverlayPositionerVariantProps, Omit<T, keyof ImageFrameOverlayPositionerVariantProps>];
}