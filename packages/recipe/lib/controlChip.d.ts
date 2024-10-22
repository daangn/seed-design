interface ControlChipVariant {
  size: "medium" | "small";
  layout: "withText" | "iconOnly"
}

type ControlChipVariantMap = {
  [key in keyof ControlChipVariant]: Array<ControlChipVariant[key]>;
};

export type ControlChipVariantProps = Partial<ControlChipVariant>;

export type ControlChipSlotName = "root" | "label" | "icon" | "prefixIcon" | "suffixIcon" | "count";

export const controlChipVariantMap: ControlChipVariantMap;

export function controlChip(
  props?: ControlChipVariantProps,
): Record<ControlChipSlotName, string>;