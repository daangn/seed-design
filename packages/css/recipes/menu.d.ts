declare interface MenuVariant {
  /**
  * @default "small"
  */
  size: "small" | "medium";
}

declare type MenuVariantMap = {
  [key in keyof MenuVariant]: Array<MenuVariant[key]>;
};

export declare type MenuVariantProps = Partial<MenuVariant>;

export declare type MenuSlotName = "positioner" | "content" | "group" | "groupHeader" | "item" | "itemLabel" | "divider";

export declare const menuVariantMap: MenuVariantMap;

export declare const menu: ((
  props?: MenuVariantProps,
) => Record<MenuSlotName, string>) & {
  splitVariantProps: <T extends MenuVariantProps>(
    props: T,
  ) => [MenuVariantProps, Omit<T, keyof MenuVariantProps>];
}