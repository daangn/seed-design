declare interface ChipTabsVariant {
  /**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default "neutralSolid"
  */
  variant: "neutralSolid" | "neutralOutline" | "brandSolid";
/**
  * @default "hug"
  */
  contentLayout: "fill" | "hug";
/**
  * @default false
  */
  stickyList: boolean;
}

declare type ChipTabsVariantMap = {
  [key in keyof ChipTabsVariant]: Array<ChipTabsVariant[key]>;
};

export declare type ChipTabsVariantProps = Partial<ChipTabsVariant>;

export declare type ChipTabsSlotName = "root" | "list" | "carousel" | "carouselCamera" | "content" | "trigger";

export declare const chipTabsVariantMap: ChipTabsVariantMap;

export declare const chipTabs: ((
  props?: ChipTabsVariantProps,
) => Record<ChipTabsSlotName, string>) & {
  splitVariantProps: <T extends ChipTabsVariantProps>(
    props: T,
  ) => [ChipTabsVariantProps, Omit<T, keyof ChipTabsVariantProps>];
}