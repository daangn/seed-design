declare interface PageBannerVariant {
  /**
  * @default "weak"
  */
  variant: "weak" | "solid";
/**
  * @default "neutral"
  */
  tone: "neutral" | "informative" | "positive" | "warning" | "critical" | "magic";
}

declare type PageBannerVariantMap = {
  [key in keyof PageBannerVariant]: Array<PageBannerVariant[key]>;
};

export declare type PageBannerVariantProps = Partial<PageBannerVariant>;

export declare type PageBannerSlotName = "root" | "content" | "body" | "title" | "description" | "button" | "closeButton";

export declare const pageBannerVariantMap: PageBannerVariantMap;

export declare const pageBanner: ((
  props?: PageBannerVariantProps,
) => Record<PageBannerSlotName, string>) & {
  splitVariantProps: <T extends PageBannerVariantProps>(
    props: T,
  ) => [PageBannerVariantProps, Omit<T, keyof PageBannerVariantProps>];
}