declare interface SelectVariant {
  /**
  * - `large`: 뷰포트 너비와 관계없이 사용할 수 있습니다.
  * - `medium`: Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.
  * - `responsive`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `large`, `lg` 이상에서는 `medium`으로 적용됩니다.
  *
  * @default "large"
  */
  size: "large" | "medium" | "responsive";
}

declare type SelectVariantMap = {
  [key in keyof SelectVariant]: Array<SelectVariant[key]>;
};

export declare type SelectVariantProps = Partial<SelectVariant>;

export declare type SelectSlotName = "positioner" | "content" | "scrollArea" | "group" | "groupLabel" | "item" | "itemBody" | "itemLabel" | "itemDescription" | "itemIndicator";

export declare const selectVariantMap: SelectVariantMap;

export declare const select: ((
  props?: SelectVariantProps,
) => Record<SelectSlotName, string>) & {
  splitVariantProps: <T extends SelectVariantProps>(
    props: T,
  ) => [SelectVariantProps, Omit<T, keyof SelectVariantProps>];
}