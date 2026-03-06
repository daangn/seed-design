declare interface SliderVariant {
  
}

declare type SliderVariantMap = {
  [key in keyof SliderVariant]: Array<SliderVariant[key]>;
};

export declare type SliderVariantProps = Partial<SliderVariant>;

export declare type SliderSlotName = "root" | "track" | "control" | "range" | "thumb" | "tick" | "markers" | "valueIndicatorRoot" | "valueIndicatorArrow" | "valueIndicatorArrowTip";

export declare const sliderVariantMap: SliderVariantMap;

export declare const slider: ((
  props?: SliderVariantProps,
) => Record<SliderSlotName, string>) & {
  splitVariantProps: <T extends SliderVariantProps>(
    props: T,
  ) => [SliderVariantProps, Omit<T, keyof SliderVariantProps>];
}