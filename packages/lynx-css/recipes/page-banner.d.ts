declare interface PageBannerVariant {
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
  closeButtonPressed: boolean;
}

declare type PageBannerVariantMap = {
  [key in keyof PageBannerVariant]: Array<PageBannerVariant[key]>;
};

export declare type PageBannerVariantProps = Partial<PageBannerVariant>;

export declare type PageBannerSlotName = "root" | "content" | "body" | "title" | "description" | "button" | "closeButton" | "prefixIcon" | "suffixIcon" | "closeButtonIcon";

export declare const pageBannerVariantMap: PageBannerVariantMap;

export declare const pageBanner: ((
  props?: PageBannerVariantProps,
) => Record<PageBannerSlotName, string>) & {
  splitVariantProps: <T extends PageBannerVariantProps>(
    props: T,
  ) => [PageBannerVariantProps, Omit<T, keyof PageBannerVariantProps>];
}