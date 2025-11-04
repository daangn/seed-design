declare interface SliderMarkerVariant {
  /**
  * @default "center"
  */
  align: "start" | "center" | "end";
}

declare type SliderMarkerVariantMap = {
  [key in keyof SliderMarkerVariant]: Array<SliderMarkerVariant[key]>;
};

export declare type SliderMarkerVariantProps = Partial<SliderMarkerVariant>;

export declare const sliderMarkerVariantMap: SliderMarkerVariantMap;

export declare const sliderMarker: ((
  props?: SliderMarkerVariantProps,
) => string) & {
  splitVariantProps: <T extends SliderMarkerVariantProps>(
    props: T,
  ) => [SliderMarkerVariantProps, Omit<T, keyof SliderMarkerVariantProps>];
}