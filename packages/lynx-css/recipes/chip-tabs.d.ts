declare interface ChipTabsVariant {
  /**
  * @default false
  */
  extendSafeAreaX: boolean;
/**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default "neutralSolid"
  */
  variant: "neutralSolid" | "neutralOutline";
/**
  * @default "hug"
  */
  contentLayout: "fill" | "hug";
/**
  * @default false
  */
  stickyList: boolean;
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
/**
  * @default false
  */
  inCarousel: boolean;
}

declare type ChipTabsVariantMap = {
  [key in keyof ChipTabsVariant]: Array<ChipTabsVariant[key]>;
};

export declare type ChipTabsVariantProps = Partial<ChipTabsVariant>;

export declare type ChipTabsSlotName = "root" | "list" | "listContent" | "trigger" | "triggerLabel" | "content" | "carousel" | "carouselCamera";

export declare const chipTabsVariantMap: ChipTabsVariantMap;

export declare const chipTabs: ((
  props?: ChipTabsVariantProps,
) => Record<ChipTabsSlotName, string>) & {
  splitVariantProps: <T extends ChipTabsVariantProps>(
    props: T,
  ) => [ChipTabsVariantProps, Omit<T, keyof ChipTabsVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const chipTabsSeedTagSpec: {
  readonly name: "ChipTablist";
  readonly axes: readonly ["variant"];
  readonly defaults: { readonly variant: "neutralSolid" };
};
