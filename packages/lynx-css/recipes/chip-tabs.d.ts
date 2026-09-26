declare interface ChipTabsVariant {
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