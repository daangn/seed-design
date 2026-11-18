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
glass: boolean;
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

// Generated from Rootage component specs and color tokens by scripts/generate-glass-tint.mjs. Do not edit directly.
// Liquid Glass tint (`root.color`) per variant and state, resolved for each color scheme.
export interface GlassTint {
  light: string;
  dark: string;
}

export declare const glassTint: {
  variantSolid: {
    enabled: GlassTint;
    pressed: GlassTint;
    selected: GlassTint;
    selectedPressed: GlassTint;
  };
  variantOutlineStrong: {
    enabled: GlassTint;
    pressed: GlassTint;
    selected: GlassTint;
    selectedPressed: GlassTint;
  };
  variantOutlineWeak: {
    enabled: GlassTint;
    pressed: GlassTint;
    selected: GlassTint;
    selectedPressed: GlassTint;
  };
};
