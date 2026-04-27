declare interface SwitchmarkVariant {
  /**
  * - `brand`: [deprecated] 주요 버튼 등의 핵심 액션과 시각적으로 충돌하기에 더 이상 사용하지 않습니다.
  *
  * @default "brand"
  */
  tone: "neutral" | "brand";
/**
  * @default 32
  */
  size: "16" | "24" | "32";
}

declare type SwitchmarkVariantMap = {
  [key in keyof SwitchmarkVariant]: Array<SwitchmarkVariant[key]>;
};

export declare type SwitchmarkVariantProps = Partial<SwitchmarkVariant>;

export declare type SwitchmarkSlotName = "root" | "thumb";

export declare const switchmarkVariantMap: SwitchmarkVariantMap;

export declare const switchmark: ((
  props?: SwitchmarkVariantProps,
) => Record<SwitchmarkSlotName, string>) & {
  splitVariantProps: <T extends SwitchmarkVariantProps>(
    props: T,
  ) => [SwitchmarkVariantProps, Omit<T, keyof SwitchmarkVariantProps>];
}