declare interface SliderTickVariant {
  /**
  * @default "thin"
  */
  weight: "thin" | "thick";
}

declare type SliderTickVariantMap = {
  [key in keyof SliderTickVariant]: Array<SliderTickVariant[key]>;
};

export declare type SliderTickVariantProps = Partial<SliderTickVariant>;

export declare type SliderTickSlotName = "root" | "text";

export declare const sliderTickVariantMap: SliderTickVariantMap;

export declare const sliderTick: ((
  props?: SliderTickVariantProps,
) => Record<SliderTickSlotName, string>) & {
  splitVariantProps: <T extends SliderTickVariantProps>(
    props: T,
  ) => [SliderTickVariantProps, Omit<T, keyof SliderTickVariantProps>];
}