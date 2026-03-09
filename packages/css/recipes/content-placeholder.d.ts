declare interface ContentPlaceholderVariant {
  
}

declare type ContentPlaceholderVariantMap = {
  [key in keyof ContentPlaceholderVariant]: Array<ContentPlaceholderVariant[key]>;
};

export declare type ContentPlaceholderVariantProps = Partial<ContentPlaceholderVariant>;

export declare type ContentPlaceholderSlotName = "root" | "container" | "asset";

export declare const contentPlaceholderVariantMap: ContentPlaceholderVariantMap;

export declare const contentPlaceholder: ((
  props?: ContentPlaceholderVariantProps,
) => Record<ContentPlaceholderSlotName, string>) & {
  splitVariantProps: <T extends ContentPlaceholderVariantProps>(
    props: T,
  ) => [ContentPlaceholderVariantProps, Omit<T, keyof ContentPlaceholderVariantProps>];
}