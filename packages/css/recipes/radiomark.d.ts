declare interface RadiomarkVariant {
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

declare type RadiomarkVariantMap = {
  [key in keyof RadiomarkVariant]: Array<RadiomarkVariant[key]>;
};

export declare type RadiomarkVariantProps = Partial<RadiomarkVariant>;

export declare type RadiomarkSlotName = "root" | "icon";

export declare const radiomarkVariantMap: RadiomarkVariantMap;

export declare const radiomark: ((
  props?: RadiomarkVariantProps,
) => Record<RadiomarkSlotName, string>) & {
  splitVariantProps: <T extends RadiomarkVariantProps>(
    props: T,
  ) => [RadiomarkVariantProps, Omit<T, keyof RadiomarkVariantProps>];
}