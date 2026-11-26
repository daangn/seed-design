declare interface ScrollFogVariant {
  /**
  * @default false
  */
  top: boolean;
/**
  * @default false
  */
  bottom: boolean;
/**
  * @default false
  */
  left: boolean;
/**
  * @default false
  */
  right: boolean;
}

declare type ScrollFogVariantMap = {
  [key in keyof ScrollFogVariant]: Array<ScrollFogVariant[key]>;
};

export declare type ScrollFogVariantProps = Partial<ScrollFogVariant>;

export declare type ScrollFogSlotName = "root" | "topMask" | "bottomMask" | "leftMask" | "rightMask";

export declare const scrollFogVariantMap: ScrollFogVariantMap;

export declare const scrollFog: ((
  props?: ScrollFogVariantProps,
) => Record<ScrollFogSlotName, string>) & {
  splitVariantProps: <T extends ScrollFogVariantProps>(
    props: T,
  ) => [ScrollFogVariantProps, Omit<T, keyof ScrollFogVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const scrollFogSeedTagSpec: {
  readonly name: "ScrollFog";
  readonly axes: readonly [];
  readonly defaults: {};
};
