interface ActionChipVariant {
  size: "medium" | "small";
  layout: "text" | "iconOnly"
}

type ActionChipVariantMap = {
  [key in keyof ActionChipVariant]: Array<ActionChipVariant[key]>;
};

export type ActionChipVariantProps = Partial<ActionChipVariant>;

export type ActionChipSlotName = "root" | "label" | "icon" | "prefix" | "suffix" | "count";

export const actionChipVariantMap: ActionChipVariantMap;

export function actionChip(
  props?: ActionChipVariantProps,
): Record<ActionChipSlotName, string>;