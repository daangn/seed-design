declare interface MenuVariant {
  /**
  * - `medium`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
  * - `small`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
  * - `responsive`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `medium`, `lg` 이상에서는 `small`로 적용됩니다.
  *
  * @default "medium"
  */
  size: "medium" | "small" | "responsive";
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