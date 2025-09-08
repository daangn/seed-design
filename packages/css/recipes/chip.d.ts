declare interface ChipVariant {
  /**
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