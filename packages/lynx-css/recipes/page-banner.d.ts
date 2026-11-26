declare interface PageBannerVariant {
  /**
  * @default false
  */
  extendSafeAreaX: boolean;
/**
  * @default "neutral"
  */
  tone: "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";
/**
  * @default "weak"
  */
  variant: "weak" | "solid";
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  interactive: boolean;
/**
  * @default false
  */
  closeButtonPressed: boolean;
}

declare type PageBannerVariantMap = {
  [key in keyof PageBannerVariant]: Array<PageBannerVariant[key]>;
};

export declare type PageBannerVariantProps = Partial<PageBannerVariant>;

export declare type PageBannerSlotName = "root" | "background" | "content" | "scaleContent" | "body" | "title" | "description" | "button" | "closeButton" | "prefixIcon" | "suffixIcon" | "closeButtonIcon";

export declare const pageBannerVariantMap: PageBannerVariantMap;

export declare const pageBanner: ((
  props?: PageBannerVariantProps,
) => Record<PageBannerSlotName, string>) & {
  splitVariantProps: <T extends PageBannerVariantProps>(
    props: T,
  ) => [PageBannerVariantProps, Omit<T, keyof PageBannerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const pageBannerSeedTagSpec: {
  readonly name: "PageBanner";
  readonly axes: readonly ["tone", "variant"];
  readonly defaults: { readonly tone: "neutral"; readonly variant: "weak" };
};
