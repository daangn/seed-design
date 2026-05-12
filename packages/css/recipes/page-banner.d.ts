declare interface PageBannerVariant {
  /**
  * - `weak`: 배경색이 연한 스타일입니다.
  * - `solid`: 배경색이 진한 스타일입니다.
  *
  * @default "weak"
  */
  variant: "weak" | "solid";
/**
  * - `magic`: AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.
  *
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