interface ActionChipVariant {
  size: "medium" | "small"
}

type ActionChipVariantMap = {
  [key in keyof ActionChipVariant]: Array<ActionChipVariant[key]>;
};

export type ActionChipVariantProps = Partial<ActionChipVariant>;

export type ActionChipSlotName = "root" | "label" | "prefix" | "suffix" | "count";

export const actionChipVariantMap: ActionChipVariantMap;

export function actionChip(
  props?: ActionChipVariantProps,
): Record<ActionChipSlotName, string>;