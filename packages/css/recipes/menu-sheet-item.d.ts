declare interface MenuSheetItemVariant {
  /**
  * - `neutral`: 일반적인 작업을 수행하는 기본 아이템입니다.
  * - `critical`: 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
  *
  * @default "neutral"
  */
  tone: "neutral" | "critical";
/**
  * - `left`: 라벨을 왼쪽 정렬합니다.
  * - `center`: 라벨을 중앙 정렬합니다.
  *
  * @default "left"
  */
  labelAlign: "left" | "center";
}

declare type MenuSheetItemVariantMap = {
  [key in keyof MenuSheetItemVariant]: Array<MenuSheetItemVariant[key]>;
};

export declare type MenuSheetItemVariantProps = Partial<MenuSheetItemVariant>;

export declare type MenuSheetItemSlotName = "root" | "content" | "label" | "description";

export declare const menuSheetItemVariantMap: MenuSheetItemVariantMap;

export declare const menuSheetItem: ((
  props?: MenuSheetItemVariantProps,
) => Record<MenuSheetItemSlotName, string>) & {
  splitVariantProps: <T extends MenuSheetItemVariantProps>(
    props: T,
  ) => [MenuSheetItemVariantProps, Omit<T, keyof MenuSheetItemVariantProps>];
}