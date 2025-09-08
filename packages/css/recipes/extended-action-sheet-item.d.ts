declare interface ExtendedActionSheetItemVariant {
  /**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
}

declare type ExtendedActionSheetItemVariantMap = {
  [key in keyof ExtendedActionSheetItemVariant]: Array<ExtendedActionSheetItemVariant[key]>;
};

export declare type ExtendedActionSheetItemVariantProps = Partial<ExtendedActionSheetItemVariant>;

export declare const extendedActionSheetItemVariantMap: ExtendedActionSheetItemVariantMap;

export declare const extendedActionSheetItem: ((
  props?: ExtendedActionSheetItemVariantProps,
) => string) & {
  splitVariantProps: <T extends ExtendedActionSheetItemVariantProps>(
    props: T,
  ) => [ExtendedActionSheetItemVariantProps, Omit<T, keyof ExtendedActionSheetItemVariantProps>];
}