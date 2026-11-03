declare interface TabsVariant {
  /**
  * @default "fill"
  */
  triggerLayout: "fill" | "hug";
/**
  * @default "hug"
  */
  contentLayout: "fill" | "hug";
/**
  * @default "small"
  */
  size: "small" | "medium";
/**
  * @default false
  */
  stickyList: boolean;
/**
  * @default true
  */
  transitionEnabled: boolean;
selected: boolean;
disabled: boolean;
inCarousel: boolean;
}

declare type TabsVariantMap = {
  [key in keyof TabsVariant]: Array<TabsVariant[key]>;
};

export declare type TabsVariantProps = Partial<TabsVariant>;

export declare type TabsSlotName = "root" | "list" | "listContent" | "carousel" | "carouselCamera" | "content" | "indicator" | "trigger" | "triggerLabel";

export declare const tabsVariantMap: TabsVariantMap;

export declare const tabs: ((
  props?: TabsVariantProps,
) => Record<TabsSlotName, string>) & {
  splitVariantProps: <T extends TabsVariantProps>(
    props: T,
  ) => [TabsVariantProps, Omit<T, keyof TabsVariantProps>];
}