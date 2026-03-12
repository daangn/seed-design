declare interface ContentPlaceholderVariant {
  /**
  * @default "default"
  */
  type: "default" | "buySell" | "car" | "commerce" | "coupon" | "food" | "group" | "image" | "jobs" | "business" | "post" | "realty";
}

declare type ContentPlaceholderVariantMap = {
  [key in keyof ContentPlaceholderVariant]: Array<ContentPlaceholderVariant[key]>;
};

export declare type ContentPlaceholderVariantProps = Partial<ContentPlaceholderVariant>;

export declare type ContentPlaceholderSlotName = "root" | "asset";

export declare const contentPlaceholderVariantMap: ContentPlaceholderVariantMap;

export declare const contentPlaceholder: ((
  props?: ContentPlaceholderVariantProps,
) => Record<ContentPlaceholderSlotName, string>) & {
  splitVariantProps: <T extends ContentPlaceholderVariantProps>(
    props: T,
  ) => [ContentPlaceholderVariantProps, Omit<T, keyof ContentPlaceholderVariantProps>];
}