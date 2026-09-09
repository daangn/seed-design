declare interface MenuItemVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
/**
  * @default "neutral"
  */
  tone: "neutral" | "critical";
/**
  * @default false
  */
  disabled: boolean;
/**
  * @default false
  */
  pressed: boolean;
}

declare type MenuItemVariantMap = {
  [key in keyof MenuItemVariant]: Array<MenuItemVariant[key]>;
};

export declare type MenuItemVariantProps = Partial<MenuItemVariant>;

export declare type MenuItemSlotName = "root" | "pressedOverlay" | "body" | "label" | "description" | "prefixIcon" | "suffixIcon";

export declare const menuItemVariantMap: MenuItemVariantMap;

export declare const menuItem: ((
  props?: MenuItemVariantProps,
) => Record<MenuItemSlotName, string>) & {
  splitVariantProps: <T extends MenuItemVariantProps>(
    props: T,
  ) => [MenuItemVariantProps, Omit<T, keyof MenuItemVariantProps>];
}