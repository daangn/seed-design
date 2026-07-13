declare interface ContentDialogVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "large";
}

declare type ContentDialogVariantMap = {
  [key in keyof ContentDialogVariant]: Array<ContentDialogVariant[key]>;
};

export declare type ContentDialogVariantProps = Partial<ContentDialogVariant>;

export declare type ContentDialogSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const contentDialogVariantMap: ContentDialogVariantMap;

export declare const contentDialog: ((
  props?: ContentDialogVariantProps,
) => Record<ContentDialogSlotName, string>) & {
  splitVariantProps: <T extends ContentDialogVariantProps>(
    props: T,
  ) => [ContentDialogVariantProps, Omit<T, keyof ContentDialogVariantProps>];
}