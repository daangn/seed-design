declare interface CheckmarkVariant {
  /**
  * - `square`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.
  * - `ghost`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
  *
  * @default "square"
  */
  variant: "square" | "ghost";
/**
  * - `brand`: [deprecated] 주요 버튼 등의 핵심 액션과 시각적으로 충돌하기에 더 이상 사용하지 않습니다.
  *
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default "medium"
  */
  size: "large" | "medium";
}

declare type CheckmarkVariantMap = {
  [key in keyof CheckmarkVariant]: Array<CheckmarkVariant[key]>;
};

export declare type CheckmarkVariantProps = Partial<CheckmarkVariant>;

export declare type CheckmarkSlotName = "root" | "icon";

export declare const checkmarkVariantMap: CheckmarkVariantMap;

export declare const checkmark: ((
  props?: CheckmarkVariantProps,
) => Record<CheckmarkSlotName, string>) & {
  splitVariantProps: <T extends CheckmarkVariantProps>(
    props: T,
  ) => [CheckmarkVariantProps, Omit<T, keyof CheckmarkVariantProps>];
}