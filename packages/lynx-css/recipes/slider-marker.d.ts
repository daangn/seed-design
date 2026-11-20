declare interface SliderMarkerVariant {
  /**
  * @default "center"
  */
  align: "start" | "center" | "end";
/**
  * @default "ltr"
  */
  dir: "ltr" | "rtl";
/**
  * @default false
  */
  disabled: boolean;
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const sliderMarkerSeedTagSpec: {
  readonly name: "SliderMarker";
  readonly axes: readonly [];
  readonly defaults: {};
};
