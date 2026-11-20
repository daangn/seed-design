declare interface TabsVariant {
  /**
  * @default false
  */
  extendSafeAreaX: boolean;
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
/**
  * @default true
  */
  indicatorMeasured: boolean;
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const tabsSeedTagSpec: {
  readonly name: "Tablist";
  readonly axes: readonly ["layout", "size"];
  readonly defaults: { readonly size: "small" };
};
