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

export declare const sliderTickVariantMap: SliderTickVariantMap;

export declare const sliderTick: ((
  props?: SliderTickVariantProps,
) => string) & {
  splitVariantProps: <T extends SliderTickVariantProps>(
    props: T,
  ) => [SliderTickVariantProps, Omit<T, keyof SliderTickVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const sliderTickSeedTagSpec: {
  readonly name: "SliderTick";
  readonly axes: readonly ["weight"];
  readonly defaults: { readonly weight: "thin" };
};
