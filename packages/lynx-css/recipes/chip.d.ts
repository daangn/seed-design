declare interface ChipVariant {
  /**
  * @default "solid"
  */
  variant: "solid" | "outlineStrong" | "outlineWeak";
/**
  * @default "medium"
  */
  size: "small" | "medium" | "large";
/**
  * @default "withText"
  */
  layout: "iconOnly" | "withText";
/**
  * @default false
  */
  selected: boolean;
/**
  * @default false
  */
  pressed: boolean;
/**
  * @default false
  */
  disabled: boolean;
}

declare type ChipVariantMap = {
  [key in keyof ChipVariant]: Array<ChipVariant[key]>;
};

export declare type ChipVariantProps = Partial<ChipVariant>;

export declare type ChipSlotName = "root" | "label" | "prefixIcon" | "prefixAvatar" | "suffixIcon" | "icon";

export declare const chipVariantMap: ChipVariantMap;

export declare const chip: ((
  props?: ChipVariantProps,
) => Record<ChipSlotName, string>) & {
  splitVariantProps: <T extends ChipVariantProps>(
    props: T,
  ) => [ChipVariantProps, Omit<T, keyof ChipVariantProps>];
}