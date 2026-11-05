declare interface ChipVariant {
  /**
  * - `solid`: 기본 스타일입니다.
  * - `outlineStrong`: 명확한 구분이 필요한 경우 사용합니다.
  * - `outlineWeak`: Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.
  *
  * @default "solid"
  */
  variant: "solid" | "outlineStrong" | "outlineWeak";
/**
  * @default "medium"
  */
  size: "large" | "medium" | "small";
/**
  * @default "withText"
  */
  layout: "iconOnly" | "withText";
}

declare type ChipVariantMap = {
  [key in keyof ChipVariant]: Array<ChipVariant[key]>;
};

export declare type ChipVariantProps = Partial<ChipVariant>;

export declare type ChipSlotName = "root" | "label" | "prefixIcon" | "suffixIcon" | "prefixAvatar";

export declare const chipVariantMap: ChipVariantMap;

export declare const chip: ((
  props?: ChipVariantProps,
) => Record<ChipSlotName, string>) & {
  splitVariantProps: <T extends ChipVariantProps>(
    props: T,
  ) => [ChipVariantProps, Omit<T, keyof ChipVariantProps>];
}