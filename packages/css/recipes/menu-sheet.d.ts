declare interface MenuSheetVariant {
  /**
  * @default false
  */
  skipAnimation: boolean;
}

declare type MenuSheetVariantMap = {
  [key in keyof MenuSheetVariant]: Array<MenuSheetVariant[key]>;
};

export declare type MenuSheetVariantProps = Partial<MenuSheetVariant>;

export declare type MenuSheetSlotName = "backdrop" | "positioner" | "content" | "header" | "title" | "description" | "list" | "group" | "footer" | "closeButton";

export declare const menuSheetVariantMap: MenuSheetVariantMap;

export declare const menuSheet: ((
  props?: MenuSheetVariantProps,
) => Record<MenuSheetSlotName, string>) & {
  splitVariantProps: <T extends MenuSheetVariantProps>(
    props: T,
  ) => [MenuSheetVariantProps, Omit<T, keyof MenuSheetVariantProps>];
}