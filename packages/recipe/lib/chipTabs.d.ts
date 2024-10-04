interface ChipTabsVariant {
  variant: "neutralSolid" | "brandWeak"
}

type ChipTabsVariantMap = {
  [key in keyof ChipTabsVariant]: Array<ChipTabsVariant[key]>;
};

export type ChipTabsVariantProps = Partial<ChipTabsVariant>;

export type ChipTabsSlotName = "root" | "triggerList" | "contentList" | "contentCamera" | "content";

export const chipTabsVariantMap: ChipTabsVariantMap;

export function chipTabs(
  props?: ChipTabsVariantProps,
): Record<ChipTabsSlotName, string>;