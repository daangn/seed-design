declare interface MenuItemVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "small";
/**
  * - `neutral`: 일반적인 작업을 수행하는 기본 아이템입니다.
  * - `critical`: 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
  *
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