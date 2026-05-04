declare interface MenuVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
}

declare type MenuVariantMap = {
  [key in keyof MenuVariant]: Array<MenuVariant[key]>;
};

export declare type MenuVariantProps = Partial<MenuVariant>;

export declare type MenuSlotName = "positioner" | "content" | "scrollArea" | "group" | "groupLabel";

export declare const menuVariantMap: MenuVariantMap;

export declare const menu: ((
  props?: MenuVariantProps,
) => Record<MenuSlotName, string>) & {
  splitVariantProps: <T extends MenuVariantProps>(
    props: T,
  ) => [MenuVariantProps, Omit<T, keyof MenuVariantProps>];
}