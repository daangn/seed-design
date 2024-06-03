interface ChipVariant {
  size: "medium" | "small";
  variant: "default" | "inverted"
}

type ChipVariantMap = {
  [key in keyof ChipVariant]: Array<ChipVariant[key]>;
};

export type ChipVariantProps = Partial<ChipVariant>;

export type ChipSlotName = "root" | "label" | "prefix" | "suffix" | "count";

export const chipVariantMap: ChipVariantMap;

export function chip(
  props?: ChipVariantProps,
): Record<ChipSlotName, string>;