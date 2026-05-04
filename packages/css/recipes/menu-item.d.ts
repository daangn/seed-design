declare interface MenuItemVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
/**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
}

declare type MenuItemVariantMap = {
  [key in keyof MenuItemVariant]: Array<MenuItemVariant[key]>;
};

export declare type MenuItemVariantProps = Partial<MenuItemVariant>;

export declare type MenuItemSlotName = "root" | "body" | "label" | "description";

export declare const menuItemVariantMap: MenuItemVariantMap;

export declare const menuItem: ((
  props?: MenuItemVariantProps,
) => Record<MenuItemSlotName, string>) & {
  splitVariantProps: <T extends MenuItemVariantProps>(
    props: T,
  ) => [MenuItemVariantProps, Omit<T, keyof MenuItemVariantProps>];
}