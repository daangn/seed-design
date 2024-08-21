interface TabVariant {
  layout: "fill" | "hug";
  size: "medium" | "small"
}

type TabVariantMap = {
  [key in keyof TabVariant]: Array<TabVariant[key]>;
};

export type TabVariantProps = Partial<TabVariant>;

export type TabSlotName = "root" | "label" | "notification";

export const tabVariantMap: TabVariantMap;

export function tab(
  props?: TabVariantProps,
): Record<TabSlotName, string>;