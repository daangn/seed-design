declare interface SliderMarkerVariant {
  /**
  * @default "center"
  */
  align: "start" | "center" | "end";
  disabled?: boolean;
  loading?: boolean;}

declare type SliderMarkerVariantMap = {
  [key in keyof SliderMarkerVariant]: Array<SliderMarkerVariant[key]>;
};

export declare type SliderMarkerVariantProps = Partial<SliderMarkerVariant>;

export declare type SliderMarkerSlotName = "root" | "text";

export declare const sliderMarkerVariantMap: SliderMarkerVariantMap;

export declare const sliderMarker: ((
  props?: SliderMarkerVariantProps,
) => Record<SliderMarkerSlotName, string>) & {
  splitVariantProps: <T extends SliderMarkerVariantProps>(
    props: T,
  ) => [SliderMarkerVariantProps, Omit<T, keyof SliderMarkerVariantProps>];
}