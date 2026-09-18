declare interface SliderVariant {
  /**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  dragging: boolean;
/**
  * @default false
  */
  thumbDragging: boolean;
/**
  * @default false
  */
  valueIndicatorShown: boolean;
/**
  * @default false
  */
  valueIndicatorEverShown: boolean;
}

declare type SliderVariantMap = {
  [key in keyof SliderVariant]: Array<SliderVariant[key]>;
};

export declare type SliderVariantProps = Partial<SliderVariant>;

export declare type SliderSlotName = "root" | "control" | "track" | "range" | "thumb" | "markers" | "valueIndicatorMotion" | "valueIndicatorRoot" | "valueIndicatorArrow" | "valueIndicatorArrowTip" | "valueIndicatorLabel";

export declare const sliderVariantMap: SliderVariantMap;

export declare const slider: ((
  props?: SliderVariantProps,
) => Record<SliderSlotName, string>) & {
  splitVariantProps: <T extends SliderVariantProps>(
    props: T,
  ) => [SliderVariantProps, Omit<T, keyof SliderVariantProps>];
}