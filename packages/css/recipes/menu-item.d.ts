declare interface MenuItemVariant {
  /**
  * - `medium`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
  * - `small`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
  * - `responsive`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `medium`, `lg` 이상에서는 `small`로 적용됩니다.
  *
  * @default "medium"
  */
  size: "medium" | "small" | "responsive";
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

export declare type MenuItemSlotName = "root" | "layout" | "body" | "label" | "description";

export declare const menuItemVariantMap: MenuItemVariantMap;

export declare const menuItem: ((
  props?: MenuItemVariantProps,
) => Record<MenuItemSlotName, string>) & {
  splitVariantProps: <T extends MenuItemVariantProps>(
    props: T,
  ) => [MenuItemVariantProps, Omit<T, keyof MenuItemVariantProps>];
}