interface TabsVariant {
  layout: "fill" | "hug"
}

type TabsVariantMap = {
  [key in keyof TabsVariant]: Array<TabsVariant[key]>;
};

export type TabsVariantProps = Partial<TabsVariant>;

export type TabsSlotName = "root" | "triggerList" | "contentList" | "contentCamera" | "content" | "indicator";

export const tabsVariantMap: TabsVariantMap;

export function tabs(
  props?: TabsVariantProps,
): Record<TabsSlotName, string>;