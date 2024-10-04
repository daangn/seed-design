interface ChipTabVariant {
  variant: "neutralSolid" | "brandWeak"
}

type ChipTabVariantMap = {
  [key in keyof ChipTabVariant]: Array<ChipTabVariant[key]>;
};

export type ChipTabVariantProps = Partial<ChipTabVariant>;

export type ChipTabSlotName = "root" | "label";

export const chipTabVariantMap: ChipTabVariantMap;

export function chipTab(
  props?: ChipTabVariantProps,
): Record<ChipTabSlotName, string>;