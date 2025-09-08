declare interface MenuSheetItemVariant {
  /**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
/**
  * @default "left"
  */
  labelAlign: "left" | "center";
}

declare type MenuSheetItemVariantMap = {
  [key in keyof MenuSheetItemVariant]: Array<MenuSheetItemVariant[key]>;
};

export declare type MenuSheetItemVariantProps = Partial<MenuSheetItemVariant>;

export declare const menuSheetItemVariantMap: MenuSheetItemVariantMap;

export declare const menuSheetItem: ((
  props?: MenuSheetItemVariantProps,
) => string) & {
  splitVariantProps: <T extends MenuSheetItemVariantProps>(
    props: T,
  ) => [MenuSheetItemVariantProps, Omit<T, keyof MenuSheetItemVariantProps>];
}