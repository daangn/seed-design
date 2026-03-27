declare interface ExtendedActionSheetVariant {
  
}

declare type ExtendedActionSheetVariantMap = {
  [key in keyof ExtendedActionSheetVariant]: Array<ExtendedActionSheetVariant[key]>;
};

export declare type ExtendedActionSheetVariantProps = Partial<ExtendedActionSheetVariant>;

export declare type ExtendedActionSheetSlotName = "backdrop" | "positioner" | "content" | "header" | "title" | "list" | "group" | "footer" | "closeButton";

export declare const extendedActionSheetVariantMap: ExtendedActionSheetVariantMap;

export declare const extendedActionSheet: ((
  props?: ExtendedActionSheetVariantProps,
) => Record<ExtendedActionSheetSlotName, string>) & {
  splitVariantProps: <T extends ExtendedActionSheetVariantProps>(
    props: T,
  ) => [ExtendedActionSheetVariantProps, Omit<T, keyof ExtendedActionSheetVariantProps>];
}